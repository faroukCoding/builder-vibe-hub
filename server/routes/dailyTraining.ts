import { RequestHandler } from "express";

// Mock data simulating database records for daily training exercises
const dailyExercises = [
  {
    id: 'ex1',
    name: 'نطق حرف الراء',
    difficulty: 'سهل',
    progress: 75,
    details: {
      description: 'تدريب على نطق حرف الراء بشكل صحيح في بداية الكلمة، وسطها، ونهايتها.',
      media: {
        type: 'audio',
        url: 'path/to/audio/r-pronunciation.mp3', // Simulated path
      },
      aiAnalysis: 'أداء ممتاز! هناك تحسن ملحوظ في نطق حرف الراء. نسبة الدقة 85%.',
      nextRecommendation: 'تمرين نطق كلمات تبدأ بحرف الراء مثل "رمل" و "رمان".'
    }
  },
  {
    id: 'ex2',
    name: 'تمييز بين السين والشين',
    difficulty: 'متوسط',
    progress: 40,
    details: {
      description: 'يستمع الطفل إلى كلمات ويحدد إذا كانت تحتوي على حرف السين أم الشين.',
      media: {
        type: 'video',
        url: 'path/to/video/s-sh-distinction.mp4', // Simulated path
      },
aiAnalysis: 'يحتاج الطفل إلى تركيز أكبر للتمييز بين الصوتين. نسبة الدقة 55%.',
      nextRecommendation: 'لعبة مطابقة الصوت بالصورة للتركيز على حرفي السين والشين.'
    }
  },
  {
    id: 'ex3',
    name: 'نطق كلمة "شمس"',
    difficulty: 'سهل',
    progress: 95,
    details: {
      description: 'تدريب على نطق كلمة "شمس" بشكل واضح وصحيح.',
      media: {
        type: 'audio',
        url: 'path/to/audio/shams-pronunciation.mp3', // Simulated path
      },
      aiAnalysis: 'نطق مثالي! تم تحقيق الهدف بنجاح.',
      nextRecommendation: 'تمرين نطق جملة قصيرة تحتوي على كلمة "شمس".'
    }
  },
    {
    id: 'ex4',
    name: 'قراءة جملة "أنا أحب المدرسة"',
    difficulty: 'صعب',
    progress: 20,
    details: {
      description: 'تدريب على قراءة جملة كاملة مع الحفاظ على وضوح النطق وسلاسة الكلام.',
      media: {
        type: 'video',
        url: 'path/to/video/sentence-reading.mp4', // Simulated path
      },
      aiAnalysis: 'هناك صعوبة في نطق بعض الكلمات. تحتاج إلى المزيد من التدريب.',
      nextRecommendation: 'تقسيم الجملة إلى كلمات قصيرة وتكرارها بشكل منفصل.'
    }
  }
];

// Request handler to get all daily training exercises
export const getDailyTraining: RequestHandler = (req, res) => {
  res.status(200).json(dailyExercises);
};

// Request handler to get details for a specific exercise
export const getTrainingDetails: RequestHandler = (req, res) => {
  const { id } = req.params;
  const exercise = dailyExercises.find(ex => ex.id === id);
  if (exercise) {
    res.status(200).json(exercise.details);
  } else {
    res.status(404).json({ message: 'التمرين غير موجود.' });
  }
};
