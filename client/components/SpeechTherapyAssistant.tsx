import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, MessageCircle, Repeat, ListChecks, Lightbulb, Gamepad2, Clock3, Dumbbell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type { HomeLearningAssistantHistoryMessage, HomeLearningAssistantMessageResponse } from "@shared/api";

type AssistantGame = {
  title: string;
  objective: string;
  overview: string;
  steps: string[];
  materials?: string[];
  durationMinutes?: number;
};

type AssistantExercise = {
  title: string;
  goal: string;
  instructions: string[];
  durationMinutes?: number;
  materials?: string[];
  difficulty: "سهل" | "متوسط" | "متقدم";
};

type OrthoKnowledgeEntry = {
  id: string;
  question: string;
  keywords: string[];
  reply: string;
  simplified: string;
  cues: string[];
  nextActions: string[];
  personalizedTips: string[];
  games: AssistantGame[];
  exercises: AssistantExercise[];
};

type AssistantResponsePayload = HomeLearningAssistantMessageResponse & {
  personalizedTips?: string[];
  recommendedGames?: Array<Partial<AssistantGame> | string>;
  recommendedExercises?: Array<Partial<AssistantExercise> | string>;
};

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
    recommendedGames: AssistantGame[];
    recommendedExercises: AssistantExercise[];
    createdAt: string;
  };
  error?: string | null;
}

const stripDiacritics = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u064B-\u0652]/g, "")
    .normalize("NFC");

const normalizeText = (value: string) =>
  stripDiacritics(value)
    .toLowerCase()
    .replace(/["'،؛?.!؟]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (value: string) => {
  if (!value) {
    return [] as string[];
  }
  const normalized = normalizeText(value);
  return normalized.length > 0 ? normalized.split(" ") : [];
};

const DEFAULT_EXERCISES: AssistantExercise[] = [
  {
    title: "تمرين المرآة الواعية",
    goal: "ضبط حركة اللسان والشفاه أثناء نطق الصوت المستهدف",
    instructions: ["راقبوا شكل الفم", "كرروا الصوت ببطء", "زيدوا السرعة تدريجياً"],
    durationMinutes: 5,
    materials: ["مرآة", "بطاقات صوت"],
    difficulty: "سهل",
  },
  {
    title: "رحلة الأصوات في القصص",
    goal: "دمج الصوت في جمل قصيرة",
    instructions: ["اقرأ جملة", "أبرز الكلمة الصعبة", "أعد الجملة بلحن ممتع"],
    durationMinutes: 7,
    materials: ["قصة مصورة"],
    difficulty: "متوسط",
  },
  {
    title: "صيد الأصوات في البيت",
    goal: "زيادة الوعي السمعي",
    instructions: ["ابحث عن ثلاثة أغراض", "سجّل أسماءها", "استخدم كل كلمة في جملة"],
    durationMinutes: 10,
    materials: ["ورقة", "أقلام"],
    difficulty: "متوسط",
  },
  {
    title: "إيقاع التنفس والنطق",
    goal: "ضبط التنفس قبل الكلام",
    instructions: ["شهيق لعدد أربعة", "زفير بطيء", "نطق الصوت بعد كل زفير"],
    durationMinutes: 6,
    difficulty: "سهل",
  },
  {
    title: "سلم الكلمات المتدرّج",
    goal: "الانتقال من الصوت المفرد إلى الجملة",
    instructions: ["ابدأ بالصوت", "انتقل إلى مقطع", "اختم بجملة قصيرة"],
    durationMinutes: 8,
    materials: ["بطاقات مقاطع"],
    difficulty: "متوسط",
  },
  {
    title: "تمرين التمييز السمعي",
    goal: "التمييز بين صوتين متقاربين",
    instructions: ["استمع لصوتين", "ارفع اللون الصحيح", "طبق على كلمات قصيرة"],
    durationMinutes: 7,
    materials: ["بطاقات ألوان"],
    difficulty: "متقدم",
  },
  {
    title: "مسرح الظل",
    goal: "دمج الحركة مع النطق",
    instructions: ["شكّل ظل الكلمة", "قلد الحركة", "اخترعوا قصة قصيرة"],
    durationMinutes: 9,
    materials: ["مصباح", "ورق"],
    difficulty: "متوسط",
  },
];

const DEFAULT_GAME: AssistantGame = {
  title: "لعبة صائد الأصوات",
  objective: "ترسيخ الصوت داخل كلمات مألوفة",
  overview: "التقط البطاقة بعد نطق الكلمة بنجاح مرتين متتاليتين.",
  steps: ["حضّر ست بطاقات", "قدّم نموذجاً", "اسمح بالاحتفاظ بالبطاقة عند النجاح"],
  materials: ["بطاقات كلمات", "وعاء صغير"],
  durationMinutes: 8,
};

const DEFAULT_GAME_LIST: AssistantGame[] = [DEFAULT_GAME];

const buildEntry = (config: {
  id: string;
  question: string;
  keywords: string[];
  reply: string;
  simplified: string;
  cues: string[];
  nextActions: string[];
  personalizedTips?: string[];
  games?: AssistantGame[];
  exercises?: AssistantExercise[];
}): OrthoKnowledgeEntry => ({
  id: config.id,
  question: config.question,
  keywords: config.keywords,
  reply: config.reply,
  simplified: config.simplified,
  cues: config.cues,
  nextActions: config.nextActions,
  personalizedTips: config.personalizedTips ?? [],
  games: config.games ?? DEFAULT_GAME_LIST,
  exercises: config.exercises ?? DEFAULT_EXERCISES,
});

const ORTHO_KNOWLEDGE_BASE: OrthoKnowledgeEntry[] = [
  buildEntry({
    id: "q01",
    question: "كيف أدعم طفلي في نطق حرف الراء؟",
    keywords: ["راء", "اهتزاز", "لسان"],
    reply:
      "نشّط طرف اللسان بضغط لطيف، ثم انتقل إلى صوت \"دد\" السريع حتى يتحول إلى اهتزاز \"ر\". أختم بكلمات قصيرة داخل مرآة مع تعزيز فوري.",
    simplified: "ضغط خفيف لطرف اللسان + صوت \"دد\" + كلمات قصيرة أمام المرآة.",
    cues: ["نشّط طرف اللسان", "استخدم صوت \"دد\"", "راقب النطق في المرآة"],
    nextActions: ["جولة مرآة ثلاث مرات", "تسجيل صوتي للمقارنة", "لائحة كلمات تبدأ بالراء"],
    personalizedTips: ["اجعل الجلسة قصيرة ومشجعة."],
  }),
  buildEntry({
    id: "q02",
    question: "طفلي يخلط بين س وش، ماذا أفعل؟",
    keywords: ["سين", "شين", "تمييز"],
    reply:
      "ابدأ ببطاقات لونين لسماع الفرق، ثم وضّح وضع اللسان لكل صوت باستخدام مرآة، وأدرج الكلمات في لعبة تصنيف سريعة.",
    simplified: "تمييز بصري ثم تدريب أمام المرآة على وضع اللسان.",
    cues: ["بطاقات لونين", "لسان خلف الأسنان للسين", "تدوير الشفتين للشين"],
    nextActions: ["جلسة تمييز صوتي", "قراءة كلمات مزدوجة", "لعبة تصنيف الأشياء حسب الصوت"],
    personalizedTips: ["أبعد المشتتات الصوتية أثناء التدريب."],
  }),
  buildEntry({
    id: "q03",
    question: "كيف أخفف اللدغة السينية؟",
    keywords: ["لدغة", "سين", "ثاء"],
    reply:
      "استخدمي ملعقة صغيرة لمنع تقدم اللسان وركّزي على هواء خفيف من فتحة ضيقة. ثبّتي المقاطع أولاً ثم الكلمات داخل جمل قصيرة.",
    simplified: "أوقفي تقدم اللسان ثم ثبتي المقاطع البطيئة قبل الكلمات.",
    cues: ["ملعقة لكبح اللسان", "هواء همسي", "التدرج من مقطع إلى كلمة"],
    nextActions: ["ثلاث دقائق أمام المرآة", "كتابة قائمة كلمات بالسين", "تسجيل صوتي أسبوعي"],
  }),
  buildEntry({
    id: "q04",
    question: "ابني يتلعثم عند التوتر، ما الخطة المنزلية؟",
    keywords: ["تلعثم", "توتر", "طلاقة"],
    reply:
      "ابدأ بروتين تنفس محسوب، ثم قراءة بطاقات ببطء مع إشارات عدم المقاطعة، ودوّن اللحظات السلسة في دفتر إنجازات.",
    simplified: "تنفس منتظم + قراءة ببطء + تثبيت النجاحات.",
    cues: ["شهيق أربعة وزفير ستة", "بطاقات بإيقاع ثابت", "إشارة عدم المقاطعة"],
    nextActions: ["جلستان تنفس يومياً", "عرض مسرحي صغير", "مراجعة أسبوعية بالفيديو"],
    personalizedTips: ["أبلغ العائلة بعدم استعجاله في الكلام."],
    games: [
      {
        title: "ساعي البريد الهادئ",
        objective: "المحافظة على إيقاع ثابت",
        overview: "يسلم الطفل رسالة بعد قراءتها بصوت هادئ ومرتب.",
        steps: ["اختر خمس رسائل", "اقرأها بزمن موحد", "قدم النجمة عند الهدوء"],
      },
    ],
  }),
  buildEntry({
    id: "q05",
    question: "كيف أطوّر مزج المقاطع؟",
    keywords: ["مزج", "مقاطع", "كلمة"],
    reply:
      "استمع للمقاطع منفصلة ثم دمجها ببطء مع بطاقات مصورة، وبعد الشعور بالثقة زد السرعة واستخدم المقاطع داخل لعبة خلط.",
    simplified: "دمج بطيء + دعم بصري + تسريع تدريجي.",
    cues: ["صورة لكل كلمة", "صفّق لكل مقطع", "غيّر سرعة المزج"],
    nextActions: ["جلسة خلط يومية", "إعادة تسجيل قبل وبعد", "لعبة تركيب الكلمات"],
  }),
  buildEntry({
    id: "q06",
    question: "صوت ابنتي خافت عند القراءة، أي تمارين؟",
    keywords: ["صوت", "قراءة", "وضوح"],
    reply:
      "درّبي تنفساً عميقاً متبوعاً بالعد بصوت مسموع، ثم استخدمي بطاقات تسليط الضوء لتشديد كلمات محددة داخل فقرة قصيرة.",
    simplified: "تنفس + عد مسموع + بطاقات تشديد.",
    cues: ["عدّ أثناء الزفير", "درجة صوت مختلفة لكل جملة", "تشديد كلمة أساسية"],
    nextActions: ["تحمية صوتية بالدندنة", "قراءة سطرين بنبرة مسرحية", "مراجعة التسجيل أسبوعياً"],
    personalizedTips: ["ابدئي القراءة في وضعية واقفة لتعزيز القوة."],
  }),
  buildEntry({
    id: "q07",
    question: "تعذّر التلفظ الطفولي: ماذا أفعل؟",
    keywords: ["أبراكسيا", "تسلسل", "مقاطع"],
    reply:
      "استخدم بطاقات تبين شكل الفم لكل صوت، مع تكرار المقاطع بإيقاع ثابت وتربيت خفيف على الكتف لمزامنة الحركة.",
    simplified: "بطاقات حركية + إيقاع ثابت + تحفيز لمسي خفيف.",
    cues: ["بطاقات موضع اللسان", "نقرة خفيفة على الكتف", "جلسات قصيرة متعددة"],
    nextActions: ["حصة صباحية ومسائية", "ملصقات تقدم أسبوعية", "مزج المقاطع في كلمتين"],
  }),
  buildEntry({
    id: "q08",
    question: "كيف أثبّت إيقاع الكلام؟",
    keywords: ["إيقاع", "تقطيع", "طلاقة"],
    reply:
      "فعّل تطبيق إيقاع بسيط واضبط الكلمات مع النقرات، ثم أضف حركة جسدية بسيطة كالطرق على الطاولة لتحسين الثبات.",
    simplified: "صوت إيقاعي + كلمة مع النقر + حركة بسيطة.",
    cues: ["مترو نوم بطيء", "تصفيق خفيف", "زيادة السرعة تدريجياً"],
    nextActions: ["تمثيل حوار بطيء", "إعادة ثلاث جمل صباحاً", "متابعة مخطط عدد التقطعات"],
  }),
  buildEntry({
    id: "q09",
    question: "ابني يخلط الحركات القصيرة، ما الحل؟",
    keywords: ["فتحة", "كسرة", "ضمة"],
    reply:
      "خصص لوناً لكل حركة وراقب شكل الفم في المرآة، ثم اقرأ الكلمات مع رفع البطاقة المطابقة وترديد لحن قصير.",
    simplified: "ألوان للحركات + مرآة + لحن تذكيري.",
    cues: ["بطاقة حمراء للفتحة", "تدوير الشفاه للضمة", "سحب الابتسامة للكسرة"],
    nextActions: ["لعبة مطابقة الحركات", "إعادة قراءة قائمة كلمات", "تسجيل صوتي أسبوعي"],
  }),
  buildEntry({
    id: "q10",
    question: "المجموعات الساكنة صعبة، ماذا أفعل؟",
    keywords: ["ساكنة", "مقطع", "بر"],
    reply:
      "قسّم الصوتين باستخدام عصي خشبية لتمثيل كل حرف، قرّبهما ببطء أثناء النطق المستمر ثم ثبّت الكلمة داخل جملة قصيرة.",
    simplified: "قسّم ثم جمع ببطء مع تدفق هواء مستمر.",
    cues: ["عصي لتمثيل الحروف", "هواء مستمر", "جملة تحتوي المقطع"],
    nextActions: ["لعبة تركيب الحروف", "تدريب أمام المرآة", "مقارنة تسجيل أسبوعي"],
  }),
  buildEntry({
    id: "q11",
    question: "طفلي يحذف الحرف الأخير دائماً",
    keywords: ["حرف أخير", "نطق"],
    reply:
      "استخدم صافرة أو تصفيق سريع عند نهاية الكلمة، ثم اقرأ قصة قصيرة تحتوي كلمات بنفس النهاية واطلب تلوين الحرف الأخير.",
    simplified: "صافرة للنهاية + قصة قصيرة بنفس النهاية.",
    cues: ["تصفيق للحرف الأخير", "بطاقة نهاية الكلمة", "إعادة الصوت مرتين"],
    nextActions: ["جدول متابعة للنهايات", "لعبة جمع الكلمات المتشابهة", "مراجعة أسبوعية"],
  }),
  buildEntry({
    id: "q12",
    question: "صوت النون والميم ضعيف",
    keywords: ["نون", "ميم", "أنفي"],
    reply:
      "اطلب من الطفل لمس أنفه أثناء النطق ليتحسس الاهتزاز، ثم انتقل إلى كلمات قصيرة وأغانٍ بسيطة تكرر الصوت.",
    simplified: "لمس الأنف + كلمات قصيرة + أغنية بسيطة.",
    cues: ["تحسس الاهتزاز", "فم مغلق للميم", "تنفس من الأنف"],
    nextActions: ["قائمة كلمات بأنشطة يومية", "تمثيل أغنية", "مخطط تقدم ملون"],
  }),
  buildEntry({
    id: "q13",
    question: "أريد تقوية عضلات اللسان",
    keywords: ["لسان", "تمارين", "قوة"],
    reply:
      "استخدم شفاطة لشرب عصير كثيف ثم حرّك اللسان يميناً ويساراً ببطء مع العد، واختتم بضغط خفيف بالملعقة لخمس ثوانٍ.",
    simplified: "شفاطة للعصير + حركات جانبية + ضغط بالملعقة.",
    cues: ["شفاطة قصيرة", "عد بطيء", "تعقيم الأدوات"],
    nextActions: ["جلسة فموية قبل التدريب", "تسجيل فيديو للمراقبة", "ملاحظات أسبوعية"],
  }),
  buildEntry({
    id: "q14",
    question: "طفلي على طيف التوحد ويقلّ الكلام البصري",
    keywords: ["توحد", "بصري", "مشاعر"],
    reply:
      "جرب بطاقات مشاعر ذات ألوان جذابة، اطلب منه لمس البطاقة والنظر إليك أثناء قول الجملة، وقدّم مكافأة فورية عند النجاح.",
    simplified: "بطاقات مشاعر + لمس البطاقة + مكافأة فورية.",
    cues: ["أعد التذكير بالنظر", "استخدم الأشياء المفضلة", "مدد وقت التحديق تدريجياً"],
    nextActions: ["لعبة أدوار بسيطة", "تسجيل لحظات النجاح", "مشاركة الإستراتيجية مع المعلمة"],
    games: [
      {
        title: "أبطال المشاعر",
        objective: "تنشيط التواصل البصري",
        overview: "يختار الطفل بطاقة ويصف الشعور وهو ينظر للمرافق.",
        steps: ["اختيار البطاقة", "قول الجملة", "تقديم الملصق"],
      },
    ],
  }),
  buildEntry({
    id: "q15",
    question: "طفلي يحول الأصوات الخلفية إلى أمامية",
    keywords: ["صوت خلفي", "كاف", "حنك"],
    reply:
      "وضح الفرق بين كلمتي \"كأس\" و\"تأس\" ثم استخدم ملعقة خشبية للمس الحنك الخلفي مع نطق الكاف، وكرّر ضمن كلمات يومية.",
    simplified: "تمييز سمعي + ملعقة للحنك + كلمات يومية.",
    cues: ["رفع اللسان للخلف", "مقارنة أصوات", "تسجيل تقدّم"],
    nextActions: ["مجموعة كلمات بالمطبخ", "جملة صباحية تحتوي ك", "مراجعة أسبوعية"],
  }),
  buildEntry({
    id: "q16",
    question: "الكلام السريع يسبب غموض",
    keywords: ["سرعة", "كلام", "وضوح"],
    reply:
      "لوّن كل كلمة ثم اقرأ مع لمس اللون لتذكير البطء، استخدم مؤقتاً بصرياً لتحديد زمن مناسب لكل جملة.",
    simplified: "ألوان الكلمات + لمس اللون + مؤقت بصري.",
    cues: ["لون مختلف لكل كلمة", "إشارة تباطؤ متفق عليها", "مراجعة الفيديو"],
    nextActions: ["ثلاث جمل بطيئة صباحاً", "تمثيل حوار في مسرح الظل", "تسجيل أسبوعي"],
  }),
  buildEntry({
    id: "q17",
    question: "تركيب التقويم أثّر على نطق ابنتي",
    keywords: ["تقويم", "أسنان", "تكيف"],
    reply:
      "اسمح بوقت تكيّف من خلال تمرير اللسان حول التقويم، ثم ركّز على الأصوات المتأثرة كالسين عبر تمرين مرآة بطيء.",
    simplified: "حركات فموية لطيفة ثم تدريب بطيء على الأصوات المتأثرة.",
    cues: ["تمرين اللسان حول الأقواس", "مرآة لمراقبة الاحتكاك", "تسجيل يومي قصير"],
    nextActions: ["جلسة دافئة قبل التدريب", "كلمات بديلة أسهل مؤقتاً", "تواصل مع أخصائية التقويم"],
  }),
  buildEntry({
    id: "q18",
    question: "طفلة في الثالثة تتكلم كلمات قليلة",
    keywords: ["تأخر", "مفردات", "٣ سنوات"],
    reply:
      "كرري الكلمات اليومية مع الإشارة للأشياء، واستخدمي الحديث الموازي بوصف ما تفعله الطفلة، وأضف نشاطاً حسياً بسيطاً أثناء التسمية.",
    simplified: "تكرار مع إشارة + وصف بصوت عالٍ + نشاط حسي.",
    cues: ["كرر الكلمة ثلاث مرات", "صف الموقف", "استخدم حاسة اللمس"],
    nextActions: ["دفتر مفردات مصور", "استخدام صور العائلة", "مكافأة لكل كلمة جديدة"],
    games: [
      {
        title: "كنز الكلمات الأولى",
        objective: "زيادة المفردات",
        overview: "البحث عن غرض وتسميته ثلاث مرات قبل وضعه في الصندوق.",
        steps: ["اختر خمسة أغراض", "رددي الاسم", "ضع الغرض في الصندوق"],
      },
    ],
  }),
  buildEntry({
    id: "q19",
    question: "التوتر قبل العرض المدرسي",
    keywords: ["توتر", "عرض", "مدرسة"],
    reply:
      "حضّر عرضاً تدريبياً مقسماً إلى مقاطع قصيرة مع مؤقت بصري، وامنح تغذية راجعة إيجابية محددة بعد كل جزء.",
    simplified: "عرض تدريبي قصير + مؤقت بصري + تغذية إيجابية.",
    cues: ["بيئة لعب تشبه الصف", "تعليقات محددة", "حضور شخص داعم"],
    nextActions: ["عرض مسرحي عائلي", "تمرين التنفس قبل التقديم", "مراجعة الفيديو سوياً"],
  }),
  buildEntry({
    id: "q20",
    question: "صوت مبحوح دائماً",
    keywords: ["بحة", "حبال صوتية"],
    reply:
      "حافظ على رطوبة الحبال الصوتية بماء فاتر وتجنب الصراخ، واستخدم همهمة خفيفة عشر ثوانٍ قبل أي تدريب نطقي.",
    simplified: "ماء فاتر + تجنب الصراخ + همهمة تمهيدية.",
    cues: ["زجاجة ماء مرافقة", "همهمة دافئة", "تذكير بخفض الصوت"],
    nextActions: ["سجل نبرة الصوت يومياً", "استشر طبيباً إذا استمرت البحة", "تابع تمارين التنفس"],
  }),
  buildEntry({
    id: "q21",
    question: "أريد روتيناً منزلياً منتظماً",
    keywords: ["روتين", "جدول", "جلسات"],
    reply:
      "حدد عشر دقائق ثابتة بعد وجبة خفيفة، قسم الجلسة إلى إحماء وتنفيذ ولعبة، ودوّن النتيجة في جدول بسيط.",
    simplified: "وقت ثابت + ثلاث مراحل + سجل بصري.",
    cues: ["مؤقت بالرمل", "ملصق نجاح", "مراجعة أسبوعية"],
    nextActions: ["إنشاء جدول ملون", "جلسة مراجعة كل جمعة", "استخدام لعبة مكافأة"],
  }),
  buildEntry({
    id: "q22",
    question: "ضعف عضلي يؤثر على النطق",
    keywords: ["ديسارثريا", "عضلات"],
    reply:
      "نفّذ تمرين نفخ كرة قطنية لتقوية الشفتين ثم استخدم ملعقة لتوجيه اللسان أثناء مقاطع قصيرة، مع فترات راحة كافية.",
    simplified: "نفخ قطن + ملعقة لتوجيه اللسان + راحات قصيرة.",
    cues: ["مقاومة خفيفة", "بطء متعمد", "تحفيز النجاح"],
    nextActions: ["جلسة صباحية قصيرة", "تدوين التعب", "التنسيق مع الأخصائي"],
  }),
  buildEntry({
    id: "q23",
    question: "طفلي يتعلم لغتين",
    keywords: ["لغتين", "ثنائية", "اتساق"],
    reply:
      "حدد لكل لغة وقتاً واضحاً خلال اليوم وابدأ بالأصوات المشتركة، استخدم بطاقة تشير إلى اللغة الحالية لتجنب الخلط.",
    simplified: "وقت محدد لكل لغة + بطاقة لغة واضحة.",
    cues: ["تقويم جداري", "أغانٍ بكل لغة", "تذكير بعدم الخلط"],
    nextActions: ["تسجيل جملة بكل لغة", "مشاركة الروتين مع المدرسة", "جلسة مراجعة مع العائلة"],
  }),
  buildEntry({
    id: "q24",
    question: "هل تنفع الإشارات اليدوية؟",
    keywords: ["إشارات", "مرئية"],
    reply:
      "استخدم إشارة بسيطة تمثل مكان الصوت، كررها مع النطق حتى يرتبط الصوت بالإشارة، ثم تراجع عنها تدريجياً.",
    simplified: "إشارة بسيطة ترتبط بالصوت وتُسحب لاحقاً.",
    cues: ["إشارة بيد واحدة", "توقيت الإشارة مع الصوت", "تخفيض الاستخدام تدريجياً"],
    nextActions: ["تصوير الإشارة بالفيديو", "مشاركة الإشارة مع المعلمة", "اختيار ثلاثة أصوات فقط"],
  }),
  buildEntry({
    id: "q25",
    question: "الحساسية الفموية تعيق التمرين",
    keywords: ["حساسية", "فم"],
    reply:
      "ابدأ بتدليك خارجي لطيف حول الشفتين، استخدم جل بارد قبل التمرين، ودع الطفل يتحكم في شدة اللمس تدريجياً.",
    simplified: "تدرج من الخارج للداخل مع تحكم الطفل باللمس.",
    cues: ["تفريش خفيف", "جل مبرد", "سلم الراحة"],
    nextActions: ["تقييم الراحة بعد الجلسة", "التعاون مع علاج وظيفي عند الحاجة", "دمج التمارين الحسية"],
  }),
  buildEntry({
    id: "q26",
    question: "هل أنفع جلسة قبل النوم؟",
    keywords: ["ليلة", "نوم", "تثبيت"],
    reply:
      "نعم، جلسة هادئة من ثلاث دقائق قبل النوم تساعد في تثبيت التعلم بشرط أن تكون خفيفة وتشمل جملة تشجيعية ونفساً عميقاً.",
    simplified: "جلسة قصيرة هادئة قبل النوم مع تشجيع.",
    cues: ["إضاءة خافتة", "نبرة مطمئنة", "تشجيع نهائي"],
    nextActions: ["مراجعة ثلاث كلمات", "كتابة ملاحظة إيجابية", "إطفاء الشاشات"],
  }),
  buildEntry({
    id: "q27",
    question: "التقدم متوقف منذ أسابيع",
    keywords: ["ركود", "تحفيز"],
    reply:
      "غيّر ترتيب التمارين وأدخل نشاطاً جديداً مثل تسجيل فيديو أو لعبة نقاط، وركّز على هدف صغير واحد في الأسبوع.",
    simplified: "غيّر التمارين وأضف نشاطاً جديداً وحدد هدفاً واحداً.",
    cues: ["تنويع الأساليب", "عنصر مفاجئ", "تقييم أسبوعي"],
    nextActions: ["إعادة الأساسيات", "وضع هدف صغير", "تدوين النجاحات"],
  }),
  buildEntry({
    id: "q28",
    question: "طفلي ينطق جيداً في المنزل لا في المدرسة",
    keywords: ["تعميم", "مدرسة"],
    reply:
      "حاكِ مواقف المدرسة داخل المنزل ونسّق مع المعلمة على إشارة خفية تذكّر الطفل بالصوت الصحيح.",
    simplified: "تمثيل مواقف المدرسة + إشارة خفية مع المعلمة.",
    cues: ["حوار تمثيلي", "إشارة متفق عليها", "جدول للتعميم"],
    nextActions: ["مشاركة تسجيل صوتي مع المعلمة", "لعبة حقيبة المدرسة", "مكافأة فورية عند النجاح"],
  }),
  buildEntry({
    id: "q29",
    question: "كيف أتجنب إرهاق ولي الأمر؟",
    keywords: ["ولي الأمر", "إرهاق"],
    reply:
      "قسّم المسؤولية مع شريك إن أمكن وحدد أيام راحة واضحة، وتذكر أن التقدم التدريجي أهم من الكمال.",
    simplified: "تقاسم الجهد وحدد أيام راحة واحتفل بالتقدم البسيط.",
    cues: ["أيام راحة", "أهداف واقعية", "متابعة تقدم"],
    nextActions: ["اجتماع شهري مع الأخصائي", "نشاط عائلي للاسترخاء", "تدوين الإنجازات"],
  }),
  buildEntry({
    id: "q30",
    question: "ما الموارد الرقمية الآمنة؟",
    keywords: ["موارد", "تطبيقات", "رقمية"],
    reply:
      "اختر تطبيقات موثوقة خالية من الإعلانات، خصص وقتاً قصيراً لها ثم طبق التمرين نفسه يدوياً لتعزيز التثبيت.",
    simplified: "تطبيق موثوق لوقت قصير ثم تمرين يدوي لتثبيت المهارة.",
    cues: ["مراجعة تقييمات الأخصائيين", "قاعدة زمن الشاشة", "متابعة أسبوعية"],
    nextActions: ["تقييم التطبيق مع الطفل", "مشاركة المدرسة بالأداة", "استخدام تمرين منزلي مكمل"],
  }),
];

const scoreEntry = (tokens: string[], entry: OrthoKnowledgeEntry) => {
  const entryTokens = new Set([...entry.keywords.map(normalizeText), ...tokenize(entry.question)]);
  let overlap = 0;
  tokens.forEach((token) => {
    if (entryTokens.has(token)) {
      overlap += 2;
    } else if (token.length > 3) {
      entryTokens.forEach((candidate) => {
        if (candidate.includes(token) || token.includes(candidate)) {
          overlap += 1;
        }
      });
    }
  });
  const penalty = Math.max(tokens.length, entryTokens.size) || 1;
  return overlap / penalty;
};

const matchLocalKnowledge = (question: string): OrthoKnowledgeEntry | null => {
  const tokens = tokenize(question);
  if (tokens.length === 0) {
    return null;
  }
  let best: OrthoKnowledgeEntry | null = null;
  let bestScore = 0;
  ORTHO_KNOWLEDGE_BASE.forEach((entry) => {
    const score = scoreEntry(tokens, entry);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  });
  return bestScore > 0 ? best : null;
};

const sanitizeStringArray = (value: unknown, limit: number): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0)
    .slice(0, limit);
};

const sanitizeRecommendedGames = (value: unknown): AssistantGame[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((raw) => {
      if (!raw) {
        return null;
      }
      if (typeof raw === "string") {
        const trimmed = raw.trim();
        return trimmed
          ? {
              title: trimmed,
              objective: "تنشيط النطق في لعبة ممتعة",
              overview: trimmed,
              steps: [trimmed],
            }
          : null;
      }
      const candidate = raw as Partial<AssistantGame>;
      const title = typeof candidate.title === "string" ? candidate.title.trim() : "نشاط علاجي";
      const objective = typeof candidate.objective === "string" ? candidate.objective.trim() : "تعزيز النطق";
      const overview = typeof candidate.overview === "string" ? candidate.overview.trim() : objective;
      const steps = sanitizeStringArray(candidate.steps, 6);
      const materials = sanitizeStringArray(candidate.materials, 4);
      const durationMinutes =
        typeof candidate.durationMinutes === "number" && Number.isFinite(candidate.durationMinutes) && candidate.durationMinutes > 0
          ? Math.round(candidate.durationMinutes)
          : undefined;
      return {
        title,
        objective,
        overview,
        steps: steps.length > 0 ? steps : [overview],
        materials: materials.length > 0 ? materials : undefined,
        durationMinutes,
      };
    })
    .filter((entry): entry is AssistantGame => Boolean(entry))
    .slice(0, 3);
};

const sanitizeRecommendedExercises = (value: unknown): AssistantExercise[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((raw) => {
      if (!raw) {
        return null;
      }
      if (typeof raw === "string") {
        const trimmed = raw.trim();
        return trimmed
          ? {
              title: trimmed,
              goal: trimmed,
              instructions: [trimmed],
              difficulty: "متوسط" as const,
            }
          : null;
      }
      const candidate = raw as Partial<AssistantExercise>;
      const title = typeof candidate.title === "string" ? candidate.title.trim() : "تمرين علاجي";
      const goal = typeof candidate.goal === "string" ? candidate.goal.trim() : "تعزيز مهارة النطق";
      const instructions = sanitizeStringArray(candidate.instructions, 6);
      const materials = sanitizeStringArray(candidate.materials, 4);
      const durationMinutes =
        typeof candidate.durationMinutes === "number" && Number.isFinite(candidate.durationMinutes) && candidate.durationMinutes > 0
          ? Math.round(candidate.durationMinutes)
          : undefined;
      const difficulty = candidate.difficulty === "سهل" || candidate.difficulty === "متوسط" || candidate.difficulty === "متقدم"
        ? candidate.difficulty
        : "متوسط";
      return {
        title,
        goal,
        instructions: instructions.length > 0 ? instructions : [goal],
        materials: materials.length > 0 ? materials : undefined,
        durationMinutes,
        difficulty,
      };
    })
    .filter((entry): entry is AssistantExercise => Boolean(entry))
    .slice(0, 7);
};

const createAnswerFromEntry = (entry: OrthoKnowledgeEntry): NonNullable<AssistantTurn["answer"]> => ({
  reply: entry.reply,
  simplified: entry.simplified,
  cues: entry.cues.slice(0, 6),
  nextActions: entry.nextActions.slice(0, 6),
  personalizedTips: entry.personalizedTips.slice(0, 6),
  recommendedGames: entry.games.slice(0, 3),
  recommendedExercises: entry.exercises.slice(0, 7),
  createdAt: new Date().toISOString(),
});

const mergeUnique = (base: string[], additions: string[], limit: number) => {
  const set = new Set(base);
  additions.forEach((item) => {
    if (set.size < limit && item && !set.has(item)) {
      set.add(item);
    }
  });
  return Array.from(set).slice(0, limit);
};

const enrichAnswerWithEntry = (
  answer: NonNullable<AssistantTurn["answer"]>,
  entry: OrthoKnowledgeEntry,
): NonNullable<AssistantTurn["answer"]> => ({
  ...answer,
  cues: mergeUnique(answer.cues, entry.cues, 6),
  nextActions: mergeUnique(answer.nextActions, entry.nextActions, 6),
  personalizedTips: mergeUnique(answer.personalizedTips, entry.personalizedTips, 6),
  recommendedGames:
    answer.recommendedGames.length > 0 ? answer.recommendedGames : entry.games.slice(0, 3),
  recommendedExercises:
    answer.recommendedExercises.length > 0 ? answer.recommendedExercises : entry.exercises.slice(0, 7),
});

const QUICK_PROMPTS = [
  "كيف أدعم طفلي في نطق حرف الراء؟",
  "كيف أساعده على التمييز بين س وش في المنزل؟",
  "ما الخطة المنزلية لتقليل التلعثم عند التوتر؟",
  "أريد تمارين يومية لطفلة تعاني من لدغة السين.",
  "اقترح ألعابًا لطفل يتأخر في الكلام بعمر ثلاث سنوات.",
];

const arraysEqual = (first: string[], second: string[]) => {
  if (first.length !== second.length) {
    return false;
  }
  return first.every((value, index) => value === second[index]);
};

interface SpeechTherapyAssistantProps {
  childName: string;
  trainingProgress: TrainingProgressSnapshot;
  onReplyCountChange?: (count: number) => void;
  onHighlightsChange?: (highlights: string[]) => void;
  onLogInteraction?: (payload: AssistantLogPayload) => void;
}

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
        turn.answer?.recommendedGames.forEach((game) => game.title && highlightsSet.add(game.title));
        turn.answer?.recommendedExercises.forEach((exercise) => exercise.title && highlightsSet.add(exercise.title));
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
        history.push({ role: "parent", content: turn.question, createdAt: turn.askedAt });
      }
      if (turn.answer) {
        history.push({ role: "assistant", content: turn.answer.reply, createdAt: turn.answer.createdAt });
      }
    });
    return history.slice(-10);
  }, [conversation]);

  const buildContextTags = useCallback(() => [
    `letters_index:${trainingProgress.letters.currentIndex}`,
    `words_index:${trainingProgress.words.currentIndex}`,
    `discrimination_index:${trainingProgress.discrimination.currentIndex}`,
    trainingProgress.letters.completed ? "letters_completed" : "letters_in_progress",
    trainingProgress.words.completed ? "words_completed" : "words_in_progress",
    trainingProgress.discrimination.completed ? "discrimination_completed" : "discrimination_in_progress",
  ], [trainingProgress]);

  const submitMessage = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isThinking) {
      return;
    }

    const localMatch = matchLocalKnowledge(trimmed);
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
        headers: { "Content-Type": "application/json" },
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

      const data = (await response.json()) as AssistantResponsePayload;
      const reply = data.reply?.trim() ?? "";
      const simplifiedReply = data.simplifiedReply?.trim() ?? reply;
      const answer = {
        reply,
        simplified: simplifiedReply.length > 0 ? simplifiedReply : reply,
        cues: sanitizeStringArray(data.cues, 6),
        nextActions: sanitizeStringArray(data.nextActions, 6),
        personalizedTips: sanitizeStringArray(data.personalizedTips, 6),
        recommendedGames: sanitizeRecommendedGames(data.recommendedGames),
        recommendedExercises: sanitizeRecommendedExercises(data.recommendedExercises),
        createdAt: data.storedAt ?? new Date().toISOString(),
      } satisfies NonNullable<AssistantTurn["answer"]>;

      const finalAnswer = localMatch ? enrichAnswerWithEntry(answer, localMatch) : answer;

      setConversation((prev) =>
        prev.map((turn) => (turn.id === pendingTurn.id ? { ...turn, answer: finalAnswer, error: null } : turn)),
      );

      onLogInteraction?.({
        type: "assistant",
        activity: localMatch ? "رد الذكاء الاصطناعي مع تعزيز محلي" : "رد الذكاء الاصطناعي",
        result: "success",
        notes: finalAnswer.reply,
      });
    } catch (error) {
      if (localMatch) {
        const localAnswer = createAnswerFromEntry(localMatch);
        setConversation((prev) =>
          prev.map((turn) => (turn.id === pendingTurn.id ? { ...turn, answer: localAnswer, error: null } : turn)),
        );
        onLogInteraction?.({
          type: "assistant",
          activity: "رد من قاعدة المعرفة المحلية",
          result: "info",
          notes: localAnswer.reply,
        });
        setErrorMessage(null);
      } else {
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
      }
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
            استعن بالمستشار الذكي للحصول على إجابة دقيقة، ونصائح موجهة، وتمارين لعب علاجية مصممة لطفلك.
          </CardDescription>
        </div>
        <Badge className="bg-slate-900 text-white">ذكاء اصطناعي + خبرة علاجية</Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-3xl border border-sky-100 bg-white/90 p-4 shadow-inner">
          <div className="mb-4 rounded-2xl bg-gradient-to-l from-sky-100 via-white to-emerald-50 p-4 text-sm text-sky-900">
            <p className="font-semibold text-sky-800">👋 أهلاً بك مع أورثو الذكي!</p>
            <p className="mt-1 leading-7 text-sky-700">
              شاركني الصوت أو الموقف الذي يشكّل تحدياً لدى {childName || "طفلك"}. سأقترح خطوات عملية، ونصائح مخصّصة، وألعاباً وتمارين منزلية جاهزة للتنفيذ.
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
                          إجابة أورثو الذكي
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
                              <li>اتبع التوجيهات المفصلة أعلاه ودوّن التقدم يومياً.</li>
                            ) : (
                              turn.answer.nextActions.map((action, index) => <li key={`${turn.id}-action-${index}`}>• {action}</li>)
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
                            <Badge key={`${turn.id}-cue-${index}`} variant="secondary" className="bg-sky-100 text-sky-700">
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
                              <div key={`${turn.id}-game-${gameIndex}`} className="rounded-xl bg-white/70 p-3 shadow-sm shadow-emerald-100">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="text-sm font-semibold text-emerald-800">{game.title}</p>
                                  {typeof game.durationMinutes === "number" && (
                                    <span className="flex items-center gap-1 text-xs text-emerald-600">
                                      <Clock3 className="h-3.5 w-3.5" />
                                      {game.durationMinutes} دقيقة
                                    </span>
                                  )}
                                </div>
                                <p className="mt-2 text-sm leading-6 text-emerald-800">{game.overview}</p>
                                {game.objective && <p className="mt-2 text-xs text-emerald-700">الهدف: {game.objective}</p>}
                                {game.steps.length > 0 && (
                                  <ol className="mt-2 space-y-1 text-xs leading-5 text-emerald-800">
                                    {game.steps.map((step, stepIndex) => (
                                      <li key={`${turn.id}-game-${gameIndex}-step-${stepIndex}`}>{stepIndex + 1}. {step}</li>
                                    ))}
                                  </ol>
                                )}
                                {Array.isArray(game.materials) && game.materials.length > 0 && (
                                  <p className="mt-2 text-xs text-emerald-700">الأدوات: {game.materials.join("، ")}</p>
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
                              <div key={`${turn.id}-exercise-${exerciseIndex}`} className="rounded-xl border border-sky-100 bg-white/80 p-3 shadow-sm shadow-sky-100">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="text-sm font-semibold text-sky-900">{exercise.title}</p>
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-sky-700">
                                    <span className="rounded-full bg-sky-100 px-2 py-0.5 font-medium">الصعوبة: {exercise.difficulty}</span>
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
                                      <li key={`${turn.id}-exercise-${exerciseIndex}-step-${stepIndex}`}>• {step}</li>
                                    ))}
                                  </ul>
                                )}
                                {Array.isArray(exercise.materials) && exercise.materials.length > 0 && (
                                  <p className="mt-2 text-xs text-slate-600">الأدوات المقترحة: {exercise.materials.join("، ")}</p>
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
                    <div className="max-w-[85%] rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{turn.error}</div>
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

        {errorMessage && <p className="text-center text-xs text-rose-500">{errorMessage}</p>}

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
            <Button type="submit" className="bg-sky-600 text-white hover:bg-sky-700" disabled={!inputValue.trim() || isThinking}>
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
