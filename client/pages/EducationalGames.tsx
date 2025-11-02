import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  EducationalGamesResponse,
  RecordGameSessionRequest,
} from "@shared/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Gamepad2, Loader2, Medal, Star, Trophy, BarChart3 } from "lucide-react";

const fetchEducationalGames = async (): Promise<EducationalGamesResponse> => {
  const response = await fetch("/api/educational-games");
  if (!response.ok) {
    throw new Error("تعذر تحميل الألعاب التعليمية");
  }
  return response.json();
};

interface SessionForm {
  gameId: string;
  score: number;
  accuracy: number;
  durationMinutes: number;
  notes: string;
}

const emptyForm: SessionForm = {
  gameId: "",
  score: 85,
  accuracy: 80,
  durationMinutes: 8,
  notes: "",
};

export default function EducationalGames() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({ queryKey: ["educational-games"], queryFn: fetchEducationalGames, staleTime: 1000 * 60 });

  const [sessionForm, setSessionForm] = useState<SessionForm>(emptyForm);
  const [dialogOpen, setDialogOpen] = useState(false);

  const recordSession = useMutation({
    mutationFn: async ({ gameId, ...payload }: SessionForm) => {
      const body: RecordGameSessionRequest = {
        score: payload.score,
        accuracy: payload.accuracy,
        durationMinutes: payload.durationMinutes,
        notes: payload.notes || undefined,
      };

      const response = await fetch(`/api/educational-games/${gameId}/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("تعذر تسجيل جلسة اللعبة");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({ title: "تم حفظ الجلسة", description: "تم تحديث التحديات والنقاط" });
      queryClient.invalidateQueries({ queryKey: ["educational-games"] });
      setDialogOpen(false);
      setSessionForm(emptyForm);
    },
    onError: (mutationError) => {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: (mutationError as Error).message,
      });
    },
  });

  const openLogSession = (gameId: string, durationMinutes: number) => {
    setSessionForm({ gameId, score: 85, accuracy: 80, durationMinutes, notes: "" });
    setDialogOpen(true);
  };

  const leaderboard = useMemo(() => {
    if (!data) return [];
    return data.games.map((game) => ({ title: game.title, leaderboard: game.leaderboard }));
  }, [data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">الألعاب التعليمية</h1>
            <p className="text-slate-600 mt-1">حفّز طفلك على التدريب من خلال ألعاب تفاعلية مع نظام نقاط وشارات</p>
          </div>
          <Button variant="outline" onClick={() => refetch()} className="flex items-center gap-2">
            <Loader2 className={isLoading ? "w-4 h-4 animate-spin" : "w-4 h-4"} /> تحديث القائمة
          </Button>
        </div>

        {isLoading && (
          <div className="grid gap-4">
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-36 w-full" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>حدث خطأ</AlertTitle>
            <AlertDescription>{(error as Error).message}</AlertDescription>
          </Alert>
        )}

        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SummaryCard
                title="إجمالي النقاط"
                value={`${data.totalPoints}`}
                description="إجمالي النقاط المكتسبة من الألعاب"
                icon={<Trophy className="w-6 h-6 text-amber-500" />}
              />
              <SummaryCard
                title="الشارات النشطة"
                value={`${data.activeBadges.length}`}
                description={data.activeBadges.join(" • ") || "لا توجد شارات بعد"}
                icon={<Medal className="w-6 h-6 text-emerald-500" />}
              />
              <SummaryCard
                title="سلسلة الأسابيع"
                value={`${data.streakWeeks} أسبوع`
                }
                description="استمرارية اللعب الأسبوعية"
                icon={<Star className="w-6 h-6 text-sky-500" />}
              />
              <Card className="bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-sm">
                <CardContent className="p-5 space-y-2">
                  <p className="text-sm opacity-80">توصية المساعد الذكي</p>
                  <p className="text-sm leading-relaxed">
                    {data.recommendations[0]}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {data.games.map((game) => (
                  <Card key={game.id} className="border-slate-100 shadow-sm">
                    <CardContent className="p-6 space-y-5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                            <span className="text-2xl">{game.icon}</span>
                            <span>{game.title}</span>
                            <Badge variant="outline">{game.ageRange} سنوات</Badge>
                          </div>
                          <p className="text-sm text-slate-600">{game.description}</p>
                          <p className="text-xs text-slate-500">الهدف: {game.objective}</p>
                        </div>
                        <div className="text-left text-sm text-slate-500 space-y-1">
                          <p>أفضل نتيجة: <span className="font-semibold text-slate-900">{game.bestScore}%</span></p>
                          <p>آخر جلسة: {game.lastPlayed ? new Date(game.lastPlayed).toLocaleDateString("ar-DZ") : "لم تلعب بعد"}</p>
                          <p>المدة المقترحة: {game.durationMinutes} دقائق</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-slate-600">
                            <span>تقدم الشارة</span>
                            <span className="font-semibold text-emerald-600">{game.badgeProgress}%</span>
                          </div>
                          <Progress value={game.badgeProgress} />
                          <p className="text-xs text-slate-500">عدد الجلسات: {game.playCount}</p>
                        </div>
                        <div className="rounded-lg border border-dashed border-slate-200 p-4 bg-slate-50">
                          <p className="text-sm font-medium text-slate-700 mb-2">التحدي الأسبوعي</p>
                          <p className="text-xs text-slate-500">{game.weeklyChallenge.goal}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {game.weeklyChallenge.completedSessions}/{game.weeklyChallenge.targetSessions} جلسات • الجائزة: {game.weeklyChallenge.reward}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            ينتهي في {new Date(game.weeklyChallenge.expiresAt).toLocaleDateString("ar-DZ")}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                        {game.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2 justify-between items-center">
                        <Button variant="outline" className="flex items-center gap-2" onClick={() => openLogSession(game.id, game.durationMinutes)}>
                          <Gamepad2 className="w-4 h-4" /> تسجيل جلسة جديدة
                        </Button>
                        <Button
                          variant="link"
                          className="text-slate-500"
                          onClick={() =>
                            toast({
                              title: "قريبًا",
                              description: "ميزة البدء المباشر قيد التطوير وسيتم ربطها بالألعاب التفاعلية في الإصدار القادم.",
                            })
                          }
                        >
                          بدء اللعبة
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-slate-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-slate-500" /> لوحة الشرف السريعة
                  </CardTitle>
                  <CardDescription>تابع أفضل النتائج لألعاب طفلك</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[420px] pr-2">
                    <div className="space-y-4">
                      {leaderboard.map((entry) => (
                        <div key={entry.title} className="border border-slate-100 rounded-lg p-4 bg-slate-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-slate-700">{entry.title}</span>
                            <Badge variant="outline" className="text-xs text-slate-500">أفضل 3 لاعبين</Badge>
                          </div>
                          <div className="space-y-2">
                            {entry.leaderboard.map((player, index) => (
                              <div key={`${entry.title}-${player.childName}`} className="flex items-center justify-between text-xs text-slate-600">
                                <span className="flex items-center gap-2">
                                  <span className="text-slate-400">#{index + 1}</span>
                                  {player.childName}
                                </span>
                                <span className="font-medium text-slate-800">{player.score}</span>
                                <Trend trend={player.trend} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>تسجيل جلسة لعب</DialogTitle>
              <DialogDescription>أدخل نتائج الجلسة لتحديث لوحة المتابعة الذكية</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500">النتيجة (%)</label>
                  <Input
                    type="number"
                    value={sessionForm.score}
                    min={0}
                    max={100}
                    onChange={(event) => setSessionForm((prev) => ({ ...prev, score: Number(event.target.value) }))}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">الدقة (%)</label>
                  <Input
                    type="number"
                    value={sessionForm.accuracy}
                    min={0}
                    max={100}
                    onChange={(event) => setSessionForm((prev) => ({ ...prev, accuracy: Number(event.target.value) }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500">مدة الجلسة (بالدقائق)</label>
                <Input
                  type="number"
                  value={sessionForm.durationMinutes}
                  min={1}
                  max={30}
                  onChange={(event) => setSessionForm((prev) => ({ ...prev, durationMinutes: Number(event.target.value) }))}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">ملاحظات</label>
                <Textarea
                  rows={3}
                  placeholder="أكتب ملاحظات حول أداء الطفل، ما الذي أحبه أو ما يحتاج دعماً إضافياً"
                  value={sessionForm.notes}
                  onChange={(event) => setSessionForm((prev) => ({ ...prev, notes: event.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={() => recordSession.mutate(sessionForm)} disabled={recordSession.isLoading}>
                {recordSession.isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "حفظ الجلسة"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-slate-100 shadow-sm">
      <CardContent className="p-5 space-y-2">
        <div className="flex items-center gap-3 text-slate-500">
          {icon}
          <span className="text-sm">{title}</span>
        </div>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </CardContent>
    </Card>
  );
}

function Trend({ trend }: { trend: "up" | "down" | "steady" }) {
  if (trend === "up") {
    return <Badge className="bg-emerald-100 text-emerald-700">تصاعدي</Badge>;
  }
  if (trend === "down") {
    return <Badge className="bg-rose-100 text-rose-700">تنازلي</Badge>;
  }
  return <Badge className="bg-slate-100 text-slate-600">ثابت</Badge>;
}

