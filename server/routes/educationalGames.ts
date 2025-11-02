import { RequestHandler } from "express";

const games = [
  {
    id: 1,
    title: 'مطابقة الصور والأصوات',
    description: 'لعبة لربط الصور بأصواتها الصحيحة.',
    difficulty: 'سهل',
    icon: '🖼️',
  },
  {
    id: 2,
    title: 'تحدي تكرار الكلمات',
    description: 'لعبة سريعة لتحسين سرعة النطق ودقته.',
    difficulty: 'متوسط',
    icon: '🗣️',
  },
  {
    id: 3,
    title: 'بناء الجمل',
    description: 'لعبة لترتيب الكلمات وتكوين جمل مفيدة.',
    difficulty: 'متقدم',
    icon: '🏗️',
  },
];

export const getEducationalGames: RequestHandler = (req, res) => {
  res.status(200).json(games);
};
