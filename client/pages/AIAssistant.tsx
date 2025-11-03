import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

type Role = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

const SYSTEM_PROMPT = `أنت مساعد ذكاء اصطناعي متخصص في الأورطوفونية موجه لوليّ أمر الطفل.
وظيفتك هي تقديم نصائح وتمارين تربوية لمتابعة العلاج المنزلي، وتشجيع الأهل على التواصل الإيجابي مع الطفل.
لا تقدم تشخيصًا طبيًا، بل معلومات تربوية تعليمية واضحة.
استخدم لغة مشجعة، مبسطة، ومفهومة.
أجب بنفس لغة السؤال (العربية أو الفرنسية).`;

function detectLanguage(text: string) {
  return /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(text) ? "fr" : "ar";
}

function generateId(prefix: Role) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setErrorMessage("ميزة النطق غير مدعومة في هذا المتصفح.");
      return;
    }

    window.speechSynthesis.cancel();
    const language = detectLanguage(text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "fr" ? "fr-FR" : "ar-SA";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, []);

  const sendMessage = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isThinking) {
      return;
    }

    const userMessage: ChatMessage = {
      id: generateId("user"),
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    const truncatedMessages = updatedMessages.slice(-12);
    setMessages(updatedMessages);
    setInputValue("");
    setIsThinking(true);
    setErrorMessage(null);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("يرجى إعداد VITE_OPENAI_API_KEY في ملف البيئة لتفعيل المساعد.");
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.7,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...truncatedMessages.map((message) => ({
              role: message.role === "assistant" ? "assistant" : "user",
              content: message.content,
            })),
          ],
        }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.error?.message ?? "تعذر الحصول على رد من المساعد.");
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content?.trim();

      if (!reply) {
        throw new Error("لم يصل رد من المساعد، حاول مرة أخرى.");
      }

      const assistantMessage: ChatMessage = {
        id: generateId("assistant"),
        role: "assistant",
        content: reply,
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const message = (error as Error).message || "حدث خطأ غير متوقع";
      setMessages((prev) => [
        ...prev,
        {
          id: generateId("assistant"),
          role: "assistant",
          content: message,
          createdAt: Date.now(),
        },
      ]);
      setErrorMessage(message);
    } finally {
      setIsThinking(false);
    }
  }, [inputValue, isThinking, messages]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50" dir="rtl">
      <div className="max-w-3xl mx-auto flex h-screen flex-col px-4 py-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">🤖 المساعد الذكي للمتابعة المنزلية</h1>
          <p className="text-slate-600 text-sm">
            اسأل عن التمارين المنزلية، الدعم اليومي، وكيفية مواصلة التدريب بعد الجلسات الأورطوفونية.
          </p>
        </header>

        <div className="mt-6 flex-1">
          <div
            ref={scrollRef}
            className="h-full overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-inner space-y-4"
          >
            {messages.length === 0 && (
              <div className="text-center text-sm text-slate-500 space-y-2">
                <p>ابدأ المحادثة بسؤال مثل:</p>
                <p className="font-medium">"ما أفضل تمرين منزلي لتحسين نطق حرف الراء؟"</p>
              </div>
            )}

            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} onSpeak={speak} />
            ))}

            {isThinking && (
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="flex h-4 w-4 items-center justify-center">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
                </span>
                <span>⏳ جاري التفكير...</span>
              </div>
            )}
          </div>
        </div>

        {errorMessage && (
          <p className="mt-4 text-center text-xs text-rose-500">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="flex gap-3">
            <textarea
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="اكتب سؤالك هنا..."
              rows={2}
              className="flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isThinking}
              className="shrink-0 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              إرسال
            </button>
          </div>
          <footer className="text-center text-xs text-slate-500">
            ⚠️ هذا المساعد يقدم توجيهات تربوية فقط ولا يغني عن استشارة الأخصائي.
          </footer>
        </form>
      </div>
    </div>
  );
}

function ChatBubble({
  message,
  onSpeak,
}: {
  message: ChatMessage;
  onSpeak: (text: string) => void;
}) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm transition ${
          isAssistant
            ? "bg-indigo-50 text-slate-800"
            : "bg-indigo-600 text-white"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {isAssistant && (
          <button
            type="button"
            onClick={() => onSpeak(message.content)}
            className="mt-2 flex items-center gap-2 text-xs font-medium text-indigo-600 hover:text-indigo-500"
          >
            <span aria-hidden>🔊</span>
            <span>استمع للإجابة</span>
          </button>
        )}
      </div>
    </div>
  );
}