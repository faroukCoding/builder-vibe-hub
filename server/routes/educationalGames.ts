import { RequestHandler } from "express";

// Mock data for educational games with detailed content
const educationalGames = [
  {
    id: 'game1',
    name: 'لعبة مطابقة الصوت بالصورة',
    description: 'استمع إلى الكلمة واختر الصورة التي تطابقها لتقوية الفهم السمعي.',
    ageGroup: '3-5 سنوات',
    content: {
      type: 'matching',
      instructions: 'استمع جيداً للصوت ثم اضغط على الكلمة الصحيحة.',
      items: [
        { sound: 'path/to/cat_sound.mp3', image: 'path/to/cat_image.jpg', answer: 'قطة', options: ['كلب', 'قطة', 'عصفور'] },
        { sound: 'path/to/dog_sound.mp3', image: 'path/to/dog_image.jpg', answer: 'كلب', options: ['كلب', 'حصان', 'سمكة'] },
        { sound: 'path/to/bird_sound.mp3', image: 'path/to/bird_image.jpg', answer: 'عصفور', options: ['أسد', 'فيل', 'عصفور'] },
      ]
    }
  },
  {
    id: 'game2',
    name: 'لعبة تركيب الحروف',
    description: 'اسمع الكلمة وحاول تجميع حروفها بالترتيب الصحيح.',
    ageGroup: '5-7 سنوات',
    content: {
        type: 'spelling',
        instructions: 'استمع للكلمة ثم رتب الحروف لتكوينها.',
        words: [
            { sound: 'path/to/sun_sound.mp3', word: 'شمس', letters: ['ش', 'م', 'س'] },
            { sound: 'path/to/moon_sound.mp3', word: 'قمر', letters: ['ق', 'م', 'ر'] },
        ]
    }
  },
  {
    id: 'game3',
    name: 'تحدي النطق السريع',
    description: 'انطق الكلمات التي تظهر على الشاشة قبل انتهاء الوقت!',
    ageGroup: '6-8 سنوات',
    content: {
        type: 'pronunciation_challenge',
        instructions: 'حاول نطق الكلمة الظاهرة بوضوح وسرعة.',
        words: ['سيارة', 'مدرسة', 'مستشفى', 'برتقال']
    }
  },
  {
    id: 'game4',
    name: 'التحدي الأسبوعي: بطل النطق',
    description: 'اختبر نطقك في 5 كلمات جديدة كل أسبوع واحصل على شارة الأبطال.',
    ageGroup: '7-9 سنوات',
    content: {
        type: 'weekly_challenge',
        instructions: 'أنت بطل هذا الأسبوع! حاول نطق هذه الكلمات الصعبة.',
        words: ['قسطنطينية', 'مستشفياتنا', 'البرغماتية']
    }
  }
];

// Request handler to get all educational games
export const getEducationalGames: RequestHandler = (req, res) => {
  // Return only the list of games, without the detailed content
  const gamesList = educationalGames.map(({ content, ...gameDetails }) => gameDetails);
  res.status(200).json(gamesList);
};

// Request handler to get details for a specific game
export const getGameDetails: RequestHandler = (req, res) => {
  const { id } = req.params;
  const game = educationalGames.find(g => g.id === id);
  if (game) {
    res.status(200).json(game);
  } else {
    res.status(404).json({ message: 'اللعبة غير موجودة.' });
  }
};
