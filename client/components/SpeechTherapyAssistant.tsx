import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, MessageCircle, Repeat, ListChecks } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type { HomeLearningAssistantHistoryMessage, HomeLearningAssistantMessageResponse } from "@shared/api";

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
    createdAt: string;
  };
  error?: string | null;
}

interface SpeechTherapyAssistantProps {
  childName: string;
  trainingProgress: TrainingProgressSnapshot;
  onReplyCountChange?: (count: number) => void;
  onHighlightsChange?: (highlights: string[]) => void;
  onLogInteraction?: (payload: AssistantLogPayload) => void;
}

const QUICK_PROMPTS = [
  "ما التمارين المنزلية المناسبة لتحسين نطق حرف الراء لابني؟",
  "كيف أساعد طفلي على التمييز بين صوتي السين والشين؟",
  "ابني يتلعثم عندما يكون متوتراً، ماذا أفعل في المنزل؟",
];

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

  const answeredTurns = useMemo(() => conversation.filter((turn) => Boolean(turn.answer)), [conversation]);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [conversation, isThinking]);

  useEffect(() => {
    if (onReplyCountChange) {
      onReplyCountChange(answeredTurns.length);
    }
    if (onHighlightsChange) {
      const highlights = new Set<string>();
      answeredTurns.forEach((turn) => {
        turn.answer?.cues.forEach((cue) => cue && highlights.add(cue));
        turn.answer?.nextActions.forEach((action) => action && highlights.add(action));
      });
      onHighlightsChange(Array.from(highlights).slice(0, 6));
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
      const answer = {
        reply: data.reply.trim(),
        simplified: data.simplifiedReply.trim(),
        cues: data.cues ?? [],
        nextActions: data.nextActions ?? [],
        createdAt: data.storedAt ?? new Date().toISOString(),
      };

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
    onReplyCountChange?.(0);
    onHighlightsChange?.([]);
  };

  return (
    <Card className="border-0 shadow-md bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-sky-800">
            <Sparkles className="h-5 w-5" />
            المساعد الذكي لصعوبات النطق
          </CardTitle>
          <CardDescription>
            طرح أسئلتك حول صعوبات النطق لتحصل على خطة منزلية فورية مخصّصة لطفلك.
          </CardDescription>
        </div>
        <Badge className="bg-sky-600 text-white">مدعوم بـ OpenAI</Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-3xl border border-sky-100 bg-white/90 p-4 shadow-inner">
          <div className="mb-4 rounded-2xl bg-sky-100/60 p-4 text-sm text-sky-800">
            <p className="font-medium">👋 أهلاً بك! أنا هنا لأدعمك في متابعة تمارين النطق لطفلك.</p>
            <p className="mt-1 text-sky-700">
              شاركني الصوت أو الموقف الذي يسبّب الصعوبة، وسأقترح خطوات عملية يمكنك تنفيذها في المنزل مع
              {" "}
              <span className="font-semibold">{childName || "طفلك"}</span>.
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
              onClick={() => setInputValue(prompt)}
              className="border-sky-200 bg-white text-sky-700 hover:bg-sky-100"
            >
              {prompt}
            </Button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3" dir="rtl">
          <Textarea
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
