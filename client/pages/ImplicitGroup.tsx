import {
  ArrowLeft,
  Volume2,
  RotateCcw,
  CheckCircle,
  XCircle,
  Home,
  Play,
  Shuffle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ImplicitGroup() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [gameProgress, setGameProgress] = useState<{[key: string]: number}>({});

  const speakArabic = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const categories = [
    {
      id: 'fruits',
      title: 'الفواكه',
      icon: '🍎',
      color: 'bg-red-500',
      description: 'تعرف على أنواع الفواكه المختلفة',
      items: [
        { name: 'تفاح', emoji: '🍎' },
        { name: 'موز', emoji: '🍌' },
        { name: 'برتقال', emoji: '🍊' },
        { name: 'عنب', emoji: '🍇' },
        { name: 'فراولة', emoji: '🍓' },
        { name: 'كرز', emoji: '🍒' },
        { name: 'أناناس', emoji: '🍍' },
        { name: 'خوخ', emoji: '🍑' },
      ]
    },
    {
      id: 'vegetables',
      title: 'الخضر',
      icon: '🥕',
      color: 'bg-green-500',
      description: 'تعرف على أنواع الخضروات المختلفة',
      items: [
        { name: 'جزر', emoji: '🥕' },
        { name: 'طماطم', emoji: '🍅' },
        { name: 'خيار', emoji: '🥒' },
        { name: 'فلفل', emoji: '🫑' },
        { name: 'باذنجان', emoji: '🍆' },
        { name: 'ذرة', emoji: '🌽' },
        { name: 'بطاطس', emoji: '🥔' },
        { name: 'بصل', emoji: '🧅' },
      ]
    },
    {
      id: 'vehicles',
      title: 'المواصلات',
      icon: '🚗',
      color: 'bg-blue-500',
      description: 'تعرف على وسائل النقل المختلفة',
      items: [
        { name: 'سيارة', emoji: '🚗' },
        { name: 'حافلة', emoji: '🚌' },
        { name: 'طائرة', emoji: '✈️' },
        { name: 'قطار', emoji: '🚂' },
        { name: 'دراجة', emoji: '🚲' },
        { name: 'سفينة', emoji: '🚢' },
        { name: 'دراجة نارية', emoji: '🏍️' },
        { name: 'شاحنة', emoji: '🚚' },
      ]
    },
    {
      id: 'birds',
      title: 'الطيور',
      icon: '🐦',
      color: 'bg-yellow-500',
      description: 'تعرف على أنواع الطيور المختلفة',
      items: [
        { name: 'عصفور', emoji: '🐦' },
        { name: 'نسر', emoji: '🦅' },
        { name: 'بطة', emoji: '🦆' },
        { name: 'ديك', emoji: '🐓' },
        { name: 'بومة', emoji: '🦉' },
        { name: 'حمامة', emoji: '🕊️' },
        { name: 'طاووس', emoji: '🦚' },
        { name: 'بطريق', emoji: '🐧' },
      ]
    },
    {
      id: 'clothes',
      title: 'الملابس',
      icon: '👕',
      color: 'bg-purple-500',
      description: 'تعرف على أنواع الملابس المختلفة',
      items: [
        { name: 'قميص', emoji: '👕' },
        { name: 'فستان', emoji: '👗' },
        { name: 'بنطلون', emoji: '👖' },
        { name: 'حذاء', emoji: '👟' },
        { name: 'قبعة', emoji: '👒' },
        { name: 'جوارب', emoji: '🧦' },
        { name: 'معطف', emoji: '🧥' },
        { name: 'نظارات', emoji: '👓' },
      ]
    },
    {
      id: 'seasons',
      title: 'الفصول',
      icon: '🌸',
      color: 'bg-pink-500',
      description: 'تعرف على فصول السنة الأربعة',
      items: [
        { name: 'ربيع', emoji: '🌸' },
        { name: 'صيف', emoji: '☀️' },
        { name: 'خريف', emoji: '🍂' },
        { name: 'شتاء', emoji: '❄️' },
      ]
    },
    {
      id: 'professions',
      title: 'المهن',
      icon: '👨‍⚕️',
      color: 'bg-indigo-500',
      description: 'تعرف على المهن المختلفة',
      items: [
        { name: 'طبيب', emoji: '👨‍⚕️' },
        { name: 'معلم', emoji: '👨‍🏫' },
        { name: 'مطافئ', emoji: '👨‍🚒' },
        { name: 'شرطي', emoji: '👮‍♂️' },
        { name: 'طباخ', emoji: '👨‍🍳' },
        { name: 'مزارع', emoji: '👨‍🌾' },
        { name: 'بناء', emoji: '👷‍♂️' },
        { name: 'طيار', emoji: '👨‍✈️' },
      ]
    },
    {
      id: 'shapes',
      title: 'الأشكال',
      icon: '🔺',
      color: 'bg-teal-500',
      description: 'تعرف على الأشكال الهندسية',
      items: [
        { name: 'دائرة', shape: 'circle' },
        { name: 'مربع', shape: 'square' },
        { name: 'مثلث', shape: 'triangle' },
        { name: 'مستطيل', shape: 'rectangle' },
        { name: 'نجمة', shape: 'star' },
        { name: 'قلب', shape: 'heart' },
      ]
    },
  ];

  // Generic Game Component
  const CategoryGame = ({ category, onComplete }: { category: any, onComplete: () => void }) => {
    const [gameMode, setGameMode] = useState<'learn' | 'test'>('learn');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([]);
    const [wrongAnswers, setWrongAnswers] = useState<boolean[]>([]);

    const questions = category.items.map((item: any, index: number) => {
      // Create 4 options: correct answer + 3 random from same category
      const others = category.items.filter((_: any, i: number) => i !== index);
      const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [...shuffled, item].sort(() => Math.random() - 0.5);
      
      return {
        text: `اختر ${item.name}`,
        correct: item,
        options: options
      };
    });

    const handleAnswer = (selectedItem: any) => {
      const isCorrect = selectedItem.name === questions[currentQuestion].correct.name;
      
      const newCorrect = [...correctAnswers];
      const newWrong = [...wrongAnswers];
      
      if (isCorrect) {
        setScore(score + 1);
        newCorrect[currentQuestion] = true;
        speakArabic('ممتاز! إجابة صحيحة');
      } else {
        newWrong[currentQuestion] = true;
        speakArabic('حاول مرة أخرى');
      }
      
      setCorrectAnswers(newCorrect);
      setWrongAnswers(newWrong);

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setShowResult(true);
        }
      }, 1500);
    };

    const renderShape = (shapeType: string) => {
      const commonClasses = "w-16 h-16 mx-auto mb-2";
      switch (shapeType) {
        case 'circle':
          return <div className={`${commonClasses} bg-blue-500 rounded-full`} />;
        case 'square':
          return <div className={`${commonClasses} bg-red-500`} />;
        case 'triangle':
          return <div className={`${commonClasses} bg-green-500`} style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />;
        case 'rectangle':
          return <div className={`w-20 h-12 mx-auto mb-2 bg-yellow-500`} />;
        case 'star':
          return <div className="text-4xl mb-2">⭐</div>;
        case 'heart':
          return <div className="text-4xl mb-2">❤️</div>;
        default:
          return <div className={`${commonClasses} bg-gray-500`} />;
      }
    };

    if (gameMode === 'learn') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">تعلم {category.title}</h3>
            <Button onClick={() => speakArabic(`تعلم ${category.title}`)}>
              <Volume2 className="w-4 h-4 ml-2" />
              استمع
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.items.map((item: any, index: number) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => speakArabic(item.name)}
              >
                <CardContent className="p-6 text-center">
                  {item.emoji && <div className="text-4xl mb-2">{item.emoji}</div>}
                  {item.shape && renderShape(item.shape)}
                  <p className="font-semibold text-lg">{item.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button onClick={() => setGameMode('test')} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 ml-2" />
              لعبة التمييز
            </Button>
          </div>
        </div>
      );
    }

    if (showResult) {
      return (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold">انتهيت من الاختبار!</h3>
          <p className="text-lg">النتيجة: {score} من {questions.length}</p>
          
          {/* Results Summary */}
          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-semibold">الإجابات الصحيحة</p>
                <p className="text-2xl font-bold text-green-600">{score}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 text-center">
                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-red-800 font-semibold">الإجابات الخاطئة</p>
                <p className="text-2xl font-bold text-red-600">{questions.length - score}</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={() => {
              setCurrentQuestion(0);
              setScore(0);
              setShowResult(false);
              setCorrectAnswers([]);
              setWrongAnswers([]);
              setGameMode('learn');
            }}>
              <RotateCcw className="w-4 h-4 ml-2" />
              إعادة اللعب
            </Button>
            <Button onClick={onComplete} variant="outline">
              العودة
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">السؤال {currentQuestion + 1} من {questions.length}</h3>
          <p className="text-lg mb-4">{questions[currentQuestion].text}</p>
          <Button onClick={() => speakArabic(questions[currentQuestion].text)}>
            <Volume2 className="w-4 h-4 ml-2" />
            استمع للسؤال
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {questions[currentQuestion].options.map((item: any, index: number) => (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleAnswer(item)}
            >
              <CardContent className="p-6 text-center">
                {item.emoji && <div className="text-4xl mb-2">{item.emoji}</div>}
                {item.shape && renderShape(item.shape)}
                <p className="font-semibold text-lg">{item.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Progress value={(currentQuestion / questions.length) * 100} className="w-full" />
      </div>
    );
  };

  if (activeCategory) {
    const category = categories.find(c => c.id === activeCategory);
    if (!category) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveCategory(null)}
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة
              </Button>
              <h1 className="text-2xl font-bold">{category.title}</h1>
            </div>
            
            <CategoryGame 
              category={category} 
              onComplete={() => setActiveCategory(null)} 
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  المجموعة الضمنية
                </h1>
                <p className="text-gray-600 text-sm">
                  تصنيف وتجميع العناصر حسب الفئات المختلفة
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
              >
                <Home className="w-4 h-4 ml-2" />
                الرئيسية
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-gray-300 group"
              onClick={() => setActiveCategory(category.id)}
            >
              <CardHeader className="text-center">
                <div className={`${category.color} text-white p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
                <CardDescription className="text-sm">
                  {category.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>عدد العناصر</span>
                    <span>{category.items.length}</span>
                  </div>
                  <Progress value={gameProgress[category.id] || 0} className="w-full h-2" />
                  <Button className="w-full" size="sm">
                    <Play className="w-3 h-3 ml-2" />
                    ابدأ
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card className="mt-8 border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Shuffle className="w-5 h-5" />
              كما موضح في تطبيق كلماتي - ولا تنسى الصوت
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-blue-700">
              <div>
                <h4 className="font-semibold mb-2">مرحلة التعلم:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• اضغط على أي عنصر لسماع اسمه</li>
                  <li>• تعلم جميع عناصر الفئة</li>
                  <li>• استخدم الصوت للتعزيز</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">لعبة التمييز:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• استمع للسؤال</li>
                  <li>• اختر العنصر الصحيح</li>
                  <li>• في الأخير ظهور الإجابات الصحيحة والخاطئة</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
