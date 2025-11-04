import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

// ==================== TYPES ====================
type Role = "user" | "assistant";

interface IChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

// ==================== CONSTANTES ====================
const SYSTEM_PROMPT = `أنت مساعد ذكاء اصطناعي متخصص في الأورطوفونية موجه لوليّ أمر الطفل.
وظيفتك هي تقديم نصائح وتمارين تربوية لمتابعة العلاج المنزلي، وتشجيع الأهل على التواصل الإيجابي مع الطفل.
لا تقدم تشخيصًا طبيًا، بل معلومات تربوية تعليمية واضحة.
استخدم لغة مشجعة، مبسطة، ومفهومة.
أجب بنفس لغة السؤال (العربية أو الفرنسية).`;

const STORAGE_KEY = "ai_assistant_chat_history";
const MAX_MESSAGES_IN_CONTEXT = 12;
const API_URL = "https://api.openai.com/v1/chat/completions";

// ==================== UTILITAIRES ====================
function detectLanguage(text: string): string {
  return /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(text) ? "fr" : "ar";
}

function generateId(prefix: Role): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

// LocalStorage avec gestion d'erreurs
const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (error) {
      console.error("Erreur lecture localStorage:", error);
      return fallback;
    }
  },

  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Erreur écriture localStorage:", error);
    }
  },

  clear(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Erreur suppression localStorage:", error);
    }
  },
};

// ==================== COMPOSANT PRINCIPAL ====================
export default function AIAssistant() {
  // États
  const [messages, setMessages] = useState<IChatMessage[]>(() => {
    return storage.get<IChatMessage[]>(STORAGE_KEY, []);
  });
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const isSubmittingRef = useRef(false);

  // Sauvegarder les messages dans localStorage à chaque changement
  useEffect(() => {
    storage.set(STORAGE_KEY, messages);
  }, [messages]);

  // Auto-scroll vers le bas
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // Text-to-Speech
  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setErrorMessage("ميزة النطق غير مدعومة في هذا المتصفح.");
      return;
    }

    window.speechSynthesis.cancel();
    const language = detectLanguage(text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "fr" ? "fr-FR" : "ar-SA";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onerror = (event) => {
      console.error("Erreur TTS:", event);
      setErrorMessage("خطأ في تشغيل الصوت");
    };
    
    window.speechSynthesis.speak(utterance);
  }, []);

  // Envoi du message
  const sendMessage = useCallback(async () => {
    const trimmed = inputValue.trim();
    
    // Validation
    if (!trimmed || isThinking || isSubmittingRef.current) {
      return;
    }

    // Empêcher les doubles soumissions
    isSubmittingRef.current = true;

    const userMessage: IChatMessage = {
      id: generateId("user"),
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    };

    // Mise à jour immédiate de l'UI
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsThinking(true);
    setErrorMessage(null);

    try {
      // Call the server assistant endpoint which handles OpenAI and persistence
      const res = await fetch("/api/ai-assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentId: "parent-1", message: trimmed }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `خطأ HTTP ${res.status}`);
      }

      const data = (await res.json()) as { reply?: string; suggestedActions?: string[] };
      const reply = data?.reply?.trim();

      if (!reply) {
        throw new Error("لم يصل رد من المساعد. حاول مرة أخرى.");
      }

      // Ajouter la réponse (et suggestions si وُجدت)
      const assistantMessage: IChatMessage = {
        id: generateId("assistant"),
        role: "assistant",
        content: reply,
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
    } catch (error) {
      const message = error instanceof Error 
        ? error.message 
        : "حدث خطأ غير متوقع";
      
      console.error("Erreur API:", error);
      
      // Message d'erreur dans le chat
      const errorMsg: IChatMessage = {
        id: generateId("assistant"),
        role: "assistant",
        content: `❌ ${message}`,
        createdAt: Date.now(),
      };
      
      setMessages((prev) => [...prev, errorMsg]);
      setErrorMessage(message);
      
    } finally {
      setIsThinking(false);
      isSubmittingRef.current = false;
    }
  }, [inputValue, isThinking, messages]);

  // Soumettre le formulaire
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage();
  };

  // Effacer l'historique
  const clearHistory = () => {
    if (confirm("هل تريد حذف جميع المحادثات؟")) {
      setMessages([]);
      storage.clear(STORAGE_KEY);
      setErrorMessage(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50" dir="rtl">
      <div className="max-w-3xl mx-auto flex h-screen flex-col px-4 py-8">
        
        {/* En-tête */}
        <header className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">
              🤖 المساعد الذكي للمتابعة المنزلية
            </h1>
            {messages.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-rose-600 hover:text-rose-700 underline"
                type="button"
              >
                مسح الكل
              </button>
            )}
          </div>
          <p className="text-slate-600 text-sm">
            اسأل عن التمارين المنزلية، الدعم اليومي، وكيفية مواصلة التدريب بعد الجلسات الأورطوفونية.
          </p>
        </header>

        {/* Zone de chat */}
        <div className="mt-6 flex-1">
          <div
            ref={scrollRef}
            className="h-full overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-inner space-y-4"
          >
            {messages.length === 0 && (
              <div className="text-center text-sm text-slate-500 space-y-3">
                <p className="text-base font-medium">مرحباً بك! 👋</p>
                <p>ابدأ المحادثة بسؤال مثل:</p>
                <div className="space-y-2">
                  <p className="font-medium text-indigo-600">
                    "ما أفضل تمرين منزلي لتحسين نطق حرف الراء؟"
                  </p>
                  <p className="font-medium text-indigo-600">
                    "كيف أساعد طفلي على التركيز أثناء التمارين؟"
                  </p>
                </div>
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

        {/* Message d'erreur */}
        {errorMessage && (
          <p className="mt-4 text-center text-xs text-rose-500 bg-rose-50 py-2 px-4 rounded-lg">
            {errorMessage}
          </p>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="flex gap-3">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="اكتب سؤالك هنا..."
              rows={2}
              disabled={isThinking}
              className="flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isThinking}
              className="shrink-0 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            >
              {isThinking ? "..." : "إرسال"}
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

// ==================== SOUS-COMPOSANT ====================
function ChatBubble({
  message,
  onSpeak,
}: {
  message: IChatMessage;
  onSpeak: (text: string) => void;
}) {
  const isAssistant = message.role === "assistant";
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    setIsSpeaking(true);
    onSpeak(message.content);
    
    // Reset après 2 secondes
    setTimeout(() => setIsSpeaking(false), 2000);
  };

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
            onClick={handleSpeak}
            disabled={isSpeaking}
            className="mt-2 flex items-center gap-2 text-xs font-medium text-indigo-600 hover:text-indigo-500 disabled:text-indigo-300 disabled:cursor-not-allowed transition"
          >
            <span aria-hidden>{isSpeaking ? "🔊" : "🔉"}</span>
            <span>{isSpeaking ? "جاري التشغيل..." : "استمع للإجابة"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
