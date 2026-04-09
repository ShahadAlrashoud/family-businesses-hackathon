import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Vote, Users, FileText, ArrowLeft } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "إدارة اللوائح",
    description: "إدارة ومراجعة اللوائح والأنظمة الداخلية للشركة بسهولة وشفافية",
  },
  {
    icon: Vote,
    title: "التصويت الإلكتروني",
    description: "تصويت آمن وشفاف على القرارات المهمة مع تتبع النتائج في الوقت الفعلي",
  },
  {
    icon: Users,
    title: "إدارة المساهمين",
    description: "عرض وإدارة بيانات المساهمين وأعضاء مجلس الإدارة بشكل مركزي",
  },
  {
    icon: Shield,
    title: "حوكمة متقدمة",
    description: "أدوات حوكمة متكاملة تضمن الامتثال والشفافية في جميع العمليات",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
            <Shield className="w-5 h-5 text-gold-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">حَوكمة</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost">تسجيل الدخول</Button>
          </Link>
          <Link to="/login?tab=signup">
            <Button>إنشاء حساب</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="gradient-hero py-24 px-6">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6 animate-fade-in">
            منصة الحوكمة المؤسسية المتكاملة
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            إدارة اللوائح، التصويت، والمساهمين في منصة واحدة آمنة وشفافة
          </p>
          <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Link to="/login?tab=signup">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8">
                ابدأ الآن
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">مميزات المنصة</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} حَوكمة — جميع الحقوق محفوظة
      </footer>
    </div>
  );
}
