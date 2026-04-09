import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export default function Settings() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">الإعدادات</h1>
          <p className="text-muted-foreground">إدارة إعدادات حسابك والمنصة</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>معلومات الحساب</CardTitle>
            <CardDescription>تحديث بيانات حسابك الشخصية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>البريد الإلكتروني</Label>
              <Input value={user?.email || ""} disabled dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>الاسم الكامل</Label>
              <Input defaultValue={user?.user_metadata?.full_name || ""} placeholder="الاسم الكامل" />
            </div>
            <Button>حفظ التغييرات</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الأمان</CardTitle>
            <CardDescription>تغيير كلمة المرور وإعدادات الأمان</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>كلمة المرور الجديدة</Label>
              <Input type="password" placeholder="••••••••" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>تأكيد كلمة المرور</Label>
              <Input type="password" placeholder="••••••••" dir="ltr" />
            </div>
            <Button>تحديث كلمة المرور</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
