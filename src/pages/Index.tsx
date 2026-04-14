import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Vote, Users, FileText, ArrowLeft, CheckCircle2, BarChart3, Lock } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "إدارة اللوائح",
    description: "إدارة ومراجعة اللوائح والأنظمة الداخلية للشركة بسهولة وشفافية تامة",
  },
  {
    icon: Vote,
    title: "التصويت الإلكتروني",
    description: "تصويت آمن وشفاف على القرارات المهمة مع تتبع النتائج في الوقت الفعلي",
  },
  {
    icon: Users,
    title: "إدارة المساهمين",
    description: "عرض وإدارة بيانات المساهمين وأعضاء مجلس الإدارة بشكل مركزي وفعّال",
  },
  {
    icon: BarChart3,
    title: "تقارير وتحليلات",
    description: "لوحات بيانية ذكية تعرض مؤشرات الأداء والامتثال والحوكمة بشكل مرئي",
  },
  {
    icon: Lock,
    title: "أمان وخصوصية",
    description: "حماية متقدمة للبيانات مع صلاحيات مخصصة حسب دور كل مستخدم",
  },
  {
    icon: Shield,
    title: "حوكمة متكاملة",
    description: "أدوات حوكمة شاملة تضمن الامتثال والشفافية في جميع العمليات المؤسسية",
  },
];

const stats = [
  { value: "٥٠٠+", label: "مؤسسة تثق بنا" },
  { value: "٩٩.٩٪", label: "وقت تشغيل" },
  { value: "١٠٠٪", label: "أمان البيانات" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl gradient-gold flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-gold-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground tracking-tight">صلة</span>
            <span className="text-[10px] text-muted-foreground -mt-1 hidden sm:block">منصة الحوكمة المؤسسية</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/login">
            <Button variant="ghost" className="btn-transition text-sm">تسجيل الدخول</Button>
          </Link>
          <Link to="/login?tab=signup">
            <Button className="btn-transition text-sm shadow-md">إنشاء حساب</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(43_55%_54%/0.08),transparent_60%)]" />
        <div className="container max-w-5xl mx-auto px-6 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-5 py-2.5 text-sm text-primary-foreground/90 backdrop-blur-sm border border-primary-foreground/10 animate-fade-in">
              <Shield className="w-4 h-4" />
              منصة حوكمة عربية متكاملة
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary-foreground leading-[1.2] animate-fade-in" style={{ animationDelay: "0.1s" }}>
              إدارة حوكمة مؤسستك
              <br />
              <span className="text-accent">بذكاء وشفافية</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-primary-foreground/75 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
              منصة واحدة لإدارة اللوائح، التصويت الإلكتروني، وبيانات المساهمين. صُمّمت بالكامل للمؤسسات العربية بتجربة سلسة وآمنة.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/login?tab=signup">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 btn-transition text-base px-10 shadow-lg shadow-accent/20">
                  ابدأ مجاناً
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="btn-transition text-base px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                  تسجيل الدخول
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-extrabold text-primary-foreground">{s.value}</p>
                <p className="text-sm text-primary-foreground/60 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28 px-6 bg-background">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">كل ما تحتاجه في منصة واحدة</h2>
            <p className="text-muted-foreground text-base md:text-lg">أدوات متكاملة صُمّمت خصيصاً لتلبية احتياجات الحوكمة المؤسسية العربية</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="glass-card card-hover rounded-2xl p-7 group animate-fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container max-w-4xl mx-auto">
          <div className="gradient-hero rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(43_55%_54%/0.12),transparent_50%)]" />
            <div className="relative space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">جاهز لتطوير حوكمة مؤسستك؟</h2>
              <p className="text-primary-foreground/75 text-base md:text-lg max-w-xl mx-auto">
                انضم إلى مئات المؤسسات التي تثق بمنصة صلة لإدارة الحوكمة المؤسسية بكفاءة عالية
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/login?tab=signup">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 btn-transition px-10 shadow-lg shadow-accent/20">
                    أنشئ حسابك الآن
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap justify-center gap-6 pt-4">
                {["بدون بطاقة ائتمان", "إعداد في دقائق", "دعم عربي كامل"].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm text-primary-foreground/70">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="container max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-gold flex items-center justify-center">
              <Shield className="w-4 h-4 text-gold-foreground" />
            </div>
            <span className="font-bold text-foreground">صلة</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} صلة — جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}
