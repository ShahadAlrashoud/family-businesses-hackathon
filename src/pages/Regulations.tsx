import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FileText, Plus, Calendar, Filter, FolderOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type RegCategory = "ownership" | "succession" | "exit" | "disputes" | "womens_role";
type RegStatus = "draft" | "active";

const categoryLabels: Record<RegCategory, string> = {
  ownership: "الملكية",
  succession: "التوارث",
  exit: "الخروج",
  disputes: "النزاعات",
  womens_role: "دور المرأة",
};

const statusLabels: Record<RegStatus, string> = {
  draft: "مسودة",
  active: "نافذة",
};

const categoryColors: Record<RegCategory, string> = {
  ownership: "bg-primary/10 text-primary border-primary/20",
  succession: "bg-accent/20 text-accent-foreground border-accent/30",
  exit: "bg-destructive/10 text-destructive border-destructive/20",
  disputes: "bg-muted text-muted-foreground border-border",
  womens_role: "bg-secondary/50 text-secondary-foreground border-secondary",
};

const statusColors: Record<RegStatus, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  active: "bg-primary/10 text-primary border-primary/20",
};

export default function Regulations() {
  const { role } = useAuth();
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<RegCategory>("ownership");
  const [status, setStatus] = useState<RegStatus>("draft");
  const [content, setContent] = useState("");

  const { data: regulations = [], isLoading } = useQuery({
    queryKey: ["regulations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("regulations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("regulations").insert({
        title,
        category,
        status,
        content,
        created_by: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regulations"] });
      toast.success("تم إضافة اللائحة بنجاح");
      setShowAdd(false);
      setTitle("");
      setCategory("ownership");
      setStatus("draft");
      setContent("");
    },
    onError: () => toast.error("حدث خطأ أثناء إضافة اللائحة"),
  });

  const filtered = regulations.filter((r) => {
    if (filterCategory !== "all" && r.category !== filterCategory) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">اللوائح والأنظمة</h1>
            <p className="text-muted-foreground text-sm">إدارة ومراجعة جميع اللوائح الداخلية للشركة</p>
          </div>
          {role === "admin" && (
            <Button onClick={() => setShowAdd(true)} className="btn-transition gap-2">
              <Plus className="w-4 h-4" />
              إضافة لائحة
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="التصنيف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع التصنيفات</SelectItem>
              {(Object.keys(categoryLabels) as RegCategory[]).map((k) => (
                <SelectItem key={k} value={k}>{categoryLabels[k]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="draft">مسودة</SelectItem>
              <SelectItem value="active">نافذة</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 space-y-3">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="card-hover">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <FolderOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">لا توجد لوائح</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                {regulations.length === 0
                  ? "لم يتم إضافة أي لوائح بعد. ابدأ بإضافة أول لائحة."
                  : "لا توجد نتائج تطابق الفلترة الحالية."}
              </p>
              {role === "admin" && regulations.length === 0 && (
                <Button onClick={() => setShowAdd(true)} className="mt-4 btn-transition gap-2">
                  <Plus className="w-4 h-4" />
                  إضافة لائحة جديدة
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((reg) => (
              <Card key={reg.id} className="card-hover cursor-pointer">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground leading-tight">{reg.title}</h3>
                      {reg.content && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{reg.content}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={categoryColors[reg.category as RegCategory]}>
                        {categoryLabels[reg.category as RegCategory]}
                      </Badge>
                      <Badge variant="outline" className={statusColors[reg.status as RegStatus]}>
                        {statusLabels[reg.status as RegStatus]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(reg.created_at).toLocaleDateString("ar-SA")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Regulation Modal */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة لائحة جديدة</DialogTitle>
            <DialogDescription>أدخل تفاصيل اللائحة الجديدة</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>عنوان اللائحة</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: لائحة الملكية" />
            </div>
            <div className="space-y-2">
              <Label>التصنيف</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as RegCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(categoryLabels) as RegCategory[]).map((k) => (
                    <SelectItem key={k} value={k}>{categoryLabels[k]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as RegStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">مسودة</SelectItem>
                  <SelectItem value="active">نافذة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>المحتوى</Label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="نص اللائحة..." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>إلغاء</Button>
            <Button onClick={() => addMutation.mutate()} disabled={!title.trim() || addMutation.isPending} className="btn-transition">
              {addMutation.isPending ? "جاري الإضافة..." : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
