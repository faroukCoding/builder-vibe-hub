import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'specialist' | 'parent' | 'both';
}

export default function ProtectedRoute({ children, requiredUserType = 'both' }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const type = localStorage.getItem('userType');
      
      setIsLoggedIn(loggedIn);
      setUserType(type);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري التحقق من بيانات تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center" dir="rtl">
        <Card className="max-w-md mx-4">
          <CardContent className="text-center p-8">
            <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              يتطلب تسجيل الدخول
            </h2>
            <p className="text-gray-600 mb-6">
              للوصول إلى هذه الصفحة، يجب عليك تسجيل الدخول أولاً
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/login')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <LogIn className="w-4 h-4 ml-2" />
                تسجيل الدخول
              </Button>
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full"
              >
                العودة للرئيسية
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requiredUserType !== 'both' && userType !== requiredUserType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center" dir="rtl">
        <Card className="max-w-md mx-4">
          <CardContent className="text-center p-8">
            <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Lock className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              غير مصرح لك بالوصول
            </h2>
            <p className="text-gray-600 mb-6">
              هذه الصفحة مخصصة لـ {requiredUserType === 'specialist' ? 'الأخصائيين' : 'أولياء الأمور'} فقط
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate(userType === 'specialist' ? '/specialist-dashboard' : '/parent-dashboard')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                العودة للوحة التحكم
              </Button>
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full"
              >
                العودة للرئيسية
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
