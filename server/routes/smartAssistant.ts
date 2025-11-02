import { RequestHandler } from "express";

// --- Mock Child Data ---
const mockChildData = {
    name: "علي",
    lastSession: "2024-10-28",
    progress: [
        { skill: "نطق حرف الراء", accuracy: 85 },
        { skill: "التمييز بين السين والشين", accuracy: 65 },
        { skill: "قراءة جمل قصيرة", accuracy: 72 },
    ],
    engagement: 0.88 // 88%
};

// --- Intent Recognition ---
interface Intent {
    keywords: string[];
    handler: (message: string) => string;
}

const intents: Intent[] = [
    {
        keywords: ["أداء", "تقدم", "مستوى"],
        handler: () => {
            const progressSummary = mockChildData.progress
                .map(p => `${p.skill} (بنسبة ${p.accuracy}%)`)
                .join("، ");
            return `آخر تقييم لمستوى ${mockChildData.name} يظهر تحسناً ملحوظاً! إليك ملخص الأداء: ${progressSummary}. استمروا في العمل الرائع!`;
        }
    },
    {
        keywords: ["تمرين", "تدريب"],
        handler: (message) => {
            if (message.includes("صعب")) {
                return "لتمرين أكثر تحدياً، أقترح 'تمرين قراءة الجمل الطويلة'. هذا سيساعد على تحسين سلاسة النطق والذاكرة.";
            }
            // Find the skill with the lowest accuracy
            const lowestSkill = mockChildData.progress.reduce((min, p) => p.accuracy < min.accuracy ? p : min);
            return `بالتأكيد! بناءً على أداء ${mockChildData.name}، أنصح بالتركيز على تمرين "${lowestSkill.skill}" حيث أن نسبة الدقة فيه حالياً ${lowestSkill.accuracy}%.`;
        }
    },
    {
        keywords: ["لعبة", "ترفيه"],
        handler: () => "لعبة 'تحدي النطق السريع' طريقة ممتازة لزيادة سرعة الاستجابة ودقة النطق بطريقة ممتعة. تجدونها في قسم الألعاب."
    },
    {
        keywords: ["مرحبا", "أهلا", "السلام عليكم"],
        handler: () => `أهلاً بك! أنا هنا لمساعدتك في متابعة تقدم ${mockChildData.name}. كيف يمكنني مساعدتك اليوم؟`
    }
];

const getSimulatedAiResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    for (const intent of intents) {
        if (intent.keywords.some(keyword => message.includes(keyword))) {
            return intent.handler(message);
        }
    }

    return "لم أفهم طلبك تماماً. هل يمكنك إعادة صياغته؟ يمكنك أن تسألني عن 'أداء الطفل' أو 'اقترح تمريناً'.";
};


export const handleSmartAssistant: RequestHandler = (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "الرسالة مطلوبة." });
  }

  const response = getSimulatedAiResponse(message);

  // Add a small delay to simulate processing
  setTimeout(() => {
    res.status(200).json({ reply: response });
  }, 500);
};
