import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DailyTrainingDetailResponse,
  DailyTrainingPracticeItem,
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
  Volume2,
  Square,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

const fetchExercise = async (exerciseId: string): Promise<DailyTrainingDetailResponse> => {
  const response = await fetch(`/api/daily-training/${exerciseId}`);
  if (!response.ok) {
    throw new Error("تعذر تحميل تفاصيل التمرين المطلوب");
  }
  return response.json();
};

interface PracticeEvaluation {
  transcript: string;
  normalizedTranscript: string;
  similarity: number;
  success: boolean;
  timestamp: string;
}

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any | null>(null);
  const [recordingItemId, setRecordingItemId] = useState<string | null>(null);
  const [practiceResults, setPracticeResults] = useState<Record<string, PracticeEvaluation>>({});
  const [speechRecognitionAvailable, setSpeechRecognitionAvailable] = useState<boolean>(false);
  const [speechSynthesisAvailable, setSpeechSynthesisAvailable] = useState<boolean>(false);

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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setSpeechRecognitionAvailable(Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
    setSpeechSynthesisAvailable("speechSynthesis" in window && "SpeechSynthesisUtterance" in window);
  }, []);

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

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      if (typeof window !== "undefined" && (window as any).speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.onresult = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.stop();
        } catch {
          // تجاهل أي أخطاء في التنظيف
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  const handlePlayPracticeItem = useCallback(
    (item: DailyTrainingPracticeItem) => {
      if (typeof window === "undefined") {
        toast({
          variant: "destructive",
          title: "التشغيل الصوتي غير مدعوم",
          description: "يفضل فتح التطبيق من متصفح حديث لتفعيل هذه الخاصية.",
        });
        return;
      }

      try {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }

        if ((window as any).speechSynthesis) {
          (window as any).speechSynthesis.cancel();
        }

        if (item.audioUrl) {
          const audio = new Audio(item.audioUrl);
          audio.volume = 0.9;
          audio.play().catch(() => {
            toast({
              variant: "destructive",
              title: "تعذر تشغيل الصوت",
              description: "تحقق من الاتصال بالإنترنت ثم حاول مرة أخرى.",
            });
          });
          audioRef.current = audio;
          return;
        }

        const canUseSpeech =
          typeof SpeechSynthesisUtterance !== "undefined" && Boolean((window as any).speechSynthesis);

        if (!canUseSpeech) {
          toast({
            variant: "destructive",
            title: "التشغيل الصوتي غير متاح",
            description: "يرجى استخدام متصفح يدعم Web Speech API مثل Chrome أو Edge.",
          });
          return;
        }

        const utterance = new SpeechSynthesisUtterance(item.ttsText ?? item.text);
        utterance.lang = "ar-SA";
        utterance.rate = item.type === "sentence" ? 0.92 : 0.97;
        utterance.pitch = 1;
        utterance.volume = 1;
        (window as any).speechSynthesis.speak(utterance);
      } catch {
        toast({
          variant: "destructive",
          title: "حدث خطأ أثناء التشغيل",
          description: "أعد المحاولة أو استخدم الملف الصوتي المرفق في الموارد.",
        });
      }
    },
    [speechSynthesisAvailable, toast],
  );

  const handleStopPronunciationCheck = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // تجاهل
      }
      recognitionRef.current = null;
    }
    setRecordingItemId(null);
  }, []);

  const evaluatePronunciation = useCallback(
    (item: DailyTrainingPracticeItem, rawTranscript: string, alternatives: string[] = []) => {
      const candidates = [rawTranscript, ...alternatives].filter((entry) => Boolean(entry?.trim()));
      const transcript = candidates[0] ?? "";

      if (!transcript.trim()) {
        toast({
          variant: "destructive",
          title: "لم يتم التقاط الصوت",
          description: "تأكد من التحدث بوضوح وقرب الفم من الميكروفون.",
        });
        return;
      }

      const normalizedTranscript = normalizeArabicText(transcript);
      const expectedRaw = item.expectedResponses?.length ? item.expectedResponses : [item.text];
      const normalizedExpected = expectedRaw.map((value) => normalizeArabicText(value));

      let bestSimilarity = 0;
      normalizedExpected.forEach((expected) => {
        const similarity = computeSimilarity(normalizedTranscript, expected);
        if (similarity > bestSimilarity) {
          bestSimilarity = similarity;
        }
      });

      const threshold = item.type === "sentence" ? 0.75 : item.type === "word" ? 0.8 : 0.85;
      const success = bestSimilarity >= threshold;

      setPracticeResults((prev) => ({
        ...prev,
        [item.id]: {
          transcript,
          normalizedTranscript,
          similarity: Number(bestSimilarity.toFixed(2)),
          success,
          timestamp: new Date().toISOString(),
        },
      }));

      toast({
        variant: success ? "default" : "destructive",
        title: success ? "أحسنت!" : "لنحاول مرة أخرى",
        description: success
          ? "النطق مطابق لما هو متوقع. تابع إلى الكلمة التالية."
          : "ركز على صوت الحرف وحاول مجددًا بعد الاستماع للنموذج.",
      });
    },
    [toast],
  );

  const handleStartPronunciationCheck = useCallback(
    (item: DailyTrainingPracticeItem) => {
      if (typeof window === "undefined") {
        toast({
          variant: "destructive",
          title: "الميكروفون غير متاح",
          description: "يرجى فتح التطبيق من متصفح يدعم الميكروفون.",
        });
        return;
      }

      const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognitionCtor) {
        toast({
          variant: "destructive",
          title: "التعرف على الصوت غير مدعوم",
          description: "استخدم متصفح Chrome أو Edge لتفعيل التقييم الصوتي.",
        });
        return;
      }

      if (recordingItemId) {
        handleStopPronunciationCheck();
      }

      const recognition = new SpeechRecognitionCtor();
      recognition.lang = "ar-SA";
      recognition.interimResults = false;
      recognition.maxAlternatives = 5;

      recognition.onstart = () => {
        setRecordingItemId(item.id);
      };

      recognition.onerror = (event: any) => {
        setRecordingItemId(null);
        recognitionRef.current = null;
        toast({
          variant: "destructive",
          title: "تعذر تحليل الصوت",
          description:
            event?.error === "no-speech"
              ? "لم يتم سماع أي صوت، حاول التحدث بصوت أوضح."
              : "حدث خطأ أثناء الاستماع، يرجى إعادة المحاولة.",
        });
      };

      recognition.onresult = (event: any) => {
        const results: string[] = [];

        if (event?.results) {
          for (let i = 0; i < event.results.length; i += 1) {
            const result = event.results[i];
            if (!result) continue;
            for (let j = 0; j < result.length; j += 1) {
              const alternative = result[j];
              if (alternative?.transcript) {
                results.push(alternative.transcript);
              }
            }
          }
        }

        evaluatePronunciation(item, results[0] ?? "", results.slice(1));

        try {
          recognition.stop();
        } catch {
          // تجاهل
        }
      };

      recognition.onend = () => {
        setRecordingItemId(null);
        recognitionRef.current = null;
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch {
        toast({
          variant: "destructive",
          title: "لم يبدأ التسجيل",
          description: "تأكد من منح المتصفح صلاحية الوصول إلى الميكروفون.",
        });
      }
    },
    [evaluatePronunciation, handleStopPronunciationCheck, recordingItemId, toast],
  );

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
  const practiceSets = exercise.practiceSets ?? [];

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
          <div className="space-y-6 lg:col-span-2">
            {practiceSets.length > 0 && (
              <Card className="border-emerald-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-emerald-500" /> منطقة التدريب الصوتي
                  </CardTitle>
                  <CardDescription>
                    استمع للنموذج ثم سجّل نطق الطفل لتحصل على تقييم فوري.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!speechSynthesisAvailable && (
                    <Alert className="border-amber-100 bg-amber-50 text-amber-800">
                      <AlertCircle className="w-4 h-4" />
                      <AlertTitle>التشغيل الصوتي يحتاج متصفح حديث</AlertTitle>
                      <AlertDescription>
                        استخدم Chrome أو Edge لتفعيل زر "استمع" أو افتح المورد الصوتي من قسم الموارد.
                      </AlertDescription>
                    </Alert>
                  )}
                  {!speechRecognitionAvailable && (
                    <Alert className="border-slate-100 bg-slate-50 text-slate-600">
                      <AlertCircle className="w-4 h-4" />
                      <AlertTitle>التعرف على النطق غير مفعل</AlertTitle>
                      <AlertDescription>
                        بعض المتصفحات على الهواتف لا تدعم التقييم الآلي. يمكنك رفع تسجيل من الأسفل بدلًا من ذلك.
                      </AlertDescription>
                    </Alert>
                  )}
                  {practiceSets.map((set) => (
                    <div key={set.id} className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{set.title}</h3>
                          <p className="text-sm text-slate-600">{set.prompt}</p>
                        </div>
                        <Badge variant="outline" className="text-slate-600">
                          {set.focus}
                        </Badge>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {set.items.map((item) => {
                          const result = practiceResults[item.id];
                          const isRecording = recordingItemId === item.id;
                          const label =
                            item.type === "letter" ? "حرف" : item.type === "word" ? "كلمة" : "جملة";
                          return (
                            <div
                              key={item.id}
                              className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-sm"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <p className="text-lg font-bold text-slate-900">{item.text}</p>
                                  <span className="text-xs text-slate-500">{label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePlayPracticeItem(item)}
                                    disabled={!speechSynthesisAvailable && !item.audioUrl}
                                    title="استمع للنموذج"
                                  >
                                    <Volume2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={isRecording ? "destructive" : "default"}
                                    size="icon"
                                    onClick={() =>
                                      isRecording
                                        ? handleStopPronunciationCheck()
                                        : handleStartPronunciationCheck(item)
                                    }
                                    disabled={!speechRecognitionAvailable}
                                    title="سجّل نطقك"
                                  >
                                    {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                  </Button>
                                </div>
                              </div>
                              {item.hints && item.hints.length > 0 && (
                                <ul className="text-xs text-slate-500 list-disc list-inside space-y-1">
                                  {item.hints.map((hint, index) => (
                                    <li key={index}>{hint}</li>
                                  ))}
                                </ul>
                              )}
                              {result && (
                                <div
                                  className={`rounded-lg border p-3 text-sm ${
                                    result.success
                                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                      : "border-rose-200 bg-rose-50 text-rose-700"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 font-medium">
                                    {result.success ? (
                                      <CheckCircle2 className="w-4 h-4" />
                                    ) : (
                                      <XCircle className="w-4 h-4" />
                                    )}
                                    <span>{result.success ? "نطق صحيح" : "لنحاول مرة أخرى"}</span>
                                  </div>
                                  <p className="mt-1">
                                    تم التعرف على: <span className="font-semibold">{result.transcript}</span>
                                  </p>
                                  <p className="mt-1 text-xs opacity-80">
                                    درجة التطابق: {Math.round(result.similarity * 100)}%
                                  </p>
                                </div>
                              )}
                              {isRecording && (
                                <p className="text-xs text-amber-600 flex items-center gap-2">
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  جاري الاستماع...
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {set.tips && set.tips.length > 0 && (
                        <div className="rounded-lg border border-dashed border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 space-y-1">
                          <p className="font-semibold">نصائح سريعة</p>
                          <ul className="list-disc list-inside space-y-1">
                            {set.tips.map((tip, index) => (
                              <li key={index}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="border-slate-100 shadow-sm">
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
          </div>

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

function normalizeArabicText(value: string): string {
  if (!value) return "";

  return value
    .toLowerCase()
    .replace(/[\u064B-\u065F]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[\s\u061F\u061B\u060C،.?!؟؛،]/g, "")
    .replace(/[^\u0621-\u063A\u0641-\u064A]/g, "");
}

function computeSimilarity(source: string, target: string): number {
  if (!source && !target) return 1;
  if (!source || !target) return 0;
  if (source === target) return 1;

  const m = source.length;
  const n = target.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i += 1) {
    dp[i][0] = i;
  }

  for (let j = 0; j <= n; j += 1) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const cost = source[i - 1] === target[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }

  const distance = dp[m][n];
  return 1 - distance / Math.max(m, n);
}

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

