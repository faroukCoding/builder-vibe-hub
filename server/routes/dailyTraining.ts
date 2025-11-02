import { RequestHandler } from "express";

const dailyExercises = [
  {
    id: 1,
    title: 'تمرين نطق حرف الراء',
    description: 'تكرار كلمات تحتوي على حرف الراء لتحسين النطق.',
    progress: 75,
    completed: false,
  },
  {
    id: 2,
    title: 'لعبة تقليد أصوات الحيوانات',
    description: 'لعبة ممتعة لتقوية عضلات النطق.',
    progress: 100,
    completed: true,
  },
  {
    id: 3,
    title: 'تمرين التنفس العميق',
    description: 'تمارين بسيطة لتعليم الطفل كيفية التحكم في التنفس أثناء الكلام.',
    progress: 25,
    completed: false,
  },
];

export const getDailyTraining: RequestHandler = (req, res) => {
  res.status(200).json(dailyExercises);
};
