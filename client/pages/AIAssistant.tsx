import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AssistantChatRequest,
  AssistantChatResponse,
  AssistantHistoryResponse,
  AssistantTipResponse,
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import {
  Bot,
  Send,
  Loader2,
  Lightbulb,
  Target,
  Sparkles,
  Info,
  Zap,
} from "lucide-react";

type TimeFilter = "all" | "today" | "7d";

const fetchAssistantHistory = async (filter: TimeFilter): Promise<AssistantHistoryResponse> => {
  const params = new URLSearchParams();
  params.set("limit", "100");

  if (filter !== "all") {
    const now = new Date();
    if (filter === "today") {
      now.setHours(0, 0, 0, 0);
    } else {
      now.setDate(now.getDate() - 7);
    }
    params.set("from", now.toISOString());
  }

  const response = await fetch(`/api/ai-assistant/history?${params.toString()}`);
  if (!response.ok) {
    throw new Error("تعذر تحميل محادثات المساعد");
  }
  return response.json();
};

const sendAssistantMessage = async (payload: AssistantChatRequest): Promise<AssistantChatResponse> => {
  const response = await fetch("/api/ai-assistant/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("تعذر الحصول على رد من المساعد");
  }

  return response.json();
};

const fetchAssistantTip = async (): Promise<AssistantTipResponse> => {
  const response = await fetch("/api/ai-assistant/tip", { method: "POST" });
  if (!response.ok) {
    throw new Error("تعذر جلب نصيحة اليوم");
  }
  return response.json();
};

type Message = AssistantHistoryResponse["messages"][number];

export default function AIAssistant() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<TimeFilter>("all");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [contextInfo, setContextInfo] = useState<AssistantChatResponse["context"] | null>(null);
  const [latestTip, setLatestTip] = useState<AssistantTipResponse["tip"] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    error,
  } = useQuery({ queryKey: ["assistant-history", filter], queryFn: () => fetchAssistantHistory(filter) });

  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages);
    }
  }, [data?.messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: sendAssistantMessage,
    onSuccess: (response, variables) => {
      const parentMessage: Message = {
        id: `parent-local-${Date.now()}`,
        role: "parent",
        timestamp: new Date().toISOString(),
        content: variables.message,
      };
      const assistantMessage: Message = {
        id: `assistant-local-${Date.now()}`,
        role: "assistant",
        timestamp: new Date().toISOString(),
        content: response.reply,
        suggestedActions: response.suggestedActions,
      };

      setMessages((prev) => [...prev, parentMessage, assistantMessage]);
      setContextInfo(response.context);
      setInputValue("");
      queryClient.invalidateQueries({ queryKey: ["assistant-history"] });
    },
    onError: (mutationError) => {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: (mutationError as Error).message,
      });
    },
  });

  const tipMutation = useMutation({
    mutationFn: fetchAssistantTip,
    onSuccess: (payload) => {
      setLatestTip(payload.tip);
      toast({ title: payload.tip.title, description: payload.tip.content });
      queryClient.invalidateQueries({ queryKey: ["assistant-history"] });
    },
    onError: (mutationError) => {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: (mutationError as Error).message,
      });
    },
  });

  const handleSendMessage = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    sendMessageMutation.mutate({ message: trimmed });
  };

  const savedTips = data?.savedTips ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">المساعد الذكي</h1>
            <p className="text-slate-600 mt-1">
              دردش مع مساعد Gemini للحصول على توصيات مخصصة وتمارين جديدة لطفلك
            </p>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => tipMutation.mutate()}
            disabled={tipMutation.isLoading}
          >
            {tipMutation.isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
            نصيحة اليوم
          </Button>
        </div>

        <Tabs value={filter} onValueChange={(value) => setFilter(value as TimeFilter)}>
          <TabsList className="grid grid-cols-3 w-full md:w-72">
            <TabsTrigger value="all">كافة المحادثات</TabsTrigger>
            <TabsTrigger value="today">اليوم</TabsTrigger>
            <TabsTrigger value="7d">آخر 7 أيام</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading && (
          <div className="grid gap-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>حدث خطأ</AlertTitle>
            <AlertDescription>{(error as Error).message}</AlertDescription>
          </Alert>
        )}

        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-slate-100 shadow-sm flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-indigo-500" /> قناة المحادثة
                </CardTitle>
                <CardDescription>اسأل المساعد عن التمارين، التحليل أو النصائح التربوية</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 space-y-4">
                  {messages.map((message) => (
                    <ChatBubble key={message.id} message={message} />
                  ))}
                </div>

                <div className="space-y-3">
                  {sendMessageMutation.isLoading && (
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> يقوم المساعد بالتحليل...
                    </p>
                  )}
                  <Textarea
                    placeholder="اكتب سؤالك... مثال: اقترح تمرينًا لحرف الصاد أو أعطني خطة أسبوعية"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    rows={3}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || sendMessageMutation.isLoading}
                      className="flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" /> إرسال
                    </Button>
                    {contextInfo && (
                      <Badge variant="secondary" className="text-xs text-slate-600">
                        تم الاعتماد على آخر التحديثات لعدد جلسات: {contextInfo.conversationLength}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {contextInfo && (
                <Card className="border-emerald-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-emerald-500" /> ملخص الذكاء الاصطناعي
                    </CardTitle>
                    <CardDescription>تحديث سريع حول التدريب والألعاب</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-600">
                    <p>{contextInfo.trainingHighlights}</p>
                    <p>{contextInfo.gamesHighlights}</p>
                  </CardContent>
                </Card>
              )}

              {latestTip && (
                <Card className="border-amber-100 shadow-sm bg-amber-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-amber-500" /> {latestTip.title}
                    </CardTitle>
                    <CardDescription>{new Date(latestTip.deliveredAt).toLocaleTimeString("ar-DZ")}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-amber-800 space-y-2">
                    <p>{latestTip.content}</p>
                    <Badge variant="outline" className="text-xs text-amber-700">
                      {latestTip.category}
                    </Badge>
                  </CardContent>
                </Card>
              )}

              <Card className="border-slate-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" /> نصائح محفوظة
                  </CardTitle>
                  <CardDescription>يمكنك الرجوع لهذه النصائح في أي وقت</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {savedTips.map((tip) => (
                    <div key={tip.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50 space-y-1">
                      <p className="text-sm font-medium text-slate-800">{tip.title}</p>
                      <p className="text-xs text-slate-500">{tip.content}</p>
                      <Badge variant="outline" className="text-xs text-slate-500">
                        {tip.category}
                      </Badge>
                    </div>
                  ))}
                  {savedTips.length === 0 && (
                    <p className="text-xs text-slate-500">لا توجد نصائح محفوظة بعد، اطلب من المساعد اقتراحات جديدة.</p>
                  )}
                </CardContent>
              </Card>

              {data.lastTipTimestamp && (
                <Card className="border-slate-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-slate-500" /> آخر تذكير
                    </CardTitle>
                    <CardDescription>
                      {new Date(data.lastTipTimestamp).toLocaleString("ar-DZ")}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: Message }) {
  const isAssistant = message.role === "assistant";
  return (
    <div className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-xl rounded-2xl px-4 py-3 shadow-sm ${
          isAssistant
            ? "bg-white border border-slate-100 text-slate-700"
            : "bg-indigo-500 text-white"
        }`}
      >
        <div className="flex items-center gap-2 mb-2 text-xs opacity-70">
          {isAssistant ? <Bot className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
          <span>{new Date(message.timestamp).toLocaleString("ar-DZ")}</span>
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {message.suggestedActions.map((action) => (
              <Badge key={action} variant={isAssistant ? "secondary" : "outline"} className="text-xs">
                {action}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

