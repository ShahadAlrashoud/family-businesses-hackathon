import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const members = [
  { name: "أحمد الفهد", role: "مدير", email: "ahmed@example.com", shares: "15%" },
  { name: "سارة المنصور", role: "مدير مستقل", email: "sara@example.com", shares: "-" },
  { name: "محمد العلي", role: "مساهم", email: "mohammed@example.com", shares: "8%" },
  { name: "نورة القحطاني", role: "مساهم", email: "noura@example.com", shares: "5%" },
  { name: "خالد الدوسري", role: "مدير مستقل", email: "khalid@example.com", shares: "-" },
  { name: "فاطمة الشمري", role: "مساهم", email: "fatima@example.com", shares: "3%" },
];

const roleBadgeClass: Record<string, string> = {
  "مدير": "bg-accent/10 text-accent-foreground border-accent/30",
  "مدير مستقل": "bg-primary/10 text-primary border-primary/20",
  "مساهم": "bg-muted text-muted-foreground",
};

export default function Members() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">المساهمون والأعضاء</h1>
          <p className="text-muted-foreground">عرض بيانات جميع المساهمين وأعضاء مجلس الإدارة</p>
        </div>

        <div className="grid gap-3">
          {members.map((m) => (
            <Card key={m.email} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4 py-4">
                <Avatar className="h-11 w-11 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {m.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{m.name}</h3>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
                <div className="text-left text-sm text-muted-foreground hidden sm:block">
                  {m.shares !== "-" && <span>الحصة: {m.shares}</span>}
                </div>
                <Badge variant="outline" className={roleBadgeClass[m.role]}>
                  {m.role}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
