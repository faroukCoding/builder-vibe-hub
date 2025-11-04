import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// use native textarea here to avoid focus/forwardRef edge-cases in some environments
import { MessageCircle, PartyPopper, Sparkles, UserRound } from "lucide-react";

type AssistantItemType = "faq" | "exercise" | "tip";

interface AssistantItemExtra {
  goal?: string;
  duration?: string;
  steps?: string[];
  suggestions?: string[];
}

interface AssistantItem {
  id: string;
  section: string;
  type: AssistantItemType;
  question?: string;
  title?: string;
  answer: string;
  keywords: string[];
  extra?: AssistantItemExtra;
}

interface AssistantQuickReply {
  id: string;
  label: string;
  itemId: string;
}

interface FollowUpOption {
  id: string;
  label: string;
  itemId: string;
}

type ChatRole = "assistant" | "user";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  item?: AssistantItem;
  suggestions?: FollowUpOption[];
}

type AssistantLogPayload = {
  type: "assistant";
  activity: string;
  result: "success" | "retry" | "info";
  notes: string;
  mediaLink?: string | null;
};

export interface TrainingProgressSnapshot {
  letters: {
    currentIndex: number;
    completed: boolean;
  };
  words: {
    currentIndex: number;
    completed: boolean;
  };
  discrimination: {
    currentIndex: number;
    completed: boolean;
  };
}

interface SpeechTherapyAssistantProps {
  childName?: string;
  trainingProgress?: TrainingProgressSnapshot;
  onReplyCountChange?: (count: number) => void;
  onHighlightsChange?: (highlights: string[]) => void;
  onLogInteraction?: (payload: AssistantLogPayload) => void;
}

const SECTION_SPEECH = "🗣️ النطق والكلام";
const SECTION_LANGUAGE = "🧠 التأخر اللغوي";
const SECTION_HOME = "👨‍👩‍👦 المتابعة المنزلية";
const SECTION_AWARENESS = "🔊 الوعي الصوتي والسمعي";
const SECTION_EXERCISES = "🧩 تمارين منزلية";
const SECTION_TIPS = "💡 نصائح تربوية";

// Clé pour localStorage
const STORAGE_KEY = "speech_therapy_chat_history";

// Helper localStorage avec gestion d'erreurs
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

const assistantData: AssistantItem[] = [
  {
    id: "speech_letter_r",
    section: SECTION_SPEECH,
    type: "faq",
    question: '👶 ابني لا ينطق حرف "ر"، هل هذا طبيعي؟',
    answer:
      'نعم 😊، من الشائع أن يتأخر الأطفال في نطق حرف "ر" حتى سن 6 سنوات. جرّبوا ألعاب تقليد صوت السيارة "رررر 🚗" أو نفخ اللسان بخفة. إذا استمر التحدي بعد 6 سنوات فزيارة الأخصائي خطوة مطمئنة.',
    keywords: ["حرف الراء", "راء", "نطق الراء", "ابني لا ينطق ر", "تمرين حرف الراء"],
    extra: {
      suggestions: ["قلدوا صوت السيارة رررر 🚗 لدقيقة يوميًا.", "دفتر صغير لتسجيل الكلمات التي تحتوي على ر.", "استشارة الأخصائي عند تجاوز سن 6 سنوات بدون تقدم."],
    },
  },
  {
    id: "speech_letter_swap",
    section: SECTION_SPEECH,
    type: "faq",
    question: '💬 ابني يستبدل الحروف مثل "توتة" بدل "ثوثة"',
    answer:
      'هذا طبيعي في المراحل الأولى من الكلام. بعد سن 5 سنوات نبدأ بتصحيح النطق عبر تمييز صوت الحرف ثم تدريبات بسيطة للسماع والتكرار 🎯.',
    keywords: ["يستبدل الحروف", "ثوثة", "توتة", "تصحيح النطق", "خلط الحروف"],
    extra: {
      suggestions: ["لعبة تمييز الأصوات باستخدام بطاقات ملونة.", "تكرار الكلمة الصحيحة بثلاث سرعات مختلفة.", "التقاط كلمات من الكتب اليومية تحتوي على الصوت الصحيح."],
    },
  },
  {
    id: "speech_stutter",
    section: SECTION_SPEECH,
    type: "faq",
    question: "😶 ابني يتلعثم أحيانًا عند الكلام",
    answer:
      'التلعثم المؤقت طبيعي بين 3 و5 سنوات. لا تُقاطعيه ولا تُصححي أثناء حديثه ❤️. أظهري له أنك تستمعين باهتمام، وإذا استمر التلعثم أو زاد مع التوتر فاستشارة الأخصائي تمنحك خطة أدق.',
    keywords: ["تلعثم", "يتلعثم", "يتأتئ", "يتردد", "الطلاقة"],
    extra: {
      suggestions: ["اتفقوا على إشارة هادئة تدعو للبطء دون مقاطعة.", "خصصوا 5 دقائق يوميًا لحديث هادئ بطيء الإيقاع.", "سجلوا لحظات الطلاقة وشاهدوها معًا لرفع الثقة."],
    },
  },
  {
    id: "speech_sound_discrimination",
    section: SECTION_SPEECH,
    type: "faq",
    question: '👂 طفلي لا يميز بين الأصوات القريبة مثل "س" و"ص"',
    answer:
      'دربوه على ألعاب تمييز الأصوات 🎵. اسألوا: «هل سمعت س أم ص؟» مع صور أو بطاقات. هذا النشاط ينمّي الوعي السمعي ويقوّي وضع اللسان.',
    keywords: ["تمييز الأصوات", "س وص", "وعي سمعي", "صوت السين", "صوت الصاد"],
    extra: {
      suggestions: ["استخدموا مرآة لشرح وضع اللسان لكل صوت.", "ألوان مختلفة لكل حرف لتسهيل التمييز.", "تسجيل الجلسة وسماع الفرق مع الطفل."],
    },
  },
  {
    id: "language_delay_age3",
    section: SECTION_LANGUAGE,
    type: "faq",
    question: "🧒 طفلي عمره 3 سنوات ولا يتكلم بعد",
    answer:
      'في هذا العمر نحب أن نسمع جملة بسيطة من 3 كلمات على الأقل. تحدثوا معه أثناء اللعب، اطرحوا أسئلة مفتوحة، وساعدوه على التعبير بالإشارة أو كلمة واحدة مع تعزيز كبير 🌟.',
    keywords: ["عمره 3 سنوات", "لا يتكلم", "تأخر لغوي", "تأخر الكلام", "ثلاث كلمات"],
    extra: {
      suggestions: ["استخدام صور العائلة لتسمية الأشخاص يوميًا.", "ترديد الكلمات الجديدة ثلاث مرات متتالية.", "تسجيل قائمة أسبوعية بالكلمات المكتسبة."],
    },
  },
  {
    id: "language_expressive_delay",
    section: SECTION_LANGUAGE,
    type: "faq",
    question: "💭 طفلي يفهم كل شيء لكنه لا يتكلم",
    answer:
      'هذا يسمى تأخرًا تعبيريًا. استعملوا الصور والقصص المصوّرة 📚 ودعوه يشير أو يختار الكلمة الصحيحة. اعرضوا عليه كلمتين ليختار بينهما ثم شجعوه على تكرارها.',
    keywords: ["يفهم ولا يتكلم", "تأخر تعبيري", "لا يتكلم", "فهم كل شيء"],
    extra: {
      suggestions: ["صندوق صور للأشياء اليومية مع تكرار الأسماء.", "استخدام إشارات اليد كجسر نحو الكلمة.", "تشجيع أي صوت أو محاولة لفظ مع تصفيق."],
    },
  },
  {
    id: "language_screens",
    section: SECTION_LANGUAGE,
    type: "faq",
    question: "📱 هل التلفاز والهاتف يسببان تأخرًا لغويًا؟",
    answer:
      'نعم، الشاشات من أهم أسباب التأخر اللغوي ❌ إذا طالت مدتها. احصروا المشاهدة في أقل من 30 دقيقة يوميًا، واجعلوها نشاطًا تفاعليًا تسألون فيه وتعلقون مع طفلكم.',
    keywords: ["التلفاز", "الهاتف", "شاشات", "تأخر لغوي", "سكرين"],
    extra: {
      suggestions: ["النقاش حول ما يشاهده الطفل بدل المشاهدة الصامتة.", "استبدال نصف وقت الشاشة بأنشطة حسية أو قصص.", "ضبط مؤقت مرئي يساعد الطفل على توقع نهاية الوقت."],
    },
  },
  {
    id: "language_difference",
    section: SECTION_LANGUAGE,
    type: "faq",
    question: "🧠 الفرق بين التأخر اللغوي واضطراب النطق",
    answer:
      'التأخر اللغوي يعني أن حصيلة الكلمات أو الجمل أقل من المتوقع ولكن مخارج الحروف قد تكون سليمة. اضطراب النطق يتعلق بكيفية خروج الصوت نفسه (مثل نطق س على شكل ث). قد يجتمعان معًا، لكن الخطة تختلف: نعالج المفردات في الأول ونركز على مخارج الحروف في الثاني.',
    keywords: ["الفرق", "التأخر اللغوي", "اضطراب النطق", "مخارج", "لغة ونطق"],
    extra: {
      suggestions: ["سجلوا كلمات الطفل لتحديد هل المشكلة في عدد الكلمات أم في طريقة النطق.", "استشارة الأخصائي لوضع خطة مزدوجة عند الحاجة.", "دمج تمارين المفردات مع تمارين مخارج الحروف."],
    },
  },
  {
    id: "home_frequency",
    section: SECTION_HOME,
    type: "faq",
    question: "🕒 كم مرة أدرّب طفلي؟",
    answer:
      'مرتان يوميًا تكفيان (10–15 دقيقة) مع التركيز على الاستمرارية ⏱️. اجعلوا التدريب بعد لحظة ممتعة وخفيفة ليبقى مرتبطًا بالمشاعر الإيجابية.',
    keywords: ["كم مرة", "تدريب", "جدول", "تنظيم التدريب", "جلسات"],
    extra: {
      suggestions: ["قسموا الجلسة إلى إحماء، تدريب، لعبة ختامية.", "ضبط منبه لطيف يذكر بوقت الجلسة.", "اكتبوا الإنجاز اليومي في جدول ملون."],
    },
  },
  {
    id: "home_refusal",
    section: SECTION_HOME,
    type: "faq",
    question: "😔 طفلي يرفض التمرين",
    answer:
      'لا تجبروه ❤️. حوّلوا التمرين إلى لعبة، استعملوا مكافآت صغيرة 🌟 وكلمات تشجيع، وشاركونه اللعب لتشعروا أنه وقت مرح وليس اختبارًا.',
    keywords: ["يرفض التمرين", "رفض", "لا يريد", "تحفيز", "تشجيع"],
    extra: {
      suggestions: ["اختيار الطفل لأداة أو لعبة مفضلة أثناء التدريب.", "استخدام نظام نقاط بسيط يستبدل بجائزة أسبوعية.", "تسجيل فيديو قصير عند نجاح صغير للاحتفال."],
    },
  },
  {
    id: "home_specialist",
    section: SECTION_HOME,
    type: "faq",
    question: "🎯 هل يمكن تدريبه في المنزل دون أخصائي؟",
    answer:
      'المتابعة المنزلية رائعة، لكنها لا تغني عن تقييم الأخصائي الذي يحدد الخطة الدقيقة. امزجوا بين الجلسات المنزلية والزيارات الدورية لمتابعة التقدم.',
    keywords: ["بدون أخصائي", "في المنزل", "تدريب منزلي", "جلسات", "استشارة"],
    extra: {
      suggestions: ["استشارة الأخصائي كل 6–8 أسابيع لمراجعة الخطة.", "تدوين الأسئلة التي تظهر خلال التدريب المنزلي.", "مشاركة تسجيلات التقدم مع الأخصائي."],
    },
  },
  {
    id: "awareness_sound_game",
    section: SECTION_AWARENESS,
    type: "faq",
    question: "🔊 كيف أساعده على تمييز الأصوات؟",
    answer:
      'العبوا لعبة "صوت من هذا؟" 🐱🐶🚗. اسألوا عن مصدر الصوت ثم اطلبوا تقليده. هذه الألعاب تنمّي الوعي السمعي وتفتح الحوار حول الأصوات القريبة.',
    keywords: ["تمييز", "وعي صوتي", "صوت من هذا", "تحفيز السمع", "ألعاب صوت"],
    extra: {
      suggestions: ["استخدموا أصوات الحياة اليومية (جَرَس، ماء، سيارة).", "غطي عيني الطفل ليعتمد على السمع فقط.", "سجلوا الأصوات المفضلة لتكرار اللعبة لاحقًا."],
    },
  },
  {
    id: "awareness_story_talk",
    section: SECTION_AWARENESS,
    type: "faq",
    question: "📖 ما أفضل طريقة لتحفيزه على الكلام؟",
    answer:
      'استعملوا القصص المصوّرة والأغاني 🎵. اسألوه: «ما هذا؟» و«ماذا يفعل؟» وأعطوه فرصة للجواب قبل أن تساعدوه.',
    keywords: ["تحفيز الكلام", "أفضل طريقة", "قصص", "أغاني", "طرح الأسئلة"],
    extra: {
      suggestions: ["تخصيص وقت قصة يومي قبل النوم.", "الغناء مع حركات يد لتثبيت الكلمات.", "استخدام صور الحياة اليومية وطلب وصف بسيط."],
    },
  },
  {
    id: "exercise_s_sound",
    section: SECTION_EXERCISES,
    type: "exercise",
    title: '🎯 تمرين نطق حرف "س"',
    answer:
      'ابدؤوا بصوت همس طويل "س" ثم انتقلوا إلى كلمات سهلة مثل «سماء»، «سماعة»، «سعيد». أكّدوا على وضع اللسان خلف الأسنان الأمامية مع ابتسامة خفيفة 😊.',
    keywords: ["حرف س", "نطق السين", "تمرين س", "تصحيح س"],
    extra: {
      goal: "تصحيح نطق الصوت س مع ثبات تدفق الهواء.",
      duration: "5 دقائق يوميًا",
      steps: ["تنفس عميق ثم إصدار صوت همس طويل سسّس.", "تكرار مقاطع قصيرة: سا – سي – سو.", "استخدام كلمات مألوفة مع تعزيز فوري وملصق مرح."],
      suggestions: ["استخدموا مرآة ليرى الطفل شكل ابتسامته.", "سجلوا الصوت قبل وبعد الأسبوع لملاحظة الفرق."],
    },
  },
  {
    id: "exercise_breath_control",
    section: SECTION_EXERCISES,
    type: "exercise",
    title: "💨 تمرين التنفس والتحكم بالهواء",
    answer:
      'ضعوا منديلاً خفيفًا أمام الطفل لينفخ عليه بلطف دون أن يسقط. يساعد على تقوية عضلات الفم والتحكم بالتنفس قبل الكلام.',
    keywords: ["تنفس", "هواء", "منديل", "تحكم", "نفخ"],
    extra: {
      goal: "تقوية عضلات الفم وضبط النفس قبل النطق.",
      duration: "3 دقائق يوميًا",
      steps: ["شهيق بطيء من الأنف.", "زفير لطيف باتجاه المنديل دون إسقاطه.", "إعادة المحاولة ثلاث مرات مع تشجيع."],
      suggestions: ["اجعلوا المنديل ملوّنًا لجذب الانتباه.", "أضيفوا عدًا مرحًا: 1..2..3 أثناء النفخ."],
    },
  },
  {
    id: "exercise_tongue_flexibility",
    section: SECTION_EXERCISES,
    type: "exercise",
    title: "👅 تمرين مرونة اللسان",
    answer:
      'أمام المرآة، حرّكوا اللسان يمينًا ويسارًا وفوق وتحت مع ابتسامة مرحة. يقوّي التحكم الحركي للسان.',
    keywords: ["مرونة اللسان", "تمرين اللسان", "لسان", "حركة الفم"],
    extra: {
      goal: "تحسين مدى حركة اللسان ودقته.",
      duration: "5 دقائق يوميًا",
      steps: ["وضع اللسان على زاوية الفم اليمنى ثم اليسرى.", "رفع اللسان نحو الأنف ثم نزوله نحو الذقن.", "تكرار الحركات ثلاث مرات مع متابعة في المرآة."],
      suggestions: ["استخدموا ملصقات نجوم للمحاولات الناجحة.", "التقاط صورة مضحكة بعد كل جلسة لربط التمرين بالمرح."],
    },
  },
  {
    id: "exercise_sound_game",
    section: SECTION_EXERCISES,
    type: "exercise",
    title: "🎵 لعبة الأصوات",
    answer:
      'قلّدوا أصوات الحيوانات والحروف معًا: 🐱 مياو، 🐶 هاو، 🚗 بروم. يساعد على تحسين الوعي السمعي وربط الصوت بالكلمة.',
    keywords: ["لعبة الأصوات", "ألعاب كلام", "تحفيز الكلام", "تقليد أصوات"],
    extra: {
      goal: "تحسين الوعي السمعي وتمثيل الأصوات.",
      duration: "5 دقائق",
      steps: ["اختيار ثلاثة أصوات للحيوانات أو الأشياء.", "تقليد الصوت مع الطفل ثم طلبه منه منفردًا.", "دمج الصوت داخل كلمة أو جملة قصيرة."],
      suggestions: ["استخدموا بطاقات مصورة للأصوات.", "أضفوا حركة يد أو جسد لكل صوت لزيادة التثبيت."],
    },
  },
  {
    id: "exercise_hard_letters",
    section: SECTION_EXERCISES,
    type: "exercise",
    title: "🧩 تمرين نطق الحروف الصعبة",
    answer:
      'اختروا حرفًا صعبًا (ر، س، ش...) وكرروا كلمات تحتوي عليه مثل "رمان – ريشة – قطار" مع إيقاع مرح وتصفيق.',
    keywords: ["حروف صعبة", "نطق الحروف", "تمرين الحروف", "تكرار الكلمات"],
    extra: {
      goal: "تثبيت الحرف الصعب داخل كلمات مختلفة.",
      duration: "5 دقائق",
      steps: ["اختيار ثلاث كلمات تحتوي الحرف المستهدف.", "نطق الكلمات ببطء ثم بسرعة.", "استخدام الكلمة في جملة قصيرة.", "تلوين الحرف في بطاقة خاصة."],
      suggestions: ["اصنعوا قائمة قابلة للتعليق للحروف المتقنة.", "سجلوا مباراة ودية: من ينطق الكلمة بشكل أوضح؟"],
    },
  },
  {
    id: "exercise_daily_words",
    section: SECTION_EXERCISES,
    type: "exercise",
    title: "🎲 كلمات الحياة اليومية",
    answer:
      'اختروا ثلاث كلمات جديدة يوميًا واستعملوها أثناء اليوم: عند الطعام، اللعب، وقت النوم. تربط اللغة بالحياة الواقعية.',
    keywords: ["كلمات جديدة", "مفردات", "حياة يومية", "توسيع اللغة"],
    extra: {
      goal: "ربط الكلمة بالموقف اليومي لزيادة التذكر.",
      duration: "يوميًا",
      steps: ["اختيار ثلاث كلمات صباحًا.", "ذكر الكلمة في ثلاثة مواقف مختلفة.", "تشجيع الطفل على استخدام الكلمة في جملة."],
      suggestions: ["تعليق الكلمات على الثلاجة مع رسمة بسيطة.", 'إنشاء دفتر "كلمة اليوم" مع ملصق.'],
    },
  },
  {
    id: "tips_parents",
    section: SECTION_TIPS,
    type: "tip",
    title: "💡 نصائح تربوية للأولياء",
    answer:
      '🧸 تحدث مع طفلك ببطء ووضوح وكرر الكلمات.\n😊 امدحه عند أي تقدم صغير.\n🚫 لا تُكمل الجمل عنه.\n📚 استخدم القصص والأغاني التعليمية.\n⏰ اجعل التدريب قصيرًا ومتكررًا.\n🎯 حوّل كل تمرين إلى لعبة.\n💖 لا تقارن طفلك بغيره.\n👂 استمع له بصبر.\n📱 قلّل الشاشات واستبدلها بأنشطة تفاعلية.\n🧠 التطور الصغير اليومي هو الأهم.',
    keywords: ["نصائح", "أولياء", "تحفيز", "تربوية", "تشجيع"],
    extra: {
      suggestions: ["اختر نصيحة واحدة للتركيز عليها كل أسبوع.", "شارك التقدم مع باقي أفراد العائلة ليدعموا نفس الأسلوب.", 'دوّن اللحظات الجميلة في مفكرة "نجاحاتنا".'],
    },
  },
];

const assistantDataMap: Record<string, AssistantItem> = assistantData.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {} as Record<string, AssistantItem>);

const QUICK_REPLIES: AssistantQuickReply[] = [
  { id: "quick_s_pronunciation", label: '🎯 تمرين نطق حرف "س"', itemId: "exercise_s_sound" },
  { id: "quick_tongue_flex", label: "👅 تمرين مرونة اللسان", itemId: "exercise_tongue_flexibility" },
  { id: "quick_language_vs_speech", label: "🧠 الفرق بين التأخر اللغوي واضطراب النطق", itemId: "language_difference" },
  { id: "quick_stutter", label: "💬 كيف أتعامل مع تلعثم طفلي؟", itemId: "speech_stutter" },
  { id: "quick_home_routine", label: "🏠 تنظيم التدريب المنزلي", itemId: "home_frequency" },
  { id: "quick_speech_games", label: "🔊 ألعاب لتحفيز الكلام", itemId: "exercise_sound_game" },
  { id: "quick_parent_tips", label: "📖 نصائح لتحفيز الطفل على النطق", itemId: "tips_parents" },
];

const FOLLOW_UP_RECOMMENDATIONS: FollowUpOption[] = [
  { id: "follow_hard_letters", label: "🔹 تمرين نطق الحروف الصعبة", itemId: "exercise_hard_letters" },
  { id: "follow_breath_control", label: "🔹 تمرين التنفس والتحكم بالهواء", itemId: "exercise_breath_control" },
];

const stripDiacritics = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u064B-\u0652]/g, "")
    .normalize("NFC");

const normalizeText = (value: string) =>
  stripDiacritics(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const scoreAssistantItem = (normalizedQuestion: string, item: AssistantItem) => {
  if (!normalizedQuestion) {
    return 0;
  }
  let score = 0;
  const questionKeywords = item.keywords.map((keyword) => normalizeText(keyword));
  questionKeywords.forEach((keyword) => {
    if (!keyword) {
      return;
    }
    if (normalizedQuestion.includes(keyword)) {
      score += 3;
    }
  });
  if (item.question) {
    const normalizedQuestionText = normalizeText(item.question);
    if (normalizedQuestionText && normalizedQuestion.includes(normalizedQuestionText)) {
      score += 4;
    }
  }
  if (item.title) {
    const normalizedTitle = normalizeText(item.title);
    if (normalizedTitle && normalizedQuestion.includes(normalizedTitle)) {
      score += 2;
    }
  }
  return score;
};

const findAssistantItem = (question: string): AssistantItem | null => {
  const normalizedQuestion = normalizeText(question);
  let best: AssistantItem | null = null;
  let bestScore = 0;
  assistantData.forEach((item) => {
    const score = scoreAssistantItem(normalizedQuestion, item);
    if (score > bestScore) {
      best = item;
      bestScore = score;
    }
  });
  return bestScore >= 4 ? best : null;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Use the server-side assistant endpoint so the API key remains on the server
const requestOpenAIResponse = async (prompt: string, childName?: string): Promise<string | null> => {
  try {
    const res = await fetch("/api/ai-assistant/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentId: "parent-1", message: prompt }),
    });

    if (!res.ok) {
      console.error("Assistant endpoint error", res.status, await res.text());
      return null;
    }

    const data = (await res.json()) as { reply?: string };
    return data.reply ?? null;
  } catch (error) {
    console.error("Failed to call assistant endpoint", error);
    return null;
  }
};

export default function SpeechTherapyAssistant({
  childName,
  onReplyCountChange,
  onHighlightsChange,
  onLogInteraction,
}: SpeechTherapyAssistantProps) {
  // États avec initialisation depuis localStorage
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = storage.get<ChatMessage[]>(STORAGE_KEY, []);
    // Si pas de messages sauvegardés, retourner tableau vide (le welcome sera ajouté dans useEffect)
    return saved.length > 0 ? saved : [];
  });
  // use uncontrolled textarea to avoid flicker/reset issues on re-render
  const [isTyping, setIsTyping] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);
  const conversationRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [inputValue, setInputValue] = useState("");
  const isComposingRef = useRef(false);
  const initializedRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const PARENT_ID = "parent-1"; // TODO: replace with real parent identifier when available

  const welcomeMessage = useMemo(
    () =>
      `👋 مرحبًا! أنا المساعد الذكي لمتابعة تقدم طفلك في النطق والكلام.\nاختر من الأزرار بالأسفل أو اطرح سؤالك مباشرة 💬👇${childName ? `\nسننجح معًا يا ${childName} 🌈` : ""}`,
    [childName],
  );

  // Sauvegarder dans localStorage à chaque changement de messages
  useEffect(() => {
    if (messages.length > 0) {
      storage.set(STORAGE_KEY, messages);
    }
  }, [messages]);

  // Message de bienvenue initial
  useEffect(() => {
    if (initializedRef.current) {
      return;
    }
    initializedRef.current = true;
    
    // Si pas de messages sauvegardés, ajouter le message de bienvenue
    // Try to hydrate from server history first so chats persist across devices
    (async () => {
      try {
        const res = await fetch(`/api/ai-assistant/history?parentId=${encodeURIComponent(
          PARENT_ID,
        )}&limit=50`);
        if (res.ok) {
          const data = await res.json();
          const serverMessages = (data.messages ?? []) as Array<{
            id: string;
            role: "parent" | "assistant";
            content: string;
            timestamp: string;
            suggestedActions?: string[];
          }>;

          if (serverMessages.length > 0) {
            const mapped = serverMessages.map((m) => {
              // try to associate suggestedActions strings with known assistant items
              const suggestions = (m.suggestedActions ?? []).map((s, i) => {
                // try to find item by matching title/question/answer substrings
                const foundItem = assistantData.find((it) => {
                  const needle = s.toLowerCase();
                  return (
                    (it.title && it.title.toLowerCase().includes(needle)) ||
                    (it.question && it.question.toLowerCase().includes(needle)) ||
                    (it.answer && it.answer.toLowerCase().includes(needle))
                  );
                });
                return {
                  id: `srv-${i}-${Date.now()}`,
                  label: s,
                  itemId: foundItem ? foundItem.id : "",
                } as FollowUpOption;
              });

              return {
                id: m.id,
                role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
                content: m.content,
                // attempt to attach item reference if possible (match by answer)
                item: assistantData.find((it) => it.answer === m.content) ?? undefined,
                suggestions: suggestions.length ? suggestions : undefined,
              } as ChatMessage;
            });
            setMessages(mapped);
            // do not overwrite with welcome message
            return;
          }
        }
      } catch (err) {
        // ignore — fallback to local welcome
        console.warn("Failed to load assistant history from server:", err);
      }

      if (messages.length === 0) {
        setMessages([
          {
            id: "assistant-welcome",
            role: "assistant",
            content: welcomeMessage,
          },
        ]);
      }
    })();
  }, [welcomeMessage, messages.length]);

  // Auto-scroll
  useEffect(() => {
    if (!conversationRef.current) {
      return;
    }
    conversationRef.current.scrollTo({ top: conversationRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  // Mise à jour des highlights et compteurs
  useEffect(() => {
    const assistantMessages = messages.filter((message) => message.role === "assistant");
    onReplyCountChange?.(assistantMessages.length);

    if (onHighlightsChange) {
      const highlights = new Set<string>();
      assistantMessages.forEach((message) => {
        const item = message.item;
        if (!item?.extra) {
          return;
        }
        if (item.extra.goal) {
          highlights.add(item.extra.goal);
        }
        if (item.extra.duration) {
          highlights.add(`المدة المقترحة: ${item.extra.duration}`);
        }
        item.extra.suggestions?.forEach((suggestion) => {
          if (suggestion) {
            highlights.add(suggestion);
          }
        });
      });
      onHighlightsChange(Array.from(highlights).slice(0, 8));
    }
  }, [messages, onReplyCountChange, onHighlightsChange]);

  const addAssistantMessage = useCallback(
    (content: string, item?: AssistantItem, includeFollowUps = false) => {
      const msg = {
        id: `assistant-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
        role: "assistant" as const,
        content,
        item,
        suggestions: includeFollowUps ? FOLLOW_UP_RECOMMENDATIONS : undefined,
      };
      setMessages((prev) => [...prev, msg]);
      // persist to local storage handled by useEffect; server persistence exists via /api/ai-assistant/chat
    },
    [],
  );

  const handleSend = useCallback(
    async (rawText: string, displayText?: string, forcedItem?: AssistantItem) => {
      const trimmed = rawText.trim();
      if (!trimmed) return;
      if (isTyping || isSubmittingRef.current) return;

      isSubmittingRef.current = true;
      setIsTyping(true);

      // Add user message immediately
      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
          role: "user",
          content: displayText ?? rawText,
        },
      ]);
      // clear textarea (controlled + ref)
      try {
        if (inputRef.current) inputRef.current.value = "";
      } catch {}
      setInputValue("");

      onLogInteraction?.({
        type: "assistant",
        activity: "سؤال وليّ الأمر",
        result: "info",
        notes: trimmed,
      });

      try {
        await wait(650);

        // Chercher dans la base de données locale
        const matchedItem = forcedItem ?? findAssistantItem(trimmed);
        if (matchedItem) {
          // Persist user message and the local assistant reply on the server
          try {
            const res = await fetch("/api/ai-assistant/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                parentId: PARENT_ID,
                message: trimmed,
                localReply: matchedItem.answer,
                localItemId: matchedItem.id,
                suggestedActions: matchedItem.extra?.suggestions ?? undefined,
              }),
            });

            if (res.ok) {
              const data = await res.json();
              // Use server-returned reply to stay consistent
              addAssistantMessage(data.reply ?? matchedItem.answer, matchedItem, true);
            } else {
              // If server persistence fails, still show local answer but log
              console.warn("Failed to persist local reply", await res.text());
              addAssistantMessage(matchedItem.answer, matchedItem, true);
            }
          } catch (err) {
            console.error("Failed to persist local matchedItem reply:", err);
            addAssistantMessage(matchedItem.answer, matchedItem, true);
          }

          onLogInteraction?.({
            type: "assistant",
            activity: "إجابة من قاعدة البيانات",
            result: "success",
            notes: matchedItem.answer,
          });

          return;
        }

        // Sinon, appeler OpenAI (server endpoint)
        const aiReply = await requestOpenAIResponse(trimmed, childName);
        const fallbackReply =
          aiReply ??
          "أحتاج إلى مزيد من التفاصيل لأقدّم لك خطة دقيقة 🌈. أخبرني ما الحرف أو المهارة التي ترغب في تطويرها لنقترح تمرينًا عمليًا.";
        addAssistantMessage(fallbackReply, undefined, Boolean(aiReply));
        onLogInteraction?.({
          type: "assistant",
          activity: aiReply ? "إجابة الذكاء الاصطناعي" : "تعذّر استدعاء الذكاء الاصطناعي",
          result: aiReply ? "success" : "retry",
          notes: fallbackReply,
        });
      } catch (err) {
        console.error("handleSend failed:", err);
        addAssistantMessage("❌ حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى.");
        onLogInteraction?.({
          type: "assistant",
          activity: "خطأ أثناء الإرسال",
          result: "retry",
          notes: String(err),
        });
      } finally {
        // always reset flags
        setIsTyping(false);
        isSubmittingRef.current = false;
      }
    },
    [addAssistantMessage, childName, onLogInteraction],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleSend(inputValue);
    },
    [handleSend],
  );

  const handleQuickReply = useCallback(
    (reply: AssistantQuickReply) => {
      const item = assistantDataMap[reply.itemId];
      if (!item) {
        return;
      }
      handleSend(item.question ?? reply.label, reply.label, item);
    },
    [handleSend],
  );

  // Group items by section for "show all" view
  const itemsBySection = useMemo(() => {
    const map: Record<string, AssistantItem[]> = {};
    assistantData.forEach((it) => {
      if (!map[it.section]) map[it.section] = [];
      map[it.section].push(it);
    });
    return map;
  }, []);

  const handleFollowUp = useCallback(
    (option: FollowUpOption) => {
      // If option.itemId is present and maps to a known item, send that item.
      // Otherwise, fallback to sending the option label as a plain query.
      const item = option.itemId ? assistantDataMap[option.itemId] : undefined;
      if (item) {
        handleSend(item.question ?? item.title ?? option.label, option.label, item);
        return;
      }

      // Fallback: send the suggestion text as a user query
      handleSend(option.label, option.label);
    },
    [handleSend],
  );

  const clearHistory = useCallback(() => {
    if (confirm("هل تريد حذف جميع المحادثات؟")) {
      setMessages([
        {
          id: "assistant-welcome",
          role: "assistant",
          content: welcomeMessage,
        },
      ]);
      storage.clear(STORAGE_KEY);
    }
  }, [welcomeMessage]);

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-sky-50 via-white to-pink-50">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2" dir="rtl">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sky-700">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-xl">🧠</span>
              <span className="text-lg font-semibold">المساعد الذكي للنطق والكلام</span>
              <Sparkles className="h-5 w-5 text-pink-400" />
            </CardTitle>
            {messages.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="text-xs text-rose-600 hover:text-rose-700"
              >
                مسح الكل
              </Button>
            )}
          </div>
          <p className="text-sm text-slate-600">
            يجيب على أسئلتك حول النطق، التأخر اللغوي، التمارين المنزلية، ونصائح الأولياء مع لمسة من الألوان الباستيلية 🌈.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-3xl border border-sky-100 bg-white/80 p-4 shadow-inner" dir="rtl">
          <div ref={conversationRef} className="max-h-[420px] space-y-4 overflow-y-auto pr-2">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col gap-2">
                {message.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-3xl bg-gradient-to-l from-sky-400 to-sky-500 px-4 py-3 text-sm text-white shadow-lg">
                      <div className="flex items-center justify-end gap-2 text-xs text-sky-100/80">
                        <span>وليّ الأمر</span>
                        <UserRound className="h-4 w-4" />
                      </div>
                      <p className="mt-1 whitespace-pre-wrap leading-6">{message.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-lg">🌟</span>
                    <div className="w-full max-w-[85%] rounded-3xl border border-sky-100 bg-white px-4 py-3 text-sm text-slate-700 shadow">
                      <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-sky-600">
                        <MessageCircle className="h-4 w-4" />
                        المساعد الذكي للنطق والكلام 🧠
                      </div>
                      <p className="whitespace-pre-wrap leading-7 text-slate-800">{message.content}</p>

                      {message.item?.type === "exercise" && message.item.extra && (
                        <div className="mt-3 space-y-3 rounded-2xl bg-sky-50/80 p-3 text-xs text-sky-700">
                          {message.item.extra.goal && (
                            <p className="font-semibold">🎯 الهدف: {message.item.extra.goal}</p>
                          )}
                          {message.item.extra.duration && (
                            <p className="font-medium">⏱️ المدة المقترحة: {message.item.extra.duration}</p>
                          )}
                          {message.item.extra.steps && (
                            <ul className="list-decimal space-y-1 pr-5">
                              {message.item.extra.steps.map((step, index) => (
                                <li key={`${message.id}-step-${index}`}>{step}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}

                      {message.item?.extra?.suggestions && message.item.extra.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2 rounded-2xl bg-emerald-50/80 p-3 text-xs text-emerald-700">
                          <p className="font-semibold">💡 أفكار إضافية:</p>
                          <ul className="list-disc space-y-1 pr-5">
                            {message.item.extra.suggestions.map((suggestion, index) => (
                              <li key={`${message.id}-suggestion-${index}`}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {message.suggestions && (
                        <div className="mt-3 space-y-2 rounded-2xl bg-pink-50/70 p-3">
                          <p className="text-xs font-semibold text-pink-600">هل ترغب في تمرين آخر مشابه؟ 👇</p>
                          <div className="flex flex-wrap gap-2">
                            {message.suggestions.map((option) => (
                              <Button
                                key={option.id}
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() => handleFollowUp(option)}
                                disabled={isTyping}
                                className="rounded-full border-pink-200 bg-white/80 text-pink-600 hover:bg-pink-100"
                              >
                                {option.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-3 text-sm text-sky-600">
                <PartyPopper className="h-4 w-4 animate-bounce" />
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400 delay-150" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400 delay-300" />
                  <span className="pl-2">المساعد يجهز ردًا مفعمًا بالأفكار...</span>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2" dir="rtl">
          {QUICK_REPLIES.map((reply) => (
            <Button
              key={reply.id}
              type="button"
              variant="outline"
              onClick={() => handleQuickReply(reply)}
              disabled={isTyping}
              className="rounded-full border-sky-200 bg-white/90 text-sky-700 transition hover:-translate-y-0.5 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {reply.label}
            </Button>
          ))}
        </div>

        {/* Show all items (tips/exercises/faqs) */}
        <div className="mt-2" dir="rtl">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowAllItems((v) => !v)}
            className="text-xs"
          >
            {showAllItems ? "إخفاء جميع النصائح والتمارين" : "عرض جميع النصائح والتمارين"}
          </Button>

          {showAllItems && (
            <div className="mt-3 grid gap-3 rounded-lg border border-slate-100 bg-white p-3">
              {Object.keys(itemsBySection).map((section) => (
                <div key={section} className="space-y-2">
                  <div className="text-sm font-semibold text-sky-700">{section}</div>
                  <div className="flex flex-wrap gap-2">
                    {itemsBySection[section].map((it) => (
                      <Button
                        key={it.id}
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleSend(it.question ?? it.title ?? it.answer, it.title ?? it.question, it)}
                        className="rounded-full bg-white/90 text-sky-700"
                        disabled={isTyping}
                      >
                        {it.title ?? it.question ?? it.id}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-3" dir="rtl">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <textarea
              placeholder="اكتب سؤالك هنا..."
              value={inputValue}
              onChange={(e) => setInputValue(e.currentTarget.value)}
              ref={inputRef}
              dir="rtl"
              aria-label="حقل سؤال المساعد الذكي"
              title="اكتب سؤالك هنا ثم اضغط إرسال"
              tabIndex={0}
              onMouseDown={() => inputRef.current?.focus()}
              onFocus={() => inputRef.current?.classList.add("ring-2", "ring-sky-300")}
              onBlur={() => inputRef.current?.classList.remove("ring-2", "ring-sky-300")}
              onCompositionStart={() => (isComposingRef.current = true)}
              onCompositionEnd={() => (isComposingRef.current = false)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey && !isComposingRef.current) {
                  event.preventDefault();
                  handleSend(inputValue);
                }
              }}
              onInput={() => {
                try {
                  const el = inputRef.current;
                  if (!el) return;
                  el.style.height = "auto";
                  el.style.height = Math.min(window.innerHeight * 0.5, el.scrollHeight + 6) + "px";
                } catch {}
              }}
              inputMode="text"
              spellCheck={true}
              readOnly={false}
              disabled={isTyping}
              className="flex-1 w-full min-h-[120px] max-h-[50vh] rounded-2xl border border-sky-200 bg-white/90 px-4 py-3 text-sm shadow-sm focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />

            <div className="flex flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
              <Button
                type="submit"
                className="rounded-full bg-sky-500 px-6 py-3 text-white shadow hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
                disabled={isTyping || !inputValue.trim()}
              >
                {isTyping ? "جاري الإرسال..." : "إرسال السؤال"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setInputValue("");
                  inputRef.current && (inputRef.current.value = "");
                }}
                disabled={isTyping}
              >
                مسح الحقل
              </Button>
            </div>
          </div>
          <div className="text-xs text-slate-400">اضغط Enter لإرسال، أو استخدم Shift+Enter لسطر جديد.</div>
        </form>
      </CardContent>
    </Card>
  );
}
         
