import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Vote, Users, BookOpen, Lightbulb, ClipboardList } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type DashboardRole = "admin" | "shareholder" | "independent_director";

const chartPalette = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))"];

const dashboardContent: Record<DashboardRole, {
  title: string;
  description: string;
  stats: Array<{ title: string; value: string; note: string; icon: typeof FileText }>;
  comparison: Array<{ name: string; value: number }>;
  distribution: Array<{ name: string; value: number }>;
  highlights: string[];
}> = {
  admin: {
    title: "مركز تحكم الإدارة",
    description: "رؤية فورية لحالة اللوائح والمستخدمين والتصويتات المعلقة على مستوى المنصة.",
    stats: [
      { title: "إجمالي اللوائح", value: "24", note: "4 تحتاج تحديثاً هذا الربع", icon: FileText },
      { title: "إجمالي المستخدمين", value: "128", note: "+12 مستخدماً جديداً هذا الشهر", icon: Users },
      { title: "التصويتات المعلقة", value: "6", note: "2 تحتاج اعتماداً عاجلاً", icon: Vote },
    ],
    comparison: [
      { name: "اللوائح", value: 24 },
      { name: "المستخدمون", value: 128 },
      { name: "التصويتات المعلقة", value: 6 },
    ],
    distribution: [
      { name: "نافذة", value: 16 },
      { name: "قيد المراجعة", value: 5 },
      { name: "مسودات", value: 3 },
    ],
    highlights: ["ارتفعت مشاركة المستخدمين 18% عن الشهر الماضي", "آخر لائحة محدثة: لائحة الإفصاح والشفافية"],
  },
  shareholder: {
    title: "لوحة المساهم",
    description: "متابعة سريعة لما يخصك من لوائح نشطة وتصويتاتك وميثاق العائلة.",
    stats: [
      { title: "اللوائح النشطة", value: "12", note: "3 لوائح جديدة هذا الشهر", icon: FileText },
      { title: "تصويتاتي", value: "8", note: "منها 2 بانتظار إتمام التصويت", icon: Vote },
      { title: "ميثاق العائلة", value: "محدّث", note: "آخر تحديث منذ 14 يوماً", icon: BookOpen },
    ],
    comparison: [
      { name: "لوائح نشطة", value: 12 },
      { name: "تصويتاتي", value: 8 },
      { name: "بنود الميثاق", value: 15 },
    ],
    distribution: [
      { name: "تم التصويت", value: 6 },
      { name: "قيد التنفيذ", value: 2 },
      { name: "بنود الميثاق", value: 15 },
    ],
    highlights: ["آخر تصويت شاركت فيه: اعتماد الميزانية السنوية", "يوجد بندان جديدان في ميثاق العائلة للمراجعة"],
  },
  independent_director: {
    title: "لوحة المدير المستقل",
    description: "نظرة عملية على اللوائح الحالية وتوصياتك المفتوحة والمغلقة.",
    stats: [
      { title: "اللوائح", value: "18", note: "5 ملفات تحتاج مراجعة موضوعية", icon: ClipboardList },
      { title: "توصياتي", value: "11", note: "7 توصيات قيد المتابعة", icon: Lightbulb },
    ],
    comparison: [
      { name: "اللوائح", value: 18 },
      { name: "توصياتي", value: 11 },
      { name: "مراجعات عاجلة", value: 4 },
    ],
    distribution: [
      { name: "معتمدة", value: 4 },
      { name: "قيد المراجعة", value: 5 },
      { name: "جديدة", value: 2 },
    ],
    highlights: ["أعلى أولوية حالياً: تعارض المصالح", "تم اعتماد 4 توصيات خلال آخر 30 يوماً"],
  },
};

export default function Dashboard() {
  const { role } = useAuth();
  const resolvedRole = (role || "shareholder") as DashboardRole;
  const currentContent = dashboardContent[resolvedRole];

  const roleLabels: Record<string, string> = {
    admin: "مدير النظام",
    shareholder: "مساهم",
    independent_director: "مدير مستقل",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge variant="outline" className="mb-3 bg-primary/10 text-primary border-primary/20">
              {roleLabels[resolvedRole]}
            </Badge>
            <h1 className="text-3xl font-bold text-foreground">لوحة التحكم</h1>
            <p className="text-muted-foreground mt-2">{currentContent.description}</p>
          </div>
          <Card className="glass-card min-w-[260px] border-border/60">
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground">المشهد الحالي</p>
              <p className="mt-2 text-xl font-bold text-foreground">{currentContent.title}</p>
            </CardContent>
          </Card>
        </div>

        <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${currentContent.stats.length > 2 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
          {currentContent.stats.map((stat) => (
            <Card key={stat.title} className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>مقارنة المؤشرات</CardTitle>
              <CardDescription>عرض بصري سريع لأهم الأرقام المرتبطة بدورك الحالي.</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentContent.comparison}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted) / 0.35)" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "12px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>توزيع الحالة</CardTitle>
              <CardDescription>ملخص سريع يوضح أين تتركز متابعاتك حالياً.</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={currentContent.distribution} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={4}>
                    {currentContent.distribution.map((entry, index) => (
                      <Cell key={entry.name} fill={chartPalette[index % chartPalette.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "12px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ملاحظات سريعة</CardTitle>
            <CardDescription>أهم ما يجب الانتباه له وفق دورك في المنصة.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {currentContent.highlights.map((item) => (
              <div key={item} className="rounded-2xl border border-border/70 bg-muted/40 px-4 py-4 text-sm text-foreground transition-colors duration-200 hover:bg-muted/70">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
