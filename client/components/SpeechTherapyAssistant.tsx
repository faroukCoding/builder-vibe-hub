import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, MessageCircle, Repeat, ListChecks, Lightbulb, Gamepad2, Clock3, Dumbbell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type {
  HomeLearningAssistantHistoryMessage,
  HomeLearningAssistantMessageResponse,
  HomeLearningAssistantRecommendedGame,
  HomeLearningAssistantRecommendedExercise,
} from "@shared/api";

type TrainingModuleSnapshot = {
  currentIndex: number;
  completed: boolean;
};

export interface TrainingProgressSnapshot {
  letters: TrainingModuleSnapshot;
  words: TrainingModuleSnapshot;
  discrimination: TrainingModuleSnapshot;
}

type AssistantLogPayload = {
  type: "assistant";
  activity: string;
  result: "success" | "retry" | "info";
  notes: string;
  mediaLink?: string | null;
};

interface AssistantTurn {
  id: string;
  question: string;
  askedAt: string;
  answer?: {
    reply: string;
    simplified: string;
    cues: string[];
    nextActions: string[];
    personalizedTips: string[];
    recommendedGames: HomeLearningAssistantRecommendedGame[];
    recommendedExercises: HomeLearningAssistantRecommendedExercise[];
    createdAt: string;
  };
  error?: string | null;
}

const sanitizeStringArray = (value: unknown, limit: number): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter((entry) => entry.length > 0)
    .slice(0, limit);
};

const sanitizeRecommendedGames = (value: unknown): HomeLearningAssistantRecommendedGame[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((raw) => {
      if (!raw || typeof raw !== "object") {
        return null;
      }
      const candidate = raw as Partial<HomeLearningAssistantRecommendedGame>;
      const title = typeof candidate.title === "string" ? candidate.title.trim() : "";
      const objective = typeof candidate.objective === "string" ? candidate.objective.trim() : "";
      const overview = typeof candidate.overview === "string" ? candidate.overview.trim() : "";
      const steps = sanitizeStringArray(candidate.steps, 8);
      const materials = sanitizeStringArray(candidate.materials, 6);
      const durationMinutes =
        typeof candidate.durationMinutes === "number" && Number.isFinite(candidate.durationMinutes) && candidate.durationMinutes > 0
          ? Math.round(candidate.durationMinutes)
          : undefined;

      if (!title && !overview) {
        return null;
      }

      return {
        title: title || (overview.length > 0 ? overview : "نشاط علاجي"),
        objective: objective || "تعزيز النطق في المنزل",
        overview: overview || title,
        steps: steps.length > 0 ? steps : [(overview || title || "غياب الخلاصة").trim()],
        materials: materials.length > 0 ? materials : undefined,
        durationMinutes,
      } satisfies HomeLearningAssistantRecommendedGame;
    })
    .filter((entry): entry is HomeLearningAssistantRecommendedGame => Boolean(entry));
};

const sanitizeRecommendedExercises = (value: unknown): HomeLearningAssistantRecommendedExercise[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((raw) => {
      if (!raw || typeof raw !== "object") {
        return null;
      }
      const candidate = raw as Partial<HomeLearningAssistantRecommendedExercise>;
      const title = typeof candidate.title === "string" ? candidate.title.trim() : "";
      const goal = typeof candidate.goal === "string" ? candidate.goal.trim() : "";
      const instructions = sanitizeStringArray(candidate.instructions, 6);
      const durationMinutes =
        typeof candidate.durationMinutes === "number" && Number.isFinite(candidate.durationMinutes) && candidate.durationMinutes > 0
          ? Math.round(candidate.durationMinutes)
          : undefined;
      const materials = sanitizeStringArray(candidate.materials, 6);
      const difficulty =
        candidate.difficulty === "سهل" || candidate.difficulty === "متوسط" || candidate.difficulty === "متقدم"
          ? candidate.difficulty
          : "متوسط";

      if (!title && !goal && instructions.length === 0) {
        return null;
      }

      return {
        title: title || goal || "تمرين علاجي",
        goal: goal || title || "تعزيز النطق",
        instructions: instructions.length > 0 ? instructions : [(goal || title || "نفّذ الخطوات بثقة").trim()],
        durationMinutes,
        materials: materials.length > 0 ? materials : undefined,
        difficulty,
      } satisfies HomeLearningAssistantRecommendedExercise;
    })
    .filter((entry): entry is HomeLearningAssistantRecommendedExercise => Boolean(entry));
};

interface SpeechTherapyAssistantProps {
  childName: string;
  trainingProgress: TrainingProgressSnapshot;
  onReplyCountChange?: (count: number) => void;
  onHighlightsChange?: (highlights: string[]) => void;
  onLogInteraction?: (payload: AssistantLogPayload) => void;
}

const QUICK_PROMPTS = [
  "كيف أدعم طفلي في نطق حرف الراء مع تمارين واضحة؟",
  "أريد خطة لمساعدة طفلي على التمييز بين س و ش في المنزل.",
  "ما أفضل الأساليب المنزلية لتقليل التلعثم عند شعوره بالتوتر؟",
  "اقترح عليّ تمارين يومية لطفلة تعاني من لدغة حرف السين.",
  "ما الألعاب المناسبة لطفل يتأخر في الكلام بعمر ثلاث سنوات؟",
];

const arraysEqual = (first: string[], second: string[]) => {
  if (first.length !== second.length) {
    return false;
  }
  return first.every((value, index) => value === second[index]);
};

export default function SpeechTherapyAssistant({
  childName,
  trainingProgress,
  onReplyCountChange,
  onHighlightsChange,
  onLogInteraction,
}: SpeechTherapyAssistantProps) {
  const [conversation, setConversation] = useState<AssistantTurn[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const summarySnapshotRef = useRef<{ count: number; highlights: string[] }>({ count: 0, highlights: [] });

  const answeredTurns = useMemo(() => conversation.filter((turn) => Boolean(turn.answer)), [conversation]);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [conversation, isThinking]);

  useEffect(() => {
    const currentCount = answeredTurns.length;
    if (onReplyCountChange && summarySnapshotRef.current.count !== currentCount) {
      summarySnapshotRef.current.count = currentCount;
      onReplyCountChange(currentCount);
    }

    if (onHighlightsChange) {
      const highlightsSet = new Set<string>();
      answeredTurns.forEach((turn) => {
        turn.answer?.cues.forEach((cue) => cue && highlightsSet.add(cue));
        turn.answer?.nextActions.forEach((action) => action && highlightsSet.add(action));
        turn.answer?.personalizedTips.forEach((tip) => tip && highlightsSet.add(tip));
        turn.answer?.recommendedGames.forEach((game) => {
          if (game?.title) {
            highlightsSet.add(game.title);
          }
        });
        turn.answer?.recommendedExercises.forEach((exercise) => {
          if (exercise?.title) {
            highlightsSet.add(exercise.title);
          }
        });
      });
      const nextHighlights = Array.from(highlightsSet).slice(0, 6);
      if (!arraysEqual(summarySnapshotRef.current.highlights, nextHighlights)) {
        summarySnapshotRef.current.highlights = nextHighlights;
        onHighlightsChange(nextHighlights);
      }
    }
  }, [answeredTurns, onReplyCountChange, onHighlightsChange]);

  const buildHistoryPayload = useCallback((): HomeLearningAssistantHistoryMessage[] => {
    const history: HomeLearningAssistantHistoryMessage[] = [];
    conversation.forEach((turn) => {
      if (turn.question.trim()) {
        history.push({
          role: "parent",
          content: turn.question,
          createdAt: turn.askedAt,
        });
      }
      if (turn.answer) {
        history.push({
          role: "assistant",
          content: turn.answer.reply,
          createdAt: turn.answer.createdAt,
        });
      }
    });
    return history.slice(-10);
  }, [conversation]);

  const buildContextTags = useCallback(() => {
    const tags: string[] = [
      `letters_index:${trainingProgress.letters.currentIndex}`,
      `words_index:${trainingProgress.words.currentIndex}`,
      `discrimination_index:${trainingProgress.discrimination.currentIndex}`,
      trainingProgress.letters.completed ? "letters_completed" : "letters_in_progress",
      trainingProgress.words.completed ? "words_completed" : "words_in_progress",
      trainingProgress.discrimination.completed ? "discrimination_completed" : "discrimination_in_progress",
    ];
    return tags;
  }, [trainingProgress]);

  const submitMessage = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isThinking) {
      return;
    }

    const timestamp = new Date().toISOString();
    const pendingTurn: AssistantTurn = {
      id: `turn-${Date.now()}`,
      question: trimmed,
      askedAt: timestamp,
    };

    setConversation((prev) => [...prev, pendingTurn]);
    setInputValue("");
    setIsThinking(true);
    setErrorMessage(null);

    onLogInteraction?.({
      type: "assistant",
      activity: "سؤال وليّ الأمر",
      result: "info",
      notes: trimmed,
    });

    try {
      const response = await fetch("/api/home-learning/assistant/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          childId: childName,
          sender: "parent",
          modality: "text",
          message: trimmed,
          history: buildHistoryPayload(),
          contextTags: buildContextTags(),
        }),
      });

      if (!response.ok) {
        throw new Error(`تعذّر الحصول على استجابة (رمز ${response.status}).`);
      }

      const data = (await response.json()) as HomeLearningAssistantMessageResponse;
      const reply = data.reply.trim();
      const simplifiedReply = data.simplifiedReply.trim();
      const answer = {
        reply,
        simplified: simplifiedReply.length > 0 ? simplifiedReply : reply,
        cues: sanitizeStringArray(data.cues, 6),
        nextActions: sanitizeStringArray(data.nextActions, 6),
        personalizedTips: sanitizeStringArray(data.personalizedTips, 6),
        recommendedGames: sanitizeRecommendedGames(data.recommendedGames),
        recommendedExercises: sanitizeRecommendedExercises(data.recommendedExercises),
        createdAt: data.storedAt ?? new Date().toISOString(),
      } satisfies AssistantTurn["answer"];

      setConversation((prev) =>
        prev.map((turn) => (turn.id === pendingTurn.id ? { ...turn, answer, error: null } : turn)),
      );

      onLogInteraction?.({
        type: "assistant",
        activity: "رد المساعد الذكي",
        result: "success",
        notes: answer.reply,
      });
    } catch (error) {
      const message = (error as Error).message || "حدث خطأ غير متوقع عند التواصل مع المساعد.";
      setConversation((prev) =>
        prev.map((turn) =>
          turn.id === pendingTurn.id
            ? {
                ...turn,
                error: message,
              }
            : turn,
        ),
      );
      setErrorMessage(message);
      onLogInteraction?.({
        type: "assistant",
        activity: "خطأ في استجابة المساعد",
        result: "retry",
        notes: message,
      });
    } finally {
      setIsThinking(false);
    }
  }, [
    inputValue,
    isThinking,
    childName,
    buildContextTags,
    buildHistoryPayload,
    onLogInteraction,
  ]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitMessage();
  };

  const handleClearConversation = () => {
    setConversation([]);
    setErrorMessage(null);
    if (summarySnapshotRef.current.count !== 0) {
      summarySnapshotRef.current.count = 0;
      onReplyCountChange?.(0);
    }
    if (summarySnapshotRef.current.highlights.length > 0) {
      summarySnapshotRef.current.highlights = [];
      onHighlightsChange?.([]);
    }
    textareaRef.current?.focus();
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-sky-100 via-white to-indigo-50">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-sky-900">
            <Sparkles className="h-5 w-5 text-sky-500" />
            أورثو الذكي – مدرّب النطق المنزلي
          </CardTitle>
          <CardDescription className="text-slate-600">
            استعن بمستشارك الذكي للحصول على إجابات دقيقة، تمارين علاجية، وألعاب داعمة مصممة خصيصاً لطفلك.
          </CardDescription>
        </div>
        <Badge className="bg-slate-900 text-white">ذكاء اصطناعي + خبرة علاجية</Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-3xl border border-sky-100 bg-white/90 p-4 shadow-inner">
          <div className="mb-4 rounded-2xl bg-gradient-to-l from-sky-100 via-white to-emerald-50 p-4 text-sm text-sky-900">
            <p className="font-semibold text-sky-800">👋 أهلاً بك مع أورثو الذكي!</p>
            <p className="mt-1 leading-7 text-sky-700">
              أخبرني عن الصوت أو الموقف الذي يشكّل تحدياً لدى {childName || "طفلك"}، وسأصوغ لك خطة شاملة تجمع بين الإرشاد، النصائح الفردية، والألعاب والتمارين العلاجية الجاهزة للتنفيذ فوراً في المنزل.
            </p>
          </div>

          <div ref={scrollRef} className="max-h-[360px] space-y-4 overflow-y-auto pr-1">
            {conversation.length === 0 && !isThinking && (
              <div className="rounded-2xl border border-dashed border-sky-200 bg-sky-50/70 p-5 text-sm text-sky-700">
                <p className="font-semibold">ابدأ بسؤال مثل:</p>
                <ul className="mt-2 list-disc space-y-1 pr-5">
                  <li>"ما الخطوات اليومية لتحسين نطق حرف الراء؟"</li>
                  <li>"كيف أضع خطة علاجية بسيطة لطفل يعاني من التلعثم؟"</li>
                  <li>"ما العلامات التي تشير إلى ضرورة زيارة أخصائي نطق؟"</li>
                </ul>
              </div>
            )}

            {conversation.map((turn) => (
              <div key={turn.id} className="space-y-3">
                <div className="flex justify-end" dir="rtl">
                  <div className="max-w-[85%] rounded-2xl bg-sky-600 px-4 py-3 text-sm text-white shadow-sm">
                    <div className="mb-1 flex items-center justify-between gap-3 text-xs text-sky-100/80">
                      <span>سؤال وليّ الأمر</span>
                      <span>{new Date(turn.askedAt).toLocaleTimeString("ar-DZ", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <p className="whitespace-pre-wrap leading-6">{turn.question}</p>
                  </div>
                </div>

                {turn.answer && (
                  <div className="flex justify-start" dir="rtl">
                    <div className="w-full max-w-[90%] rounded-2xl border border-sky-100 bg-white px-4 py-4 text-sm text-slate-800 shadow">
                      <div className="mb-2 flex items-center justify-between gap-3 text-xs text-sky-600">
                        <span className="flex items-center gap-1 font-semibold">
                          <MessageCircle className="h-4 w-4" />
                          إجابة المساعد
                        </span>
                        <span>{new Date(turn.answer.createdAt).toLocaleTimeString("ar-DZ", { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>

                      <p className="whitespace-pre-wrap leading-7 text-slate-700">{turn.answer.reply}</p>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl bg-sky-50 p-3">
                          <span className="flex items-center gap-2 text-xs font-semibold text-sky-700">
                            <Repeat className="h-4 w-4" />
                            ملخص سريع
                          </span>
                          <p className="mt-2 text-sm text-sky-800 leading-6">{turn.answer.simplified}</p>
                        </div>
                        <div className="rounded-xl bg-emerald-50 p-3">
                          <span className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                            <ListChecks className="h-4 w-4" />
                            خطوات مقترحة
                          </span>
                          <ul className="mt-2 space-y-1 text-sm text-emerald-900 leading-6">
                            {turn.answer.nextActions.length === 0 ? (
                              <li>اتبع الخطة التفصيلية المذكورة أعلاه وراقب تقدّم طفلك يومياً.</li>
                            ) : (
                              turn.answer.nextActions.map((action, index) => (
                                <li key={`${turn.id}-action-${index}`}>• {action}</li>
                              ))
                            )}
                          </ul>
                        </div>
                        {turn.answer.personalizedTips.length > 0 && (
                          <div className="rounded-xl bg-amber-50 p-3 md:col-span-2">
                            <span className="flex items-center gap-2 text-xs font-semibold text-amber-700">
                              <Lightbulb className="h-4 w-4" />
                              نصائح مخصّصة
                            </span>
                            <ul className="mt-2 space-y-1 text-sm text-amber-900 leading-6">
                              {turn.answer.personalizedTips.map((tip, index) => (
                                <li key={`${turn.id}-tip-${index}`}>• {tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {turn.answer.cues.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {turn.answer.cues.map((cue, index) => (
                            <Badge
                              key={`${turn.id}-cue-${index}`}
                              variant="secondary"
                              className="bg-sky-100 text-sky-700"
                            >
                              {cue}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {turn.answer.recommendedGames.length > 0 && (
                        <div className="mt-4 space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-3">
                          <span className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                            <Gamepad2 className="h-4 w-4" />
                            ألعاب علاجية مقترحة
                          </span>
                          <div className="space-y-3">
                            {turn.answer.recommendedGames.map((game, gameIndex) => (
                              <div
                                key={`${turn.id}-game-${gameIndex}`}
                                className="rounded-xl bg-white/70 p-3 shadow-sm shadow-emerald-100"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="text-sm font-semibold text-emerald-800">{game.title}</p>
                                  {typeof game.durationMinutes === "number" && (
                                    <span className="flex items-center gap-1 text-xs text-emerald-600">
                                      <Clock3 className="h-3.5 w-3.5" />
                                      مدة تقريبية: {game.durationMinutes} دقيقة
                                    </span>
                                  )}
                                </div>
                                <p className="mt-2 text-sm leading-6 text-emerald-800">{game.overview}</p>
                                {game.objective && (
                                  <p className="mt-2 text-xs text-emerald-700">الهدف العلاجي: {game.objective}</p>
                                )}
                                {game.steps.length > 0 && (
                                  <ol className="mt-2 space-y-1 text-xs leading-5 text-emerald-800">
                                    {game.steps.map((step, stepIndex) => (
                                      <li key={`${turn.id}-game-${gameIndex}-step-${stepIndex}`}>
                                        {stepIndex + 1}. {step}
                                      </li>
                                    ))}
                                  </ol>
                                )}
                                {Array.isArray(game.materials) && game.materials.length > 0 && (
                                  <p className="mt-2 text-xs text-emerald-700">
                                    الأدوات: {game.materials.join("، ")}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {turn.answer.recommendedExercises.length > 0 && (
                        <div className="mt-4 space-y-3 rounded-2xl border border-sky-200 bg-sky-50/60 p-3">
                          <span className="flex items-center gap-2 text-xs font-semibold text-sky-700">
                            <Dumbbell className="h-4 w-4" />
                            تمارين منزلية جاهزة
                          </span>
                          <div className="space-y-3">
                            {turn.answer.recommendedExercises.map((exercise, exerciseIndex) => (
                              <div
                                key={`${turn.id}-exercise-${exerciseIndex}`}
                                className="rounded-xl border border-sky-100 bg-white/80 p-3 shadow-sm shadow-sky-100"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="text-sm font-semibold text-sky-900">{exercise.title}</p>
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-sky-700">
                                    <span className="rounded-full bg-sky-100 px-2 py-0.5 font-medium">
                                      الصعوبة: {exercise.difficulty}
                                    </span>
                                    {typeof exercise.durationMinutes === "number" && (
                                      <span className="flex items-center gap-1">
                                        <Clock3 className="h-3.5 w-3.5" />
                                        {exercise.durationMinutes} د
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <p className="mt-2 text-sm leading-6 text-sky-800">{exercise.goal}</p>
                                {exercise.instructions.length > 0 && (
                                  <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-700">
                                    {exercise.instructions.map((step, stepIndex) => (
                                      <li key={`${turn.id}-exercise-${exerciseIndex}-step-${stepIndex}`}>
                                        • {step}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                {Array.isArray(exercise.materials) && exercise.materials.length > 0 && (
                                  <p className="mt-2 text-xs text-slate-600">
                                    الأدوات المقترحة: {exercise.materials.join("، ")}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {turn.error && (
                  <div className="flex justify-start" dir="rtl">
                    <div className="max-w-[85%] rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                      {turn.error}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-sm text-sky-600" dir="rtl">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
                <span>جاري إعداد الإرشادات المخصصة...</span>
              </div>
            )}
          </div>
        </div>

        {errorMessage && (
          <p className="text-center text-xs text-rose-500">{errorMessage}</p>
        )}

        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <Button
              key={prompt}
              type="button"
              variant="outline"
              onClick={() => {
                setInputValue(prompt);
                textareaRef.current?.focus();
              }}
              className="border-sky-200 bg-white text-sky-700 hover:bg-sky-100"
            >
              {prompt}
            </Button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3" dir="rtl">
          <Textarea
            ref={textareaRef}
            placeholder="اكتب سؤالك بالتفصيل..."
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submitMessage();
              }
            }}
            className="min-h-[110px] border-sky-200 focus-visible:ring-sky-500"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white" disabled={!inputValue.trim() || isThinking}>
              أرسل السؤال الآن
            </Button>
            <Button type="button" variant="ghost" onClick={handleClearConversation} disabled={conversation.length === 0}>
              إعادة تعيين المحادثة
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
