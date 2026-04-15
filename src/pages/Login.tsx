import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, CheckCircle2, ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Login() {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login";
  const navigate = useNavigate();
  const { signIn, signUp, user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [submitting, setSubmitting] = useState<"login" | "signup" | null>(null);

  const featurePoints = useMemo(
    () => [
      "دخول سريع وآمن إلى لوحة الحوكمة",
      "تنقل محمي بين جميع الصفحات الداخلية",
      "تجربة عربية RTL واضحة وسلسة",
    ],
    [],
  );

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, navigate, user]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams(value === "signup" ? { tab: "signup" } : {});
  };

  const getArabicAuthMessage = (error: unknown, mode: "login" | "signup") => {
    const message = error instanceof Error ? error.message.toLowerCase() : "";

    if (message.includes("email not confirmed")) {
      return "هذا الحساب يحتاج إلى تفعيل البريد الإلكتروني. إذا أنشأته قبل التحديث فأنشئ حساباً جديداً أو استخدم رابط التفعيل المرسل لك.";
    }

    if (message.includes("invalid login credentials")) {
      return "بيانات الدخول غير صحيحة. تأكد من البريد الإلكتروني وكلمة المرور ثم حاول مرة أخرى.";
    }

    if (message.includes("user already registered")) {
      return mode === "signup"
        ? "هذا البريد مسجل مسبقاً. يمكنك الانتقال إلى تسجيل الدخول مباشرة."
        : "هذا البريد مسجل مسبقاً، حاول تسجيل الدخول بكلمة المرور الصحيحة.";
    }

    if (message.includes("password")) {
      return "كلمة المرور غير صالحة. استخدم كلمة مرور أقوى ثم أعد المحاولة.";
    }

    return mode === "signup" ? "تعذر إنشاء الحساب حالياً. حاول مرة أخرى بعد قليل." : "تعذر تسجيل الدخول حالياً. حاول مرة أخرى بعد قليل.";
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting("login");
    const form = new FormData(e.currentTarget);
    try {
      await signIn(form.get("email") as string, form.get("password") as string);
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(getArabicAuthMessage(err, "login"));
    } finally {
      setSubmitting(null);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting("signup");
    const form = new FormData(e.currentTarget);
    const selectedRole = (form.get("role") as string) || "shareholder";
    try {
      const result = await signUp(
        form.get("email") as string,
        form.get("password") as string,
        form.get("fullName") as string,
        selectedRole as "admin" | "shareholder" | "independent_director",
      );

      if (result.needsEmailConfirmation) {
        toast.success("تم إنشاء الحساب. أرسلنا رسالة تفعيل إلى بريدك الإلكتروني، وبعد التفعيل سيتم تحويلك للدخول.");
        handleTabChange("login");
        return;
      }

      toast.success("تم إنشاء الحساب وتسجيل دخولك بنجاح");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(getArabicAuthMessage(err, "signup"));
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="min-h-screen gradient-hero px-4 py-10">
      <Card className="mx-auto w-full max-w-5xl overflow-hidden border-border/50 bg-card/95 shadow-2xl backdrop-blur">
        <div className="grid min-h-[680px] md:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden md:flex flex-col justify-between bg-primary p-8 text-primary-foreground">
            <div className="space-y-8">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl gradient-gold flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-gold-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">مياثقي</p>
                  <p className="text-sm text-primary-foreground/80">منصة حوكمة مؤسسية عربية جاهزة للعمل</p>
                </div>
              </Link>

              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm">
                  <Sparkles className="h-4 w-4" />
                  تجربة دخول حديثة وسريعة
                </div>
                <h1 className="text-4xl font-bold leading-tight">سجّل الدخول وأدر الحوكمة والتنقل المحمي من مكان واحد.</h1>
                <p className="text-base leading-7 text-primary-foreground/80">
                  تم تحسين الجلسات والاسترجاع التلقائي وإعادة التوجيه حتى ينتقل المستخدم من التسجيل إلى لوحة التحكم بدون تعقيد.
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-3xl bg-primary-foreground/10 p-6">
              {featurePoints.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
            <CardHeader className="px-0 pt-0 text-center md:text-right">
              <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4 md:hidden">
                <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
                  <Shield className="w-5 h-5 text-gold-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">مياثقي</span>
              </Link>
              <CardTitle className="text-3xl">مرحباً بك</CardTitle>
              <CardDescription className="text-base">
                أنشئ حسابك أو سجّل دخولك للوصول مباشرة إلى لوحة التحكم والصفحات المحمية.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0 pb-0">
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup">حساب جديد</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">البريد الإلكتروني</Label>
                  <Input id="login-email" name="email" type="email" required placeholder="example@email.com" dir="ltr" autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">كلمة المرور</Label>
                  <Input id="login-password" name="password" type="password" required placeholder="••••••••" dir="ltr" autoComplete="current-password" />
                </div>
                <Button type="submit" className="w-full btn-transition" disabled={submitting !== null || loading}>
                  {submitting === "login" ? "جاري الدخول..." : "تسجيل الدخول"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">الاسم الكامل</Label>
                  <Input id="fullName" name="fullName" required placeholder="أحمد محمد" autoComplete="name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">البريد الإلكتروني</Label>
                  <Input id="signup-email" name="email" type="email" required placeholder="example@email.com" dir="ltr" autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">كلمة المرور</Label>
                  <Input id="signup-password" name="password" type="password" required minLength={8} placeholder="••••••••" dir="ltr" autoComplete="new-password" />
                </div>
                <div className="space-y-2">
                  <Label>الدور</Label>
                  <Select name="role" defaultValue="shareholder">
                    <SelectTrigger>
                      <SelectValue placeholder="اختر دورك" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shareholder">مساهم</SelectItem>
                      <SelectItem value="independent_director">عضو مستقل</SelectItem>
                      <SelectItem value="admin">مدير</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full btn-transition" disabled={submitting !== null || loading}>
                  {submitting === "signup" ? "جاري الإنشاء..." : "إنشاء حساب"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  بعد التسجيل سيتم إدخالك مباشرة، وإذا كان التفعيل مطلوباً سنرشدك برسالة واضحة بالعربية.
                </p>
              </form>
            </TabsContent>
          </Tabs>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
