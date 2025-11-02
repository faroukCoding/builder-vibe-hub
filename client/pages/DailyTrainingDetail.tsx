import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DailyTrainingDetailResponse,
  UpdateDailyTrainingProgressRequest,
} from "@shared/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowRight,
  ArrowLeft,
  Share2,
  Upload,
  Loader2,
  Sparkles,
  Mic,
  Video,
  Users,
} from "lucide-react";

const fetchExercise = async (exerciseId: string): Promise<DailyTrainingDetailResponse> => {
  const response = await fetch(`/api/daily-training/${exerciseId}`);
  if (!response.ok) {
    throw new Error("تعذر تحميل تفاصيل التمرين المطلوب");
  }
  return response.json();
};

export default function DailyTrainingDetail() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [progressDelta, setProgressDelta] = useState<number>(5);
  const [notes, setNotes] = useState<string>("");
  const [sharingTargets, setSharingTargets] = useState<string[]>([]);
  const [metrics, setMetrics] = useState({ accuracy: 0, clarity: 0, fluency: 0, comprehension: 0 });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<"audio" | "video">("audio");

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    enabled: Boolean(exerciseId),
    queryKey: ["daily-training", exerciseId],
    queryFn: () => fetchExercise(exerciseId!),
  });

  useEffect(() => {
    if (data?.exercise) {
      setMetrics(data.exercise.metrics);
    }
  }, [data?.exercise]);

  const updateProgress = useMutation({
    mutationFn: async (payload: UpdateDailyTrainingProgressRequest) => {
      const response = await fetch(`/api/daily-training/${exerciseId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("تعذر تحديث التقدم");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({ title: "تم حفظ التقدم", description: "تم تحديث بيانات التمرين بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["daily-training"] });
      queryClient.invalidateQueries({ queryKey: ["daily-training", exerciseId] });
    },
    onError: (mutationError) => {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: (mutationError as Error).message,
      });
    },
  });

  const uploadRecording = useMutation({
    mutationFn: async () => {
      if (!uploadFile) throw new Error("يجب اختيار ملف صوتي أو فيديو أولاً");
      const formData = new FormData();
      formData.append("media", uploadFile);
      formData.append("type", mediaType);
      if (notes) {
        formData.append("notes", notes);
      }

      const response = await fetch(`/api/daily-training/${exerciseId}/media`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("تعذر رفع التسجيل");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({ title: "تم رفع التسجيل", description: "سيتم تحليل التسجيل في الجلسة القادمة" });
      queryClient.invalidateQueries({ queryKey: ["daily-training", exerciseId] });
      setUploadFile(null);
    },
    onError: (mutationError) => {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: (mutationError as Error).message,
      });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProgress.mutate({
      progressDelta,
      accuracy: metrics.accuracy,
      clarity: metrics.clarity,
      fluency: metrics.fluency,
      comprehension: metrics.comprehension,
      notes: notes || undefined,
      sharingTargets: sharingTargets.length ? sharingTargets : undefined,
    });
  };

  const handleShare = async () => {
    if (!data?.exercise) return;

    const summary = `تمرين: ${data.exercise.title}\nالمرحلة: ${data.exercise.stage}\nالتقدم الحالي: ${data.exercise.progress}%\nالملاحظات: ${notes || "لا توجد"}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: data.exercise.title, text: summary });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(summary);
        toast({ title: "تم النسخ", description: "تم نسخ تفاصيل التمرين إلى الحافظة" });
      } else {
        throw new Error();
      }
    } catch {
      toast({
        variant: "destructive",
        title: "تعذر المشاركة",
        description: "يرجى نسخ التفاصيل يدويًا أو استخدام متصفح يدعم المشاركة",
      });
    }
  };

  const recommendedShareTargets = useMemo(() => {
    return ["أ. سارة الأخصائية", "المدرسة", "مستشار النطق"];
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50" dir="rtl">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4" dir="rtl">
        <Alert className="max-w-lg">
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>
            {(error as Error)?.message ?? "لم يتم العثور على التمرين المطلوب"}
            <div className="mt-4">
              <Button onClick={() => navigate(-1)}>العودة للخلف</Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { exercise, relatedExercises } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <Button variant="ghost" className="flex items-center gap-2 text-slate-600" onClick={() => navigate(-1)}>
              <ArrowRight className="w-4 h-4" /> العودة للقائمة
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{exercise.title}</h1>
              <p className="text-slate-600">{exercise.focusArea}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{exercise.stage}</Badge>
              <Badge variant="outline">الهدف: {exercise.goal}</Badge>
            </div>
          </div>
          <Button className="flex items-center gap-2" onClick={handleShare}>
            <Share2 className="w-4 h-4" /> مشاركة النتيجة
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle>تحليل الذكاء الاصطناعي</CardTitle>
              <CardDescription>{exercise.aiSummary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-dashed border-emerald-100 bg-emerald-50 p-4">
                  <p className="font-medium text-emerald-700 mb-2">نقاط القوة</p>
                  <ul className="list-disc list-inside text-sm text-emerald-800 space-y-1">
                    {exercise.aiHighlights.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-dashed border-sky-100 bg-sky-50 p-4">
                  <p className="font-medium text-sky-700 mb-2">الخطوات القادمة</p>
                  <ul className="list-disc list-inside text-sm text-sky-800 space-y-1">
                    {exercise.aiNextSteps.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-3 text-center">
                {Object.entries(exercise.metrics).map(([key, value]) => (
                  <div key={key} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-500">{metricLabels[key as keyof typeof exercise.metrics]}</p>
                    <p className="text-xl font-semibold text-slate-900">{value}%</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">موارد الدعم</p>
                <div className="flex flex-wrap gap-2">
                  {exercise.resources.map((resource) => (
                    <Button
                      key={resource.id}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => window.open(resource.url, "_blank")}
                    >
                      <Sparkles className="w-4 h-4" />
                      {resource.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-slate-700 mb-3">تاريخ التقييمات</p>
                <ScrollArea className="h-56">
                  <div className="space-y-3 pr-2">
                    {exercise.evaluationHistory.map((evaluation) => (
                      <Card key={evaluation.id} className="border-slate-200">
                        <CardContent className="p-4 space-y-2">
                          <div className="flex flex-wrap justify-between gap-2 text-sm text-slate-500">
                            <span>{new Date(evaluation.date).toLocaleString("ar-DZ")}</span>
                            <Badge variant="secondary" className="text-slate-700">
                              التقييم: {evaluation.rating}/5
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-700">{evaluation.notes}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-500">
                            <span>الدقة: {evaluation.metrics.accuracy}%</span>
                            <span>الوضوح: {evaluation.metrics.clarity}%</span>
                            <span>الطلاقة: {evaluation.metrics.fluency}%</span>
                            <span>الفهم: {evaluation.metrics.comprehension}%</span>
                          </div>
                          <p className="text-xs text-slate-500">توصية AI: {evaluation.aiFeedback}</p>
                          {evaluation.media && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                              onClick={() => window.open(evaluation.media?.url, "_blank")}
                            >
                              <DownloadIcon type={evaluation.media.type} />
                              تحميل التسجيل ({evaluation.media.originalName})
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-emerald-100 shadow-sm">
              <CardHeader>
                <CardTitle>تحديث التقدم</CardTitle>
                <CardDescription>سجل نتائج الجلسة الحالية لتحديث لوحة المتابعة</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label className="text-sm font-medium text-slate-700">التغير في التقدم (%)</label>
                    <div className="flex items-center gap-3 mt-2">
                      <Slider
                        value={[progressDelta]}
                        min={-15}
                        max={20}
                        step={1}
                        onValueChange={([value]) => setProgressDelta(value)}
                      />
                      <Badge variant="secondary" className="w-12 justify-center">
                        {progressDelta >= 0 ? `+${progressDelta}` : progressDelta}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">استخدم القيمة السالبة للتراجع أو الموجبة للتحسن</p>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(metrics).map(([key, value]) => (
                      <MetricSlider
                        key={key}
                        label={metricLabels[key as keyof typeof metrics]}
                        value={value}
                        onChange={(newValue) =>
                          setMetrics((prev) => ({ ...prev, [key]: newValue }))
                        }
                      />
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">ملاحظات الجلسة</label>
                    <Textarea
                      placeholder="اكتب ملاحظاتك حول أداء الطفل أو النقاط المهمة"
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">مشاركة مع</label>
                    <div className="flex flex-wrap gap-2">
                      {recommendedShareTargets.map((target) => {
                        const isActive = sharingTargets.includes(target);
                        return (
                          <Badge
                            key={target}
                            variant={isActive ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() =>
                              setSharingTargets((prev) =>
                                prev.includes(target)
                                  ? prev.filter((item) => item !== target)
                                  : [...prev, target],
                              )
                            }
                          >
                            <Users className="w-3 h-3 ml-1" />
                            {target}
                          </Badge>
                        );
                      })}
                    </div>
                    <Input
                      placeholder="أدخل جهة أخرى و اضغط إنتر"
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          const value = (event.target as HTMLInputElement).value.trim();
                          if (value && !sharingTargets.includes(value)) {
                            setSharingTargets((prev) => [...prev, value]);
                            (event.target as HTMLInputElement).value = "";
                          }
                        }
                      }}
                    />
                    {sharingTargets.length > 0 && (
                      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                        {sharingTargets.map((target) => (
                          <Badge key={target} variant="secondary">
                            {target}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={updateProgress.isLoading}>
                    {updateProgress.isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>حفظ التحديث</span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-sky-100 shadow-sm">
              <CardHeader>
                <CardTitle>رفع تسجيل صوتي أو فيديو</CardTitle>
                <CardDescription>
                  يساعد تحليل التسجيلات في تحسين توصيات الذكاء الاصطناعي وتمكين التقييم السمعي والبصري
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={mediaType} onValueChange={(value) => setMediaType(value as "audio" | "video")}> 
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="audio" className="flex items-center gap-2">
                      <Mic className="w-4 h-4" /> تسجيل صوتي
                    </TabsTrigger>
                    <TabsTrigger value="video" className="flex items-center gap-2">
                      <Video className="w-4 h-4" /> فيديو قصير
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="audio" className="text-xs text-slate-500 mt-3">
                    اختر مقطعًا قصيرًا (حتى دقيقتين) بصيغة MP3 أو WAV، ويفضل التسجيل في مكان هادئ.
                  </TabsContent>
                  <TabsContent value="video" className="text-xs text-slate-500 mt-3">
                    تأكد من أن إضاءة المكان جيدة وأن وجه الطفل واضح أثناء النطق (MP4 أو MOV).
                  </TabsContent>
                </Tabs>

                <Input
                  type="file"
                  accept={mediaType === "audio" ? "audio/*" : "video/*"}
                  onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
                />
                {uploadFile && (
                  <p className="text-xs text-slate-500">
                    الملف المحدد: {uploadFile.name} ({Math.round(uploadFile.size / 1024)} كيلوبايت)
                  </p>
                )}
                <Button
                  className="w-full"
                  disabled={!uploadFile || uploadRecording.isLoading}
                  onClick={() => uploadRecording.mutate()}
                >
                  {uploadRecording.isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      <Upload className="w-4 h-4" /> رفع التسجيل
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle>تمارين مقترحة تالية</CardTitle>
                <CardDescription>انتقلوا بطفلكم إلى مرحلة أعلى مع التمارين التالية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {relatedExercises.length === 0 && <p className="text-sm text-slate-500">لا توجد اقتراحات إضافية حاليًا.</p>}
                {relatedExercises.map((related) => (
                  <Button
                    key={related}
                    variant="outline"
                    className="w-full flex items-center justify-between"
                    onClick={() => navigate(`/daily-training/${related}`)}
                  >
                    <span>{related}</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          <span>آخر تحديث: {new Date(exercise.lastUpdated).toLocaleString("ar-DZ")}</span>
          <span>المحاولات الإجمالية: {exercise.attempts}</span>
          <span>سلسلة التقدم: {exercise.streak} أيام</span>
        </div>
      </div>
    </div>
  );
}

const metricLabels: Record<"accuracy" | "clarity" | "fluency" | "comprehension", string> = {
  accuracy: "الدقة",
  clarity: "الوضوح",
  fluency: "الطلاقة",
  comprehension: "الفهم",
};

function MetricSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>{label}</span>
        <Badge variant="outline" className="text-slate-700">
          {value}%
        </Badge>
      </div>
      <Slider value={[value]} min={0} max={100} step={1} onValueChange={([newValue]) => onChange(newValue)} />
    </div>
  );
}

function DownloadIcon({ type }: { type: "audio" | "video" }) {
  if (type === "video") {
    return <Video className="w-4 h-4" />;
  }
  return <Mic className="w-4 h-4" />;
}

