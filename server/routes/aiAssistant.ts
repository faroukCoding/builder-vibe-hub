import { RequestHandler } from "express";

const responses: { [key: string]: string } = {
  "نطق": "لتمرينات النطق، جرب تمرين المرآة. اجعل طفلك يقلد تعابير وجهك أثناء نطق الأصوات.",
  "مساعدة": "بالتأكيد! يمكنك مساعدة طفلك في المنزل من خلال القراءة اليومية بصوت عالٍ وتشجيعه على تكرار الكلمات.",
  "لعبة": "الألعاب التعليمية طريقة رائعة للتعلم. جرب لعبة مطابقة الصور مع الأصوات لتقوية الذاكرة السمعية.",
  "تقدم": "يمكنك تتبع تقدم طفلك من خلال التقارير المتوفرة في لوحة التحكم. إذا لاحظت أي تراجع، استشر الأخصائي.",
  "صعوبة": "إذا كان طفلك يواجه صعوبة في تمرين معين، حاول تبسيطه أو تقسيمه إلى خطوات أصغر. الصبر هو المفتاح.",
  "أكل": "بعض التمارين لتقوية عضلات الفم يمكن أن تساعد في تحسين المضغ والبلع. استشر الأخصائي للحصول على تمارين مخصصة.",
};

export const handleAIAssistant: RequestHandler = (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const keyword = Object.keys(responses).find(key => message.includes(key));

  const reply = keyword ? responses[keyword] : "شكرًا لسؤالك! لم أتمكن من العثور على إجابة دقيقة. هل يمكنك إعادة صياغة سؤالك؟";

  // Simulate a slight delay to make it feel more real
  setTimeout(() => {
    res.status(200).json({ reply });
  }, 800);
};
