import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DailyTrainingSummaryResponse,
  DailyTrainingExerciseSummary,
} from "@shared/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Target, Clock, Gauge, Download } from "lucide-react";

const fetchDailyTraining = async (): Promise<DailyTrainingSummaryResponse> => {
  const response = await fetch("/api/daily-training");
  if (!response.ok) {
    throw new Error("فشل في تحميل بيانات التدريب اليومي");
  }
  return response.json();
};

const difficultyLabels: Record<DailyTrainingExerciseSummary["difficulty"], string> = {
  easy: "سهل",
  medium: "متوسط",
  hard: "صعب",
};

const difficultyColors: Record<DailyTrainingExerciseSummary["difficulty"], string> = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
};

export default function DailyTraining() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useQuery({ queryKey: ["daily-training"], queryFn: fetchDailyTraining, staleTime: 1000 * 60 });

  const stageGroups = useMemo(() => {
    if (!data?.exercises) return [];
    const grouped = new Map<string, DailyTrainingExerciseSummary[]>();
    data.exercises.forEach((exercise) => {
      const stage = exercise.stage;
      if (!grouped.has(stage)) {
        grouped.set(stage, []);
      }
      grouped.get(stage)!.push(exercise);
    });
    return Array.from(grouped.entries());
  }, [data?.exercises]);

  const handleOpenDetails = (exerciseId: string) => {
    navigate(`/daily-training/${exerciseId}`);
  };

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["daily-training"] });
    await refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">التدريب اليومي</h1>
            <p className="text-slate-600 mt-1">تابع تمارين النطق اليومية واحصل على توصيات ذكية من المساعد</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
            <RefreshCw className={cn("w-4 h-4", isRefetching && "animate-spin")} />
            تحديث البيانات
          </Button>
        </div>

        {isLoading && (
          <div className="grid gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>حدث خطأ</AlertTitle>
            <AlertDescription>
              {(error as Error).message}
              <Button variant="link" className="pr-2" onClick={() => refetch()}>
                إعادة المحاولة
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {data && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white border-emerald-100 shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-emerald-500" />
                    <span className="text-sm text-slate-600">معدل إنجاز الهدف اليومي</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Progress value={data.summary.dailyGoalCompletion} className="w-2/3" />
                    <span className="text-2xl font-semibold text-emerald-600">
                      {data.summary.dailyGoalCompletion}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {data.summary.completedExercises} من {data.summary.totalExercises} تمارين مكتملة اليوم
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-sky-100 shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-sky-500" />
                    <span className="text-sm text-slate-600">سلسلة الاستمرارية</span>
                  </div>
                  <div className="text-2xl font-semibold text-sky-600">
                    {data.summary.streakDays} يوم
                  </div>
                  <p className="text-xs text-slate-500">أفضل سلسلة: {data.summary.streakBest} أيام متتالية</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-amber-100 shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <Gauge className="w-6 h-6 text-amber-500" />
                    <span className="text-sm text-slate-600">التقدم الأسبوعي</span>
                  </div>
                  <div className="text-2xl font-semibold text-amber-600">
                    {data.summary.weeklyCompletionRate}%
                  </div>
                  <p className="text-xs text-slate-500">تابعوا الهدف الأسبوعي للحفاظ على المنحنى الإيجابي</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500 to-sky-500 text-white shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <p className="text-sm opacity-80">رسالة تشجيعية من المساعد الذكي</p>
                  <p className="text-sm leading-relaxed">{data.summary.aiMotivation}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>التذكيرات اليومية</span>
                  <Badge variant="outline" className="text-slate-600 border-slate-200">
                    تم آخر تحديث: {new Date(data.retrievedAt).toLocaleTimeString("ar-DZ", { hour: "2-digit", minute: "2-digit" })}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {data.summary.reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="border border-slate-100 rounded-lg p-4 flex items-center justify-between bg-slate-50"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{reminder.message}</p>
                      <p className="text-xs text-slate-500 uppercase">قناة الإشعار: {reminder.channel}</p>
                    </div>
                    <Badge className="bg-white text-slate-700 border-slate-200">{reminder.time}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Tabs defaultValue={stageGroups[0]?.[0] ?? "all"} className="bg-white border border-slate-100 rounded-xl shadow-sm">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-5">
                {stageGroups.map(([stage]) => (
                  <TabsTrigger key={stage} value={stage}>
                    {stage}
                  </TabsTrigger>
                ))}
              </TabsList>

              {stageGroups.map(([stage, exercises]) => (
                <TabsContent key={stage} value={stage} className="p-6">
                  <div className="grid gap-4">
                    {exercises.map((exercise) => (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        onOpenDetails={() => handleOpenDetails(exercise.id)}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

interface ExerciseCardProps {
  exercise: DailyTrainingExerciseSummary;
  onOpenDetails: () => void;
}

function ExerciseCard({ exercise, onOpenDetails }: ExerciseCardProps) {
  return (
    <Card className="border-slate-100 shadow-sm">
      <CardContent className="p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={cn("text-xs", difficultyColors[exercise.difficulty])}>
                {difficultyLabels[exercise.difficulty]}
              </Badge>
              <Badge variant="secondary">{exercise.focusArea}</Badge>
            </div>
            <h3 className="text-xl font-semibold text-slate-900">{exercise.title}</h3>
            <p className="text-sm text-slate-600">هدف التمرين: {exercise.goal}</p>
          </div>
          <div className="text-left space-y-1">
            <p className="text-xs text-slate-500">موعد التذكير</p>
            <p className="font-semibold text-slate-800">
              {new Date(exercise.scheduledAt).toLocaleTimeString("ar-DZ", { hour: "2-digit", minute: "2-digit" })}
            </p>
            <p className="text-xs text-slate-500">المحاولات: {exercise.attempts}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">نسبة التقدم</span>
              <span className="text-sm font-semibold text-emerald-600">{exercise.progress}%</span>
            </div>
            <Progress value={exercise.progress} />
            <div className="grid grid-cols-4 gap-2 text-center text-xs text-slate-500">
              <Metric label="الدقة" value={exercise.metrics.accuracy} />
              <Metric label="الوضوح" value={exercise.metrics.clarity} />
              <Metric label="الطلاقة" value={exercise.metrics.fluency} />
              <Metric label="الفهم" value={exercise.metrics.comprehension} />
            </div>
          </div>
          <div className="rounded-lg border border-dashed border-slate-200 p-4 bg-slate-50">
            <p className="text-sm font-medium text-slate-700">خطة الذكاء الاصطناعي</p>
            <ScrollArea className="h-24 mt-2 pr-2">
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                {exercise.aiNextSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </div>

        <Separator />

        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="flex flex-wrap gap-2">
            {exercise.resources.map((resource) => (
              <Button
                key={resource.id}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => window.open(resource.url, "_blank")}
              >
                <Download className="w-4 h-4" />
                {resource.label}
              </Button>
            ))}
          </div>
          <Button onClick={onOpenDetails}>عرض التفاصيل</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <span className="block text-xs font-medium text-slate-700">{label}</span>
      <span className="block text-sm font-semibold text-slate-800">{value}%</span>
    </div>
  );
}

