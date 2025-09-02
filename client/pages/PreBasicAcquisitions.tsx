import {
  ArrowLeft,
  Volume2,
  RotateCcw,
  CheckCircle,
  XCircle,
  Home,
  Play,
  Palette,
  Hash,
  User,
  ArrowUpDown,
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

export default function PreBasicAcquisitions() {
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
      id: 'colors',
      title: 'الألوان',
      icon: <Palette className="w-8 h-8" />,
      color: 'bg-red-500',
      description: 'التعرف على الألوان الأساسية',
      items: [
        { name: 'أحمر', color: '#EF4444' },
        { name: 'أزرق', color: '#3B82F6' },
        { name: 'أخضر', color: '#10B981' },
        { name: 'أصفر', color: '#F59E0B' },
        { name: 'بنفسجي', color: '#8B5CF6' },
        { name: 'برتقالي', color: '#F97316' },
        { name: 'وردي', color: '#EC4899' },
        { name: 'بني', color: '#A3A3A3' },
      ]
    },
    {
      id: 'numbers',
      title: 'الأرقام',
      icon: <Hash className="w-8 h-8" />,
      color: 'bg-blue-500',
      description: 'التعرف على الأرقام من 0 إلى 10',
      items: [
        { name: 'صفر', number: 0 },
        { name: 'واحد', number: 1 },
        { name: 'اثنان', number: 2 },
        { name: 'ثلاثة', number: 3 },
        { name: 'أربعة', number: 4 },
        { name: 'خمسة', number: 5 },
        { name: 'ستة', number: 6 },
        { name: 'سبعة', number: 7 },
        { name: 'ثمانية', number: 8 },
        { name: 'تسعة', number: 9 },
        { name: 'عشرة', number: 10 },
      ]
    },
    {
      id: 'body-parts',
      title: 'أعضاء الجسم',
      icon: <User className="w-8 h-8" />,
      color: 'bg-green-500',
      description: 'التعرف على أجزاء الجسم الأساسية',
      items: [
        { name: 'رأس', emoji: '👤' },
        { name: 'عين', emoji: '👁️' },
        { name: 'أنف', emoji: '👃' },
        { name: 'فم', emoji: '👄' },
        { name: 'أذن', emoji: '👂' },
        { name: 'يد', emoji: '✋' },
        { name: 'قدم', emoji: '🦶' },
        { name: 'بطن', emoji: '🤰' },
      ]
    },
    {
      id: 'laterality',
      title: 'الجانبية',
      icon: <ArrowUpDown className="w-8 h-8" />,
      color: 'bg-purple-500',
      description: 'فهم الاتجاهات والمواضع',
      items: [
        { name: 'يمين', direction: 'right' },
        { name: 'يسار', direction: 'left' },
        { name: 'فوق', direction: 'up' },
        { name: 'تحت', direction: 'down' },
        { name: 'داخل', direction: 'inside' },
        { name: 'خارج', direction: 'outside' },
      ]
    },
  ];

  // Color Game Component
  const ColorGame = ({ category, onComplete }: { category: any, onComplete: () => void }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [gameMode, setGameMode] = useState<'learn' | 'test'>('learn');

    const questions = category.items.map((item: any, index: number) => ({
      text: `اختر اللون ${item.name}`,
      correct: index,
      options: category.items.slice(0, 4) // Show 4 colors each time
    }));

    const handleAnswer = (selectedIndex: number) => {
      const isCorrect = selectedIndex === questions[currentQuestion].correct % 4;
      
      if (isCorrect) {
        setScore(score + 1);
        speakArabic('ممتاز! إجابة صحيحة');
      } else {
        speakArabic('حاول مرة أخرى');
      }

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setShowResult(true);
        }
      }, 1500);
    };

    if (gameMode === 'learn') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">تعلم الألوان</h3>
            <Button onClick={() => speakArabic('اختر اللون')}>
              <Volume2 className="w-4 h-4 ml-2" />
              اختر اللون
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {category.items.map((item: any, index: number) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => speakArabic(item.name)}
              >
                <CardContent className="p-6 text-center">
                  <div 
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-gray-200"
                    style={{ backgroundColor: item.color }}
                  />
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
          <div className="flex gap-4 justify-center">
            <Button onClick={() => {
              setCurrentQuestion(0);
              setScore(0);
              setShowResult(false);
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

        <div className="grid grid-cols-2 gap-4">
          {questions[currentQuestion].options.map((item: any, index: number) => (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleAnswer(index)}
            >
              <CardContent className="p-6 text-center">
                <div 
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-gray-200"
                  style={{ backgroundColor: item.color }}
                />
                <p className="font-semibold text-lg">{item.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Progress value={(currentQuestion / questions.length) * 100} className="w-full" />
      </div>
    );
  };

  // Numbers Game Component
  const NumbersGame = ({ category, onComplete }: { category: any, onComplete: () => void }) => {
    const [gameMode, setGameMode] = useState<'learn' | 'test'>('learn');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const questions = category.items.map((item: any) => {
      const options = new Set<number>();
      options.add(item.number);
      while (options.size < 4) {
        const rand = Math.floor(Math.random() * 11);
        options.add(rand);
      }
      const optionsArr = Array.from(options).sort(() => Math.random() - 0.5);
      return {
        text: `اختر الرقم ${item.name}`,
        correct: item.number,
        options: optionsArr
      };
    });

    const handleAnswer = (selected: number) => {
      const current = questions[currentQuestion];
      const isCorrect = selected === current.correct;
      if (isCorrect) {
        setScore(prev => prev + 1);
        speakArabic('ممتاز! إجابة صحيحة');
      } else {
        speakArabic('حاول مرة أخرى');
      }
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
        } else {
          setShowResult(true);
        }
      }, 1200);
    };

    if (gameMode === 'learn') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">تعلم الأرقام</h3>
            <Button onClick={() => speakArabic('تعلم أسماء الأرقام') }>
              <Volume2 className="w-4 h-4 ml-2" />
              الاستماع
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {category.items.map((item: any, index: number) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => speakArabic(item.name)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {item.number}
                  </div>
                  <p className="font-semibold">{item.name}</p>
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
          <div className="flex gap-4 justify-center">
            <Button onClick={() => { setCurrentQuestion(0); setScore(0); setShowResult(false); setGameMode('learn'); }}>
              <RotateCcw className="w-4 h-4 ml-2" />
              إعادة اللعب
            </Button>
            <Button onClick={onComplete} variant="outline">العودة</Button>
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
        <div className="grid grid-cols-2 gap-4">
          {questions[currentQuestion].options.map((opt: number, idx: number) => (
            <Card key={idx} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleAnswer(opt)}>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-blue-600">{opt}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Progress value={(currentQuestion / questions.length) * 100} className="w-full" />
      </div>
    );
  };

  // Body Parts Game Component
  const BodyPartsGame = ({ category, onComplete }: { category: any, onComplete: () => void }) => {
    const [gameMode, setGameMode] = useState<'learn' | 'test'>('learn');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const questions = category.items.map((item: any) => {
      const shuffled = [...category.items].sort(() => Math.random() - 0.5).slice(0, 4);
      if (!shuffled.find((it) => it.name === item.name)) {
        shuffled[0] = item;
      }
      const options = shuffled.sort(() => Math.random() - 0.5);
      return { text: `اختر صورة ${item.name}`, correct: item.name, options };
    });

    const handleAnswer = (selectedName: string) => {
      const isCorrect = selectedName === questions[currentQuestion].correct;
      if (isCorrect) {
        setScore((s) => s + 1);
        speakArabic('ممتاز! إجابة صحيحة');
      } else {
        speakArabic('حاول مرة أخرى');
      }
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) setCurrentQuestion((q) => q + 1);
        else setShowResult(true);
      }, 1200);
    };

    if (gameMode === 'learn') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">أعضاء الجسم</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {category.items.map((item: any, index: number) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => speakArabic(item.name)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">{item.emoji}</div>
                  <p className="font-semibold">{item.name}</p>
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
          <div className="flex gap-4 justify-center">
            <Button onClick={() => { setCurrentQuestion(0); setScore(0); setShowResult(false); setGameMode('learn'); }}>
              <RotateCcw className="w-4 h-4 ml-2" />
              إعادة اللعب
            </Button>
            <Button onClick={onComplete} variant="outline">العودة</Button>
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
        <div className="grid grid-cols-2 gap-4">
          {questions[currentQuestion].options.map((opt: any, idx: number) => (
            <Card key={idx} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleAnswer(opt.name)}>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">{opt.emoji}</div>
                <p className="font-semibold">{opt.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Progress value={(currentQuestion / questions.length) * 100} className="w-full" />
      </div>
    );
  };

  // Laterality Game Component
  const LateralityGame = ({ category, onComplete }: { category: any, onComplete: () => void }) => {
    const [currentInstruction, setCurrentInstruction] = useState(0);
    const [ballPosition, setBallPosition] = useState({ x: 20, y: 20 });
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const instructions = [
      { text: 'ضع الكرة داخل الصندوق', target: 'inside' },
      { text: 'ضع الكرة فوق الصن��وق', target: 'above' },
      { text: 'ضع الكرة تحت الصندوق', target: 'below' },
      { text: 'ضع الكرة يمين الصندوق', target: 'right' },
      { text: 'ضع الكرة يسار الصندوق', target: 'left' },
      { text: 'ضع الكرة خارج الصندوق', target: 'outside' },
    ];

    const checkRelation = () => {
      // Box bounds in percent: center at 50,50 size ~= 20% x 20%
      const left = 40, right = 60, top = 40, bottom = 60;
      const x = ballPosition.x, y = ballPosition.y;
      let relation: 'inside' | 'above' | 'below' | 'left' | 'right' | 'outside' = 'outside';

      if (x >= left && x <= right && y >= top && y <= bottom) relation = 'inside';
      else if (x >= left && x <= right && y < top) relation = 'above';
      else if (x >= left && x <= right && y > bottom) relation = 'below';
      else if (y >= top && y <= bottom && x < left) relation = 'left';
      else if (y >= top && y <= bottom && x > right) relation = 'right';
      else relation = 'outside';

      const target = instructions[currentInstruction].target;
      if (relation === target) {
        setScore((s) => s + 1);
        speakArabic('أحسنت!');
      } else {
        speakArabic('حاول مرة أخرى');
        return;
      }

      setTimeout(() => {
        if (currentInstruction < instructions.length - 1) {
          setCurrentInstruction((i) => i + 1);
          setBallPosition({ x: 20, y: 20 });
        } else {
          setShowResult(true);
        }
      }, 800);
    };

    if (showResult) {
      return (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">⚽</div>
          <h3 className="text-2xl font-bold">أكملت تمارين الجانبية</h3>
          <p className="text-lg">النتيجة: {score} من {instructions.length}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => { setScore(0); setCurrentInstruction(0); setBallPosition({x:20,y:20}); setShowResult(false); }}>
              <RotateCcw className="w-4 h-4 ml-2" />
              إعادة اللعب
            </Button>
            <Button onClick={onComplete} variant="outline">العودة</Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">الجانبية</h3>
          <p className="text-lg mb-2">{instructions[currentInstruction]?.text}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => speakArabic(instructions[currentInstruction]?.text)}>
              <Volume2 className="w-4 h-4 ml-2" />
              استمع للتعليمة
            </Button>
            <Button variant="outline" onClick={checkRelation}>تحقق</Button>
          </div>
        </div>

        <div className="relative bg-blue-100 h-96 rounded-lg overflow-hidden">
          {/* Box area (40%-60%) */}
          <div
            className="absolute bg-yellow-500 bg-opacity-70 rounded-lg border-4 border-yellow-600"
            style={{ left: '40%', top: '40%', width: '20%', height: '20%' }}
          />

          {/* Ball */}
          <div
            className="absolute w-8 h-8 bg-red-500 rounded-full cursor-pointer"
            style={{
              left: `${ballPosition.x}%`,
              top: `${ballPosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            draggable
            onDragEnd={(e) => {
              const rect = e.currentTarget.parentElement?.getBoundingClientRect();
              if (rect) {
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setBallPosition({ x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) });
              }
            }}
          />
        </div>

        <div className="text-center">
          <Button onClick={onComplete} variant="outline">
            العودة
          </Button>
        </div>
      </div>
    );
  };

  const renderGame = () => {
    const category = categories.find(c => c.id === activeCategory);
    if (!category) return null;

    const commonProps = {
      category,
      onComplete: () => setActiveCategory(null)
    };

    switch (activeCategory) {
      case 'colors':
        return <ColorGame {...commonProps} />;
      case 'numbers':
        return <NumbersGame {...commonProps} />;
      case 'body-parts':
        return <BodyPartsGame {...commonProps} />;
      case 'laterality':
        return <LateralityGame {...commonProps} />;
      default:
        return null;
    }
  };

  if (activeCategory) {
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
              <h1 className="text-2xl font-bold">
                {categories.find(c => c.id === activeCategory)?.title}
              </h1>
            </div>
            
            {renderGame()}
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
                  المكتسبات القبلية
                </h1>
                <p className="text-gray-600 text-sm">
                  تقييم المفاهيم الأساسية والمهارات القبلية
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
        <div className="grid lg:grid-cols-2 gap-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-gray-300 group"
              onClick={() => setActiveCategory(category.id)}
            >
              <CardHeader className="text-center">
                <div className={`${category.color} text-white p-6 rounded-xl w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <CardTitle className="text-xl">{category.title}</CardTitle>
                <CardDescription className="text-base">
                  {category.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>عدد العناصر</span>
                    <span>{category.items.length}</span>
                  </div>
                  <Progress value={gameProgress[category.id] || 0} className="w-full h-2" />
                  <Button className="w-full" size="lg">
                    <Play className="w-4 h-4 ml-2" />
                    ابدأ التعلم
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
              <Volume2 className="w-5 h-5" />
              تعليمات الاستخدام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-blue-700">
              <div>
                <h4 className="font-semibold mb-2">مرحلة التعلم:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• اضغط على أي عنصر لسماع اسمه</li>
                  <li>• تعلم جميع العناصر قبل الانتقال للاختبار</li>
                  <li>• استخدم زر الصوت للمساعدة</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">مرحلة الاختبار:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• استمع للسؤال بعناية</li>
                  <li>• اختر الإجابة الصحيحة</li>
                  <li>• ستحصل على تقييم فوري</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
