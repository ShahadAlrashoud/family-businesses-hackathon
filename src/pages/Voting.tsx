import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Vote, Clock } from "lucide-react";

const votes = [
  {
    id: 1,
    title: "الموافقة على الميزانية السنوية 2024",
    status: "مفتوح",
    deadline: "2024-05-01",
    yes: 32,
    no: 8,
    total: 48,
  },
  {
    id: 2,
    title: "تعيين مراجع حسابات خارجي",
    status: "مفتوح",
    deadline: "2024-04-25",
    yes: 28,
    no: 5,
    total: 48,
  },
  {
    id: 3,
    title: "تعديل لائحة المكافآت",
    status: "منتهي",
    deadline: "2024-03-15",
    yes: 40,
    no: 6,
    total: 48,
  },
];

export default function Voting() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">التصويت</h1>
          <p className="text-muted-foreground">المشاركة في التصويتات واستعراض النتائج</p>
        </div>

        <div className="space-y-4">
          {votes.map((vote) => {
            const pct = Math.round((vote.yes / vote.total) * 100);
            return (
              <Card key={vote.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Vote className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{vote.title}</CardTitle>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Clock className="w-3 h-3" />
                          <span>ينتهي: {vote.deadline}</span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        vote.status === "مفتوح"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {vote.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">موافق: {vote.yes}</span>
                      <span className="text-muted-foreground">رافض: {vote.no}</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {vote.yes + vote.no} من {vote.total} صوتوا
                      </span>
                      {vote.status === "مفتوح" && (
                        <Button size="sm">صوّت الآن</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
