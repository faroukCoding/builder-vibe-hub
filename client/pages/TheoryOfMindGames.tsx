import {
  ArrowLeft,
  Home,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Heart,
  Star,
  Trophy,
  Volume2,
  Eye,
  Brain,
  Users,
  Smile,
  Frown,
  Angry,
  Scared,
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

interface GameResult {
  taskId: string;
  score: number;
  totalQuestions: number;
  attempts: number;
  completed: boolean;
}

interface DetailedAnswer {
  question_id: number;
  task: string;
  question_text: string;
  chosen_answer: string;
  correct_answer: string;
  is_correct: boolean;
  score: number;
  time_spent_ms: number;
  skill_group: string;
}

interface TestSession {
  child_id: string;
  child_name: string;
  child_age: number;
  child_grade: string;
  start_time: string;
  end_time?: string;
  answers: DetailedAnswer[];
  total_score: number;
  max_score: number;
}

interface TaskProps {
  onComplete: (result: GameResult) => void;
  onBack: () => void;
}

export default function TheoryOfMindGames() {
  const navigate = useNavigate();
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [testSession, setTestSession] = useState<TestSession>({
    child_id: "child_001",
    child_name: "أحمد محمد الأمين",
    child_age: 7,
    child_grade: "الصف الثاني الابتدائي",
    start_time: new Date().toISOString(),
    answers: [],
    total_score: 0,
    max_score: 22,
  });
  const [questionCounter, setQuestionCounter] = useState(1);

  const speakArabic = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const tasks = [
    {
      id: "emotions",
      title: "الوجوه الانفعالية",
      description: "تعرف على المشاعر المختلفة",
      icon: "😊",
      difficulty: 1,
      color: "bg-green-500",
    },
    {
      id: "maha-cookie",
      title: "مها والبسكويت",
      description: "فهم الرغبات والم��اعر",
      icon: "🍪",
      difficulty: 1,
      color: "bg-yellow-500",
    },
    {
      id: "amjad-glasses",
      title: "أمجاد والنظارة",
      description: "الذاكرة والتوقعات",
      icon: "👓",
      difficulty: 2,
      color: "bg-blue-500",
    },
    {
      id: "yasmina-saeed",
      title: "ياسمي��ه وسعيد مع التمثال",
      description: "وجهات النظر المختلفة",
      icon: "🗿",
      difficulty: 2,
      color: "bg-purple-500",
    },
    {
      id: "nasser-keys",
      title: "ناصر والمفاتيح",
      description: "المعتقدات الخاطئة",
      icon: "🔑",
      difficulty: 3,
      color: "bg-orange-500",
    },
    {
      id: "faisal-book",
      title: "فيصل والكتاب",
      description: "تغيير المواقع والبحث",
      icon: "📚",
      difficulty: 3,
      color: "bg-red-500",
    },
    {
      id: "khalid-gift",
      title: "خالد وهدية العيد",
      description: "سوء الفهم والتوقعات",
      icon: "🎁",
      difficulty: 4,
      color: "bg-pink-500",
    },
    {
      id: "rami-mariam",
      title: "رامي ومريم مع الصحون",
      description: "تبديل الأماكن والذ��كرة",
      icon: "🍝",
      difficulty: 4,
      color: "bg-teal-500",
    },
    {
      id: "mansour-bike",
      title: "منصور والدراجة",
      description: "الخداع والتوقعات",
      icon: "🚲",
      difficulty: 5,
      color: "bg-indigo-500",
    },
  ];

  const handleTaskComplete = (
    result: GameResult,
    detailedAnswers?: DetailedAnswer[],
  ) => {
    setGameResults((prev) => {
      const updated = prev.filter((r) => r.taskId !== result.taskId);
      return [...updated, result];
    });

    // إضافة الإجابات المفصلة للجلسة
    if (detailedAnswers) {
      setTestSession((prev) => ({
        ...prev,
        answers: [
          ...prev.answers.filter((a) => a.task !== result.taskId),
          ...detailedAnswers,
        ],
        total_score: prev.total_score + result.score,
      }));
    }

    setCurrentTask(null);

    // التحقق من إكمال جميع المهام
    const updatedResults = gameResults.filter(
      (r) => r.taskId !== result.taskId,
    );
    updatedResults.push(result);

    if (
      updatedResults.length === tasks.length &&
      updatedResults.every((r) => r.completed)
    ) {
      // إكمال الاختبار والانتقال لورقة الاستجابة
      finalizeTest(updatedResults);
    }
  };

  const finalizeTest = (finalResults: GameResult[]) => {
    const finalSession: TestSession = {
      ...testSession,
      end_time: new Date().toISOString(),
      total_score: finalResults.reduce((sum, r) => sum + r.score, 0),
    };

    // حفظ النتائج في localStorage
    localStorage.setItem(
      "theory_of_mind_results",
      JSON.stringify(finalSession),
    );

    // الانتقال لورقة ال��ستجابة
    navigate("/diagnostic-response-sheet", {
      state: { sessionData: finalSession },
    });
  };

  useEffect(() => {
    const completedTasks = gameResults.filter((r) => r.completed).length;
    setOverallProgress((completedTasks / tasks.length) * 100);
  }, [gameResults]);

  // المهمة A: الوجوه الانفعالية
  const EmotionsTask: React.FC<TaskProps> = ({ onComplete, onBack }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [detailedAnswers, setDetailedAnswers] = useState<DetailedAnswer[]>(
      [],
    );
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());

    const emotions = [
      { emoji: "😊", name: "سعيد", color: "bg-green-200" },
      { emoji: "😢", name: "حزين", color: "bg-blue-200" },
      { emoji: "😠", name: "غاضب", color: "bg-red-200" },
      { emoji: "😨", name: "خائف", color: "bg-purple-200" },
    ];

    const questions = [
      { text: "ضع إصبعك على الوجه السعيد", answer: "😊" },
      { text: "أين الوجه الحزين؟", answer: "😢" },
      { text: "اختر الوجه الغاضب", answer: "😠" },
      { text: "أين الوجه الخائف؟", answer: "😨" },
    ];

    const handleAnswer = (selectedEmoji: string) => {
      const correct = selectedEmoji === questions[currentQuestion].answer;
      const timeSpent = Date.now() - questionStartTime;

      // حفظ الإجابة المفصلة
      const detailedAnswer: DetailedAnswer = {
        question_id: questionCounter + currentQuestion,
        task: "A",
        question_text: questions[currentQuestion].text,
        chosen_answer: selectedEmoji,
        correct_answer: questions[currentQuestion].answer,
        is_correct: correct,
        score: correct ? 1 : 0,
        time_spent_ms: timeSpent,
        skill_group: "الانفعالات",
      };

      setDetailedAnswers((prev) => [...prev, detailedAnswer]);
      setAttempts((prev) => prev + 1);

      if (correct) {
        setScore((prev) => prev + 1);
        setFeedback("✅ أحسنت!");
        speakArabic("أحسنت! إجابة صحيحة");

        setTimeout(() => {
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
            setQuestionStartTime(Date.now());
            setFeedback(null);
            setTimeout(
              () => speakArabic(questions[currentQuestion + 1].text),
              500,
            );
          } else {
            onComplete(
              {
                taskId: "emotions",
                score: score + 1,
                totalQuestions: questions.length,
                attempts,
                completed: true,
              },
              [...detailedAnswers, detailedAnswer],
            );
          }
        }, 2000);
      } else {
        setFeedback("❌ حاول مرة أخرى");
        speakArabic("حاول مرة أخرى");
        setTimeout(() => setFeedback(null), 2000);
      }
    };

    useEffect(() => {
      speakArabic(questions[currentQuestion].text);
      setQuestionStartTime(Date.now());
    }, [currentQuestion]);

    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة
          </Button>
          <h2 className="text-2xl font-bold text-center">الوجوه الانفعالية</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {currentQuestion + 1}/{questions.length}
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl">
              {questions[currentQuestion].text}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => speakArabic(questions[currentQuestion].text)}
              className="mx-auto"
            >
              <Volume2 className="w-4 h-4 ml-2" />
              إعادة السؤال
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {emotions.map((emotion, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(emotion.emoji)}
                  className={`h-32 text-6xl ${emotion.color} hover:scale-110 transition-transform border-4 border-gray-300 hover:border-blue-500`}
                  variant="outline"
                >
                  {emotion.emoji}
                </Button>
              ))}
            </div>

            {feedback && (
              <div className="text-center mt-6 p-4 rounded-lg bg-gray-100">
                <p className="text-2xl font-bold">{feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  // المهمة B: مها والبسكويت
  const MahaCookieTask: React.FC<TaskProps> = ({ onComplete, onBack }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [detailedAnswers, setDetailedAnswers] = useState<DetailedAnswer[]>(
      [],
    );
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());

    const story = [
      {
        text: "هذه مها. مها تريد بسكويت لذيذ.",
        image: "👧",
        question: null,
      },
      {
        text: "ماذا تريد مها؟",
        image: "👧",
        question: {
          text: "ماذا تريد مها؟",
          options: ["🍪 بسكويت", "🍎 تفاحة", "🧃 عصير"],
          correct: 0,
        },
      },
      {
        text: "مها حصلت على البسكويت!",
        image: "👧🍪",
        question: {
          text: "كيف ستشعر مها؟",
          options: ["😊 سعيدة", "😢 حزينة", "😠 غاضبة"],
          correct: 0,
        },
      },
    ];

    const handleAnswer = (selectedIndex: number) => {
      const correct = selectedIndex === story[currentStep].question?.correct;
      const timeSpent = Date.now() - questionStartTime;
      const questionData = story[currentStep].question;

      if (questionData) {
        // حفظ الإجابة المفصلة
        const detailedAnswer: DetailedAnswer = {
          question_id: questionCounter + 4 + detailedAnswers.length + 1, // 4 من المهمة A
          task: "B",
          question_text: questionData.text,
          chosen_answer: questionData.options[selectedIndex],
          correct_answer: questionData.options[questionData.correct],
          is_correct: correct,
          score: correct ? 1 : 0,
          time_spent_ms: timeSpent,
          skill_group: "الرغبات والمشاعر",
        };

        setDetailedAnswers((prev) => [...prev, detailedAnswer]);
      }

      setAttempts((prev) => prev + 1);

      if (correct) {
        setScore((prev) => prev + 1);
        setFeedback("✅ ممتاز!");
        speakArabic("ممتاز! إجابة صحيحة");

        setTimeout(() => {
          if (currentStep < story.length - 1) {
            setCurrentStep((prev) => prev + 1);
            setQuestionStartTime(Date.now());
            setFeedback(null);
          } else {
            onComplete(
              {
                taskId: "maha-cookie",
                score: score + 1,
                totalQuestions: story.filter((s) => s.question).length,
                attempts,
                completed: true,
              },
              detailedAnswers.concat(
                questionData
                  ? [
                      {
                        question_id:
                          questionCounter + 4 + detailedAnswers.length + 1,
                        task: "B",
                        question_text: questionData.text,
                        chosen_answer: questionData.options[selectedIndex],
                        correct_answer:
                          questionData.options[questionData.correct],
                        is_correct: correct,
                        score: correct ? 1 : 0,
                        time_spent_ms: timeSpent,
                        skill_group: "الرغبات والمشاعر",
                      },
                    ]
                  : [],
              ),
            );
          }
        }, 2000);
      } else {
        setFeedback("❌ حاول مرة أخرى");
        speakArabic("حاول مرة أخرى");
        setTimeout(() => setFeedback(null), 2000);
      }
    };

    useEffect(() => {
      speakArabic(story[currentStep].text);
      if (story[currentStep].question) {
        setQuestionStartTime(Date.now());
      }
    }, [currentStep]);

    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة
          </Button>
          <h2 className="text-2xl font-bold text-center">مها والبسكويت</h2>
          <Badge variant="outline">
            {currentStep + 1}/{story.length}
          </Badge>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="text-8xl mb-4">{story[currentStep].image}</div>
              <p className="text-2xl font-bold text-gray-800">
                {story[currentStep].text}
              </p>

              <Button
                variant="ghost"
                onClick={() => speakArabic(story[currentStep].text)}
              >
                <Volume2 className="w-4 h-4 ml-2" />
                إعادة القصة
              </Button>

              {story[currentStep].question && (
                <div className="space-y-4">
                  <p className="text-xl font-semibold text-blue-600">
                    {story[currentStep].question?.text}
                  </p>
                  <div className="grid gap-4">
                    {story[currentStep].question?.options.map(
                      (option, index) => (
                        <Button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          className="h-16 text-lg bg-yellow-100 hover:bg-yellow-200 text-gray-800 border-2 border-yellow-300"
                          variant="outline"
                        >
                          {option}
                        </Button>
                      ),
                    )}
                  </div>
                </div>
              )}

              {!story[currentStep].question &&
                currentStep < story.length - 1 && (
                  <Button
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    التالي
                  </Button>
                )}

              {feedback && (
                <div className="p-4 rounded-lg bg-gray-100">
                  <p className="text-2xl font-bold">{feedback}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // المهمة C: أمجاد والنظارة
  const AmjadGlassesTask: React.FC<TaskProps> = ({ onComplete, onBack }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);

    const story = [
      {
        text: "أمجاد رأت نظارتها على الطاولة",
        image: "👩👓📱",
        question: null,
      },
      {
        text: "ثم خرجت أمجاد من الغرفة",
        image: "🚪👩",
        question: null,
      },
      {
        text: "والدة أمجاد نقلت النظارة إلى الدرج",
        image: "👩‍🦳📦👓",
        question: null,
      },
      {
        text: "عادت أمجاد وتريد نظارتها",
        image: "👩❓",
        question: {
          text: "أين تظن أمجاد أن نظارتها ستكون؟",
          options: ["📱 على الطاولة", "📦 في الدرج", "🛏️ على السرير"],
          correct: 0,
        },
      },
    ];

    const handleAnswer = (selectedIndex: number) => {
      const correct = selectedIndex === story[currentStep].question?.correct;
      setAttempts((prev) => prev + 1);

      if (correct) {
        setScore((prev) => prev + 1);
        setFeedback("✅ صحيح! أمجاد لا تعلم أن والدتها نقلت النظارة");
        speakArabic("صحيح! أمجاد لا تعلم أن والدتها نقلت النظارة");

        setTimeout(() => {
          onComplete({
            taskId: "amjad-glasses",
            score,
            totalQuestions: 1,
            attempts,
            completed: true,
          });
        }, 3000);
      } else {
        setFeedback("❌ فكر مرة أخرى. أمجاد لم تر والدتها تنقل النظارة");
        speakArabic("فكر مرة أخرى. أمجاد لم تر والدتها تنقل النظارة");
        setTimeout(() => setFeedback(null), 3000);
      }
    };

    useEffect(() => {
      if (story[currentStep].text) {
        speakArabic(story[currentStep].text);
      }
    }, [currentStep]);

    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة
          </Button>
          <h2 className="text-2xl font-bold text-center">أمجاد والنظارة</h2>
          <Badge variant="outline">
            {currentStep + 1}/{story.length}
          </Badge>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">{story[currentStep].image}</div>
              <p className="text-xl font-bold text-gray-800">
                {story[currentStep].text}
              </p>

              <Button
                variant="ghost"
                onClick={() => speakArabic(story[currentStep].text)}
              >
                <Volume2 className="w-4 h-4 ml-2" />
                إعادة القصة
              </Button>

              {story[currentStep].question && (
                <div className="space-y-4">
                  <p className="text-xl font-semibold text-blue-600">
                    {story[currentStep].question?.text}
                  </p>
                  <div className="grid gap-4">
                    {story[currentStep].question?.options.map(
                      (option, index) => (
                        <Button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          className="h-16 text-lg bg-blue-100 hover:bg-blue-200 text-gray-800 border-2 border-blue-300"
                          variant="outline"
                        >
                          {option}
                        </Button>
                      ),
                    )}
                  </div>
                </div>
              )}

              {!story[currentStep].question &&
                currentStep < story.length - 1 && (
                  <Button
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    التالي
                  </Button>
                )}

              {feedback && (
                <div className="p-4 rounded-lg bg-gray-100">
                  <p className="text-lg font-bold">{feedback}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // المهمة D: ياسمينه وسعيد مع التمثال
  const YasminaSaeedTask: React.FC<TaskProps> = ({ onComplete, onBack }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);

    const story = [
      {
        text: "ياسمينه وسعيد ينظران إلى تمثال من جهتين مختلفتين",
        image: "👧🗿👦",
        question: null,
      },
      {
        text: "ياسمينه ترى الجهة الأمامية للتمثال",
        image: "👧➡️🗿",
        question: {
          text: "ماذا ترى ياسمينه؟",
          options: ["😊 وجه التمثال", "🔙 ظهر التمثال", "👂 جانب التمثال"],
          correct: 0,
        },
      },
      {
        text: "سعيد ينظر من الخلف",
        image: "🗿⬅️👦",
        question: {
          text: "ماذا يرى سعيد؟",
          options: ["😊 وجه التمثال", "🔙 ظهر التمثال", "👂 جانب التمثال"],
          correct: 1,
        },
      },
    ];

    const handleAnswer = (selectedIndex: number) => {
      const correct = selectedIndex === story[currentStep].question?.correct;
      setAttempts((prev) => prev + 1);

      if (correct) {
        setScore((prev) => prev + 1);
        setFeedback("✅ ممتاز! كل شخص يرى التمثال من زاوية مختلفة");
        speakArabic("ممتاز! كل شخص يرى التمثال من زاوية مختلفة");

        setTimeout(() => {
          if (currentStep < story.length - 1) {
            setCurrentStep((prev) => prev + 1);
            setFeedback(null);
          } else {
            onComplete({
              taskId: "yasmina-saeed",
              score,
              totalQuestions: story.filter((s) => s.question).length,
              attempts,
              completed: true,
            });
          }
        }, 2000);
      } else {
        setFeedback("❌ فكر في الموقع الذي يقف فيه كل شخص");
        speakArabic("فك�� في الموقع الذي يقف فيه كل شخص");
        setTimeout(() => setFeedback(null), 2000);
      }
    };

    useEffect(() => {
      if (story[currentStep].text) {
        speakArabic(story[currentStep].text);
      }
    }, [currentStep]);

    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة
          </Button>
          <h2 className="text-2xl font-bold text-center">
            ياسمينه وسعيد مع التمثال
          </h2>
          <Badge variant="outline">
            {currentStep + 1}/{story.length}
          </Badge>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">{story[currentStep].image}</div>
              <p className="text-xl font-bold text-gray-800">
                {story[currentStep].text}
              </p>

              <Button
                variant="ghost"
                onClick={() => speakArabic(story[currentStep].text)}
              >
                <Volume2 className="w-4 h-4 ml-2" />
                إعادة القصة
              </Button>

              {story[currentStep].question && (
                <div className="space-y-4">
                  <p className="text-xl font-semibold text-purple-600">
                    {story[currentStep].question?.text}
                  </p>
                  <div className="grid gap-4">
                    {story[currentStep].question?.options.map(
                      (option, index) => (
                        <Button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          className="h-16 text-lg bg-purple-100 hover:bg-purple-200 text-gray-800 border-2 border-purple-300"
                          variant="outline"
                        >
                          {option}
                        </Button>
                      ),
                    )}
                  </div>
                </div>
              )}

              {!story[currentStep].question &&
                currentStep < story.length - 1 && (
                  <Button
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    التالي
                  </Button>
                )}

              {feedback && (
                <div className="p-4 rounded-lg bg-gray-100">
                  <p className="text-lg font-bold">{feedback}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // المهمة E: ناصر والمفاتيح
  const NasserKeysTask: React.FC<TaskProps> = ({ onComplete, onBack }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);

    const story = [
      {
        text: "ناصر يظن أن مفاتيحه في جيبه",
        image: "👨🔑👖",
        question: null,
      },
      {
        text: "لكن المفاتيح في الحقيقة على الطاولة",
        image: "🔑📱",
        question: null,
      },
      {
        text: "ناصر يريد مفاتيحه الآن",
        image: "👨❓🔑",
        question: {
          text: "أين سيبحث ناصر أولاً؟",
          options: ["👖 في جيبه", "📱 على الطاولة", "🚗 في السيارة"],
          correct: 0,
        },
      },
    ];

    const handleAnswer = (selectedIndex: number) => {
      const correct = selectedIndex === story[currentStep].question?.correct;
      setAttempts((prev) => prev + 1);

      if (correct) {
        setScore((prev) => prev + 1);
        setFeedback("✅ صحيح! ناصر سيبحث حيث يظن أنها موجودة");
        speakArabic("صحيح! ناصر سيبحث حيث يظن أنها موجودة");

        setTimeout(() => {
          onComplete({
            taskId: "nasser-keys",
            score,
            totalQuestions: 1,
            attempts,
            completed: true,
          });
        }, 3000);
      } else {
        setFeedback("❌ تذكر أن ناصر لا يعلم أن المفاتيح على الطاولة");
        speakArabic("تذكر أن ناصر لا يعلم أن المفاتيح على الطاولة");
        setTimeout(() => setFeedback(null), 3000);
      }
    };

    useEffect(() => {
      if (story[currentStep].text) {
        speakArabic(story[currentStep].text);
      }
    }, [currentStep]);

    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة
          </Button>
          <h2 className="text-2xl font-bold text-center">ناصر والمفاتيح</h2>
          <Badge variant="outline">
            {currentStep + 1}/{story.length}
          </Badge>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">{story[currentStep].image}</div>
              <p className="text-xl font-bold text-gray-800">
                {story[currentStep].text}
              </p>

              <Button
                variant="ghost"
                onClick={() => speakArabic(story[currentStep].text)}
              >
                <Volume2 className="w-4 h-4 ml-2" />
                إعادة القصة
              </Button>

              {story[currentStep].question && (
                <div className="space-y-4">
                  <p className="text-xl font-semibold text-orange-600">
                    {story[currentStep].question?.text}
                  </p>
                  <div className="grid gap-4">
                    {story[currentStep].question?.options.map(
                      (option, index) => (
                        <Button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          className="h-16 text-lg bg-orange-100 hover:bg-orange-200 text-gray-800 border-2 border-orange-300"
                          variant="outline"
                        >
                          {option}
                        </Button>
                      ),
                    )}
                  </div>
                </div>
              )}

              {!story[currentStep].question &&
                currentStep < story.length - 1 && (
                  <Button
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    التالي
                  </Button>
                )}

              {feedback && (
                <div className="p-4 rounded-lg bg-gray-100">
                  <p className="text-lg font-bold">{feedback}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // قائمة المهام الرئيسية
  const TasksMenu = () => (
    <div className="space-y-6" dir="rtl">
      <div className="text-center space-y-4">
        <div className="text-6xl">🧠🌍</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          ألعاب نظرية العقل
        </h1>
        <p className="text-lg text-gray-600">
          تعلم فهم مشاعر وأفكار الآخرين من خلال قصص تفاعلية ممتعة
        </p>

        {overallProgress > 0 && (
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">التقدم الإجمالي</span>
              <span className="text-sm font-semibold">
                {Math.round(overallProgress)}%
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => {
          const result = gameResults.find((r) => r.taskId === task.id);
          const isCompleted = result?.completed || false;
          const isLocked = false; // جميع الألعاب متاحة الآن

          return (
            <Card
              key={task.id}
              className={`group hover:shadow-xl transition-all duration-300 cursor-pointer ${
                isLocked ? "opacity-50 cursor-not-allowed" : ""
              } ${isCompleted ? "border-green-500 bg-green-50" : ""}`}
              onClick={() => !isLocked && setCurrentTask(task.id)}
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`${task.color} text-white p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}
                >
                  {isLocked ? "🔒" : task.icon}
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{task.description}</p>

                <div className="flex items-center justify-center gap-2 mb-4">
                  {Array.from({ length: task.difficulty }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                  <span className="text-xs text-gray-500">
                    مستوى {task.difficulty}
                  </span>
                </div>

                {isCompleted && result && (
                  <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {result.score}/{result.totalQuestions} صحيح
                    </span>
                  </div>
                )}

                {isLocked && (
                  <p className="text-xs text-gray-500">
                    أكمل المستوى السابق أولاً
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          onClick={() => navigate("/specialist-dashboard")}
          variant="outline"
        >
          <Home className="w-4 h-4 ml-2" />
          العودة للوحة التحكم
        </Button>

        {gameResults.length > 0 && (
          <Button
            onClick={() => {
              const incompleteSession: TestSession = {
                ...testSession,
                end_time: new Date().toISOString(),
                total_score: gameResults.reduce((sum, r) => sum + r.score, 0),
              };
              localStorage.setItem(
                "theory_of_mind_results",
                JSON.stringify(incompleteSession),
              );
              navigate("/diagnostic-response-sheet", {
                state: { sessionData: incompleteSession },
              });
            }}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <FileText className="w-4 h-4 ml-2" />
            عرض النتائج الحالية
          </Button>
        )}
      </div>
    </div>
  );

  // المهمة F: فيصل والكتاب
  const FaisalBookTask: React.FC<TaskProps> = ({ onComplete, onBack }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);

    const story = [
      {
        text: "فيصل وضع كتابه على الطاولة",
        image: "👦📚📱",
        question: {
          text: "أين ��ضع فيصل الكتاب؟",
          options: ["📱 على الطاولة", "📦 في الدرج", "🛏️ على السرير"],
          correct: 0,
        },
      },
      {
        text: "سلمى نقلت الكتاب إلى الدرج",
        image: "👧📚📦",
        question: {
          text: "أين الكتاب الآن؟",
          options: ["📱 على الطاولة", "📦 في الدرج", "🛏️ على السرير"],
          correct: 1,
        },
      },
      {
        text: "فيصل عاد ويريد كتابه",
        image: "👦❓📚",
        question: {
          text: "أين سيبحث فيصل أولاً؟",
          options: ["📱 على الطاولة", "📦 في الدرج", "🛏️ على السرير"],
          correct: 0,
        },
      },
    ];

    const handleAnswer = (selectedIndex: number) => {
      const correct = selectedIndex === story[currentStep].question?.correct;
      setAttempts((prev) => prev + 1);

      if (correct) {
        setScore((prev) => prev + 1);
        setFeedback("✅ صحيح!");
        speakArabic("صحيح! إجابة ممتازة");

        setTimeout(() => {
          if (currentStep < story.length - 1) {
            setCurrentStep((prev) => prev + 1);
            setFeedback(null);
          } else {
            onComplete({
              taskId: "faisal-book",
              score,
              totalQuestions: story.length,
              attempts,
              completed: true,
            });
          }
        }, 2000);
      } else {
        setFeedback("❌ حاول مرة أخرى");
        speakArabic("حاول مرة أخرى");
        setTimeout(() => setFeedback(null), 2000);
      }
    };

    useEffect(() => {
      if (story[currentStep].text) {
        speakArabic(story[currentStep].text);
      }
    }, [currentStep]);

    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة
          </Button>
          <h2 className="text-2xl font-bold text-center">فيصل والكتاب</h2>
          <Badge variant="outline">
            {currentStep + 1}/{story.length}
          </Badge>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">{story[currentStep].image}</div>
              <p className="text-xl font-bold text-gray-800">
                {story[currentStep].text}
              </p>

              <Button
                variant="ghost"
                onClick={() => speakArabic(story[currentStep].text)}
              >
                <Volume2 className="w-4 h-4 ml-2" />
                إعادة القصة
              </Button>

              <div className="space-y-4">
                <p className="text-xl font-semibold text-red-600">
                  {story[currentStep].question?.text}
                </p>
                <div className="grid gap-4">
                  {story[currentStep].question?.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className="h-16 text-lg bg-red-100 hover:bg-red-200 text-gray-800 border-2 border-red-300"
                      variant="outline"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              {feedback && (
                <div className="p-4 rounded-lg bg-gray-100">
                  <p className="text-lg font-bold">{feedback}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // المهمة G: خالد وهدية العيد
  const KhalidGiftTask: React.FC<TaskProps> = ({ onComplete, onBack }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);

    const story = [
      {
        text: "خالد يريد طائرة كهدية عيد",
        image: "👦✈️💭",
        question: {
          text: "ماذا يريد خالد؟",
          options: ["✈️ طائرة", "🚂 قطار", "🚗 سيارة"],
          correct: 0,
        },
      },
      {
        text: "والد خالد يظن أنه يريد قطارًا",
        image: "👨🚂💭",
        question: {
          text: "ماذا يعتقد الأب أن خالد يريد؟",
          options: ["✈️ طائرة", "🚂 قطار", "🚗 سيارة"],
          correct: 1,
        },
      },
      {
        text: "الأب اشترى قطارًا لخالد",
        image: "👨🛍️🚂",
        question: {
          text: "كيف سيشعر خالد عندما يرى القطار؟",
          options: ["😊 سعيد", "😢 حزين", "😐 عادي"],
          correct: 1,
        },
      },
      {
        text: "ماذا يظن ال��ب؟",
        image: "👨❓😊",
        question: {
          text: "ماذا يظن الأب أن خالد سيشعر؟",
          options: ["😊 سعيد", "😢 حزين", "😐 عادي"],
          correct: 0,
        },
      },
    ];

    const handleAnswer = (selectedIndex: number) => {
      const correct = selectedIndex === story[currentStep].question?.correct;
      setAttempts((prev) => prev + 1);

      if (correct) {
        setScore((prev) => prev + 1);
        setFeedback("✅ ممتاز! فهمت الموقف بشكل رائع");
        speakArabic("ممتاز! فهمت الموقف بشكل رائع");

        setTimeout(() => {
          if (currentStep < story.length - 1) {
            setCurrentStep((prev) => prev + 1);
            setFeedback(null);
          } else {
            onComplete({
              taskId: "khalid-gift",
              score,
              totalQuestions: story.length,
              attempts,
              completed: true,
            });
          }
        }, 2000);
      } else {
        setFeedback("❌ فكر في ما يعرفه كل شخص");
        speakArabic("فكر في ما يعرفه كل شخص");
        setTimeout(() => setFeedback(null), 2000);
      }
    };

    useEffect(() => {
      if (story[currentStep].text) {
        speakArabic(story[currentStep].text);
      }
    }, [currentStep]);

    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة
          </Button>
          <h2 className="text-2xl font-bold text-center">خالد وهدية العيد</h2>
          <Badge variant="outline">
            {currentStep + 1}/{story.length}
          </Badge>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">{story[currentStep].image}</div>
              <p className="text-xl font-bold text-gray-800">
                {story[currentStep].text}
              </p>

              <Button
                variant="ghost"
                onClick={() => speakArabic(story[currentStep].text)}
              >
                <Volume2 className="w-4 h-4 ml-2" />
                إعادة القصة
              </Button>

              <div className="space-y-4">
                <p className="text-xl font-semibold text-pink-600">
                  {story[currentStep].question?.text}
                </p>
                <div className="grid gap-4">
                  {story[currentStep].question?.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className="h-16 text-lg bg-pink-100 hover:bg-pink-200 text-gray-800 border-2 border-pink-300"
                      variant="outline"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              {feedback && (
                <div className="p-4 rounded-lg bg-gray-100">
                  <p className="text-lg font-bold">{feedback}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // المهمة H: رامي ومريم مع الصحون
  const RamiMariamTask: React.FC<TaskProps> = ({ onComplete, onBack }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);

    const story = [
      {
        text: "رامي وضع المكرونة بجانب الموقد والسلطة على الطاولة",
        image: "👦🍝🔥🥗📱",
        question: {
          text: "أي صحن وضعه رامي بجانب الموقد؟",
          options: ["🍝 المكرونة", "🥗 السلطة", "🍞 الخبز"],
          correct: 0,
        },
      },
      {
        text: "مريم بدّلت أماكن الصحون",
        image: "👧🔄🍝🥗",
        question: {
          text: "أي صحن وضعته مريم بجانب الموقد؟",
          options: ["🍝 المكرونة", "🥗 السلطة", "🍞 الخبز"],
          correct: 1,
        },
      },
      {
        text: "رامي عاد ويريد المكرونة الساخنة",
        image: "👦🍝🔥❓",
        question: {
          text: "أين سيبحث رامي عن المكرونة؟",
          options: ["🔥 بجانب الموقد", "📱 على الطاولة", "❄️ في الثلاجة"],
          correct: 0,
        },
      },
    ];

    const handleAnswer = (selectedIndex: number) => {
      const correct = selectedIndex === story[currentStep].question?.correct;
      setAttempts((prev) => prev + 1);

      if (correct) {
        setScore((prev) => prev + 1);
        setFeedback("✅ رائع! فهمت كيف تغيرت الأماكن");
        speakArabic("رائع! فهمت كيف تغيرت الأماكن");

        setTimeout(() => {
          if (currentStep < story.length - 1) {
            setCurrentStep((prev) => prev + 1);
            setFeedback(null);
          } else {
            onComplete({
              taskId: "rami-mariam",
              score,
              totalQuestions: story.length,
              attempts,
              completed: true,
            });
          }
        }, 2000);
      } else {
        setFeedback("❌ تذكر من وضع ماذا وأين");
        speakArabic("تذكر من وضع ماذا وأين");
        setTimeout(() => setFeedback(null), 2000);
      }
    };

    useEffect(() => {
      if (story[currentStep].text) {
        speakArabic(story[currentStep].text);
      }
    }, [currentStep]);

    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة
          </Button>
          <h2 className="text-2xl font-bold text-center">
            رامي ومريم مع الصحون
          </h2>
          <Badge variant="outline">
            {currentStep + 1}/{story.length}
          </Badge>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="text-4xl mb-4">{story[currentStep].image}</div>
              <p className="text-xl font-bold text-gray-800">
                {story[currentStep].text}
              </p>

              <Button
                variant="ghost"
                onClick={() => speakArabic(story[currentStep].text)}
              >
                <Volume2 className="w-4 h-4 ml-2" />
                إعادة القصة
              </Button>

              <div className="space-y-4">
                <p className="text-xl font-semibold text-teal-600">
                  {story[currentStep].question?.text}
                </p>
                <div className="grid gap-4">
                  {story[currentStep].question?.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className="h-16 text-lg bg-teal-100 hover:bg-teal-200 text-gray-800 border-2 border-teal-300"
                      variant="outline"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              {feedback && (
                <div className="p-4 rounded-lg bg-gray-100">
                  <p className="text-lg font-bold">{feedback}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // المهمة I: منصور والدراجة
  const MansourBikeTask: React.FC<TaskProps> = ({ onComplete, onBack }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);

    const story = [
      {
        text: "الأم خبأت دراجة منصور كمفاجأة",
        image: "👩🚲📦",
        question: null,
      },
      {
        text: "الأم قالت لمنصور أنها اشترت له سكيت",
        image: "👩💬🛼",
        question: {
          text: "ماذا يتوقع منصور أن يحصل عليه؟",
          options: ["🚲 دراجة", "🛼 سكيت", "⚽ كرة"],
          correct: 1,
        },
      },
      {
        text: "الجد سأل الأم عن الهدية",
        image: "👴❓👩",
        question: {
          text: "ماذا ستخبر الأم الجد؟",
          options: ["🚲 دراجة", "🛼 سكيت", "🎁 مفاجأة"],
          correct: 0,
        },
      },
    ];

    const handleAnswer = (selectedIndex: number) => {
      const correct = selectedIndex === story[currentStep].question?.correct;
      setAttempts((prev) => prev + 1);

      if (correct) {
        setScore((prev) => prev + 1);
        setFeedback("✅ عظيم! فهمت الفرق بين الحقيقة والكذبة البيضاء");
        speakArabic("عظيم! فهمت الفرق بين الحقيقة والكذبة البيضاء");

        setTimeout(() => {
          if (currentStep < story.length - 1) {
            setCurrentStep((prev) => prev + 1);
            setFeedback(null);
          } else {
            onComplete({
              taskId: "mansour-bike",
              score,
              totalQuestions: story.filter((s) => s.question).length,
              attempts,
              completed: true,
            });
          }
        }, 2000);
      } else {
        setFeedback("❌ فكر في الحقيقة مقابل ما تريد الأم أن يصدقه منصور");
        speakArabic("فكر في الحقيقة مقابل ما تريد الأم أن يصدقه منصور");
        setTimeout(() => setFeedback(null), 3000);
      }
    };

    useEffect(() => {
      if (story[currentStep].text) {
        speakArabic(story[currentStep].text);
      }
    }, [currentStep]);

    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة
          </Button>
          <h2 className="text-2xl font-bold text-center">منصور والدراجة</h2>
          <Badge variant="outline">
            {currentStep + 1}/{story.length}
          </Badge>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">{story[currentStep].image}</div>
              <p className="text-xl font-bold text-gray-800">
                {story[currentStep].text}
              </p>

              <Button
                variant="ghost"
                onClick={() => speakArabic(story[currentStep].text)}
              >
                <Volume2 className="w-4 h-4 ml-2" />
                إعادة القصة
              </Button>

              {story[currentStep].question && (
                <div className="space-y-4">
                  <p className="text-xl font-semibold text-indigo-600">
                    {story[currentStep].question?.text}
                  </p>
                  <div className="grid gap-4">
                    {story[currentStep].question?.options.map(
                      (option, index) => (
                        <Button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          className="h-16 text-lg bg-indigo-100 hover:bg-indigo-200 text-gray-800 border-2 border-indigo-300"
                          variant="outline"
                        >
                          {option}
                        </Button>
                      ),
                    )}
                  </div>
                </div>
              )}

              {!story[currentStep].question &&
                currentStep < story.length - 1 && (
                  <Button
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white"
                  >
                    التالي
                  </Button>
                )}

              {feedback && (
                <div className="p-4 rounded-lg bg-gray-100">
                  <p className="text-lg font-bold">{feedback}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCurrentTask = () => {
    switch (currentTask) {
      case "emotions":
        return (
          <EmotionsTask
            onComplete={handleTaskComplete}
            onBack={() => setCurrentTask(null)}
          />
        );
      case "maha-cookie":
        return (
          <MahaCookieTask
            onComplete={handleTaskComplete}
            onBack={() => setCurrentTask(null)}
          />
        );
      case "amjad-glasses":
        return (
          <AmjadGlassesTask
            onComplete={handleTaskComplete}
            onBack={() => setCurrentTask(null)}
          />
        );
      case "yasmina-saeed":
        return (
          <YasminaSaeedTask
            onComplete={handleTaskComplete}
            onBack={() => setCurrentTask(null)}
          />
        );
      case "nasser-keys":
        return (
          <NasserKeysTask
            onComplete={handleTaskComplete}
            onBack={() => setCurrentTask(null)}
          />
        );
      case "faisal-book":
        return (
          <FaisalBookTask
            onComplete={handleTaskComplete}
            onBack={() => setCurrentTask(null)}
          />
        );
      case "khalid-gift":
        return (
          <KhalidGiftTask
            onComplete={handleTaskComplete}
            onBack={() => setCurrentTask(null)}
          />
        );
      case "rami-mariam":
        return (
          <RamiMariamTask
            onComplete={handleTaskComplete}
            onBack={() => setCurrentTask(null)}
          />
        );
      case "mansour-bike":
        return (
          <MansourBikeTask
            onComplete={handleTaskComplete}
            onBack={() => setCurrentTask(null)}
          />
        );
      default:
        return <TasksMenu />;
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50"
      dir="rtl"
    >
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Button
              onClick={() => navigate("/specialist-dashboard")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              الرئيسية
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              ألعاب نظرية العقل
            </h1>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentTask()}
      </div>
    </div>
  );
}
