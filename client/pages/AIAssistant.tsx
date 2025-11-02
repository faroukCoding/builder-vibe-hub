import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface Message {
  from: 'user' | 'ai';
  text: string;
}

export default function AIAssistant() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { from: 'ai', text: 'مرحباً! كيف يمكنني مساعدتك اليوم في رحلة علاج طفلك؟' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const newMessages: Message[] = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages([...newMessages, { from: 'ai', text: data.reply }]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      setMessages([...newMessages, { from: 'ai', text: 'عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/parent-dashboard')}
            className="ml-4"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">مساعد الذكاء الاصطناعي</h1>
            <p className="text-gray-500">اسأل واحصل على نصائح فورية</p>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col">
        <Card className="flex-1">
          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto mb-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md ${msg.from === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-2 rounded-lg bg-gray-200">
                    <span className="animate-pulse">...</span>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-auto flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اكتب سؤالك هنا..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
