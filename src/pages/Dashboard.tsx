import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Vote, Users, TrendingUp } from "lucide-react";

const stats = [
  { title: "اللوائح النشطة", value: "12", icon: FileText, change: "+2 هذا الشهر" },
  { title: "التصويتات المفتوحة", value: "3", icon: Vote, change: "2 تنتهي قريباً" },
  { title: "إجمالي المساهمين", value: "48", icon: Users, change: "+5 جدد" },
  { title: "نسبة المشاركة", value: "87%", icon: TrendingUp, change: "↑ 3% عن السابق" },
];

export default function Dashboard() {
  const { role } = useAuth();

  const roleLabels: Record<string, string> = {
    admin: "مدير النظام",
    shareholder: "مساهم",
    independent_director: "مدير مستقل",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
          <p className="text-muted-foreground">
            مرحباً، أنت مسجل كـ <span className="text-primary font-medium">{roleLabels[role || "shareholder"]}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {role === "admin" && (
          <Card>
            <CardHeader>
              <CardTitle>إدارة النظام</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                كمدير نظام، يمكنك إدارة جميع اللوائح والمساهمين والتصويتات وإعدادات المنصة.
              </p>
            </CardContent>
          </Card>
        )}

        {role === "independent_director" && (
          <Card>
            <CardHeader>
              <CardTitle>لوحة المدير المستقل</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                كمدير مستقل، يمكنك مراجعة اللوائح والمشاركة في التصويتات والاطلاع على تقارير الحوكمة.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
