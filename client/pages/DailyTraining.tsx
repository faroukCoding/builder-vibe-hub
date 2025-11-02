import { ArrowLeft, Play, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

export default function DailyTraining() {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/parent-dashboard')}
            >
              <ArrowLeft className="w-4 h-4" />
              العودة إلى لوحة التحكم
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">التدريب اليومي</h1>
              <p className="text-gray-500">تمارين اليوم لطفلك</p>
            </div>
          </div>
          <div className="text-left">
            <p className="font-semibold">التقدم الإجمالي</p>
            <Progress value={60} className="w-32 mt-1" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {dailyExercises.map((exercise) => (
            <Card key={exercise.id} className={exercise.completed ? 'bg-green-50 border-green-200' : ''}>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {exercise.completed && <CheckCircle className="w-6 h-6 text-green-500" />}
                    <h3 className="text-xl font-semibold">{exercise.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{exercise.description}</p>
                  <div className="flex items-center gap-4">
                    <Progress value={exercise.progress} className="w-1/2" />
                    <span className="text-sm font-medium">{exercise.progress}%</span>
                  </div>
                </div>
                <Button disabled={exercise.completed}>
                  <Play className="w-4 h-4 ml-2" />
                  {exercise.completed ? 'تم إكماله' : 'ابدأ التمرين'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
