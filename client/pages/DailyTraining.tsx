import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DailyExercise } from "@shared/api";
import { AlertCircle, Loader2, Target } from "lucide-react";

const DailyTraining = () => {
  const [exercises, setExercises] = useState<DailyExercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/daily-training');
        if (!response.ok) {
          throw new Error('فشل في جلب بيانات التمارين.');
        }
        const data: DailyExercise[] = await response.json();
        setExercises(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const getDifficultyBadgeVariant = (difficulty: 'سهل' | 'متوسط' | 'صعب') => {
    switch (difficulty) {
      case 'سهل':
        return 'bg-green-100 text-green-800';
      case 'متوسط':
        return 'bg-yellow-100 text-yellow-800';
      case 'صعب':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2">جاري تحميل التمارين...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <AlertCircle className="h-8 w-8" />
        <p className="ml-2">خطأ: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">التدريب اليومي</h1>
            <p className="text-gray-600 mt-2">تابع تمارين النطق اليومية لطفلك وراقب تقدمه بمرور الوقت.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exercises.map((exercise) => (
            <Card key={exercise.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold text-gray-800">{exercise.name}</CardTitle>
                    <Badge className={getDifficultyBadgeVariant(exercise.difficulty)}>{exercise.difficulty}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium text-gray-600">التقدم:</p>
                  <Progress value={exercise.progress} className="w-full h-2" />
                  <span className="font-bold text-teal-600">{exercise.progress}%</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                  onClick={() => navigate(`/daily-training/${exercise.id}`)}
                >
                    <Target className="w-4 h-4 ml-2" />
                    عرض التفاصيل
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyTraining;
