import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar } from "lucide-react";

const regulations = [
  { id: 1, title: "لائحة الحوكمة الداخلية", status: "نافذة", date: "2024-01-15" },
  { id: 2, title: "لائحة الإفصاح والشفافية", status: "نافذة", date: "2024-02-20" },
  { id: 3, title: "لائحة تعارض المصالح", status: "قيد المراجعة", date: "2024-03-10" },
  { id: 4, title: "لائحة المكافآت والتعويضات", status: "مسودة", date: "2024-04-01" },
  { id: 5, title: "لائحة إدارة المخاطر", status: "نافذة", date: "2023-11-05" },
];

const statusColors: Record<string, string> = {
  "نافذة": "bg-primary/10 text-primary border-primary/20",
  "قيد المراجعة": "bg-accent/10 text-accent-foreground border-accent/20",
  "مسودة": "bg-muted text-muted-foreground border-border",
};

export default function Regulations() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">اللوائح والأنظمة</h1>
          <p className="text-muted-foreground">إدارة ومراجعة جميع اللوائح الداخلية للشركة</p>
        </div>

        <div className="space-y-3">
          {regulations.map((reg) => (
            <Card key={reg.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 py-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{reg.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{reg.date}</span>
                  </div>
                </div>
                <Badge variant="outline" className={statusColors[reg.status]}>
                  {reg.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
