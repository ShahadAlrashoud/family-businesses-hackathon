import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Vote, Clock, CheckCircle2, XCircle, MinusCircle, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type VoteChoice = "approve" | "reject" | "abstain";

const choiceLabels: Record<VoteChoice, { label: string; icon: typeof CheckCircle2; className: string }> = {
  approve: { label: "موافق", icon: CheckCircle2, className: "text-emerald-600" },
  reject: { label: "رافض", icon: XCircle, className: "text-red-500" },
  abstain: { label: "ممتنع", icon: MinusCircle, className: "text-muted-foreground" },
};

export default function Voting() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [votingFor, setVotingFor] = useState<string | null>(null);

  // Fetch active regulations to vote on
  const { data: regulations, isLoading: loadingRegs } = useQuery({
    queryKey: ["regulations", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("regulations")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch all votes
  const { data: votes } = useQuery({
    queryKey: ["votes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("votes").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Fetch user profiles count for total voters
  const { data: profilesCount } = useQuery({
    queryKey: ["profiles-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  const castVote = useMutation({
    mutationFn: async ({ regulationId, vote }: { regulationId: string; vote: VoteChoice }) => {
      const { error } = await supabase.from("votes").upsert(
        { user_id: user!.id, regulation_id: regulationId, vote },
        { onConflict: "user_id,regulation_id" }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes"] });
      toast.success("تم تسجيل تصويتك بنجاح");
      setVotingFor(null);
    },
    onError: () => toast.error("تعذر تسجيل التصويت"),
  });

  const getVotesForRegulation = (regId: string) => {
    const regVotes = votes?.filter((v) => v.regulation_id === regId) ?? [];
    return {
      approve: regVotes.filter((v) => v.vote === "approve").length,
      reject: regVotes.filter((v) => v.vote === "reject").length,
      abstain: regVotes.filter((v) => v.vote === "abstain").length,
      total: regVotes.length,
      myVote: regVotes.find((v) => v.user_id === user?.id)?.vote as VoteChoice | undefined,
    };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">التصويت</h1>
          <p className="text-muted-foreground">صوّت على اللوائح النشطة واستعرض النتائج</p>
        </div>

        {loadingRegs ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        ) : !regulations?.length ? (
          <Card className="card-hover border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">لا توجد لوائح نشطة للتصويت</h3>
              <p className="text-muted-foreground text-sm">عند تفعيل لائحة من صفحة اللوائح ستظهر هنا للتصويت عليها.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {regulations.map((reg) => {
              const stats = getVotesForRegulation(reg.id);
              const approvePercent = stats.total > 0 ? Math.round((stats.approve / stats.total) * 100) : 0;
              const isVoting = votingFor === reg.id;

              return (
                <Card key={reg.id} className="card-hover">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Vote className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{reg.title}</CardTitle>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(reg.created_at).toLocaleDateString("ar-SA")}</span>
                          </div>
                        </div>
                      </div>
                      {stats.myVote && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          صوّتت: {choiceLabels[stats.myVote].label}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Results bar */}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">موافق: {stats.approve}</span>
                        <span className="text-muted-foreground">رافض: {stats.reject}</span>
                        <span className="text-muted-foreground">ممتنع: {stats.abstain}</span>
                      </div>
                      <Progress value={approvePercent} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {stats.total} من {profilesCount ?? "..."} صوتوا
                        </span>
                      </div>

                      {/* Vote buttons */}
                      {isVoting ? (
                        <div className="flex gap-2 pt-2">
                          {(["approve", "reject", "abstain"] as VoteChoice[]).map((choice) => {
                            const Icon = choiceLabels[choice].icon;
                            return (
                              <Button
                                key={choice}
                                variant={stats.myVote === choice ? "default" : "outline"}
                                size="sm"
                                className="flex-1 btn-transition"
                                disabled={castVote.isPending}
                                onClick={() => castVote.mutate({ regulationId: reg.id, vote: choice })}
                              >
                                <Icon className="w-4 h-4 ml-1" />
                                {choiceLabels[choice].label}
                              </Button>
                            );
                          })}
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className="btn-transition"
                          onClick={() => setVotingFor(reg.id)}
                        >
                          {stats.myVote ? "تغيير التصويت" : "صوّت الآن"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
