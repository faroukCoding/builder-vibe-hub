import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SmartAssistantRequest, SmartAssistantResponse } from "@shared/api";
import { Bot, Loader2, Send, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const SmartAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'مرحباً! أنا مساعدك الذكي. كيف يمكنني دعمك أنت وطفلك اليوم؟' }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        // A bit of a hack to scroll to the bottom after the DOM updates
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 0);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const requestBody: SmartAssistantRequest = { message: input };
      const response = await fetch('/api/smart-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('فشل في الحصول على رد من المساعد الذكي.');
      }

      const data: SmartAssistantResponse = await response.json();
      const aiMessage: Message = { sender: 'ai', text: data.reply };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      const errorMessage: Message = { sender: 'ai', text: 'عذراً، حدث خطأ أثناء محاولة التواصل مع المساعد. يرجى المحاولة مرة أخرى.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center" dir="rtl">
        <Card className="w-full max-w-2xl h-[70vh] shadow-lg flex flex-col">
            <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                    <div className="bg-sky-100 p-2 rounded-full">
                        <Bot className="w-6 h-6 text-sky-600" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">المساعد الذكي</CardTitle>
                        <p className="text-sm text-gray-500">مدعوم بـ Gemini AI (محاكاة)</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'ai' && (
                            <Avatar className="h-8 w-8 bg-sky-100">
                                <AvatarFallback><Bot className="h-5 w-5 text-sky-600" /></AvatarFallback>
                            </Avatar>
                            )}
                            <div className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                             {msg.sender === 'user' && (
                            <Avatar className="h-8 w-8 bg-gray-200">
                                <AvatarFallback><User className="h-5 w-5 text-gray-600" /></AvatarFallback>
                            </Avatar>
                            )}
                        </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-end gap-2">
                                <Avatar className="h-8 w-8 bg-sky-100">
                                    <AvatarFallback><Bot className="h-5 w-5 text-sky-600" /></AvatarFallback>
                                </Avatar>
                                <div className="rounded-lg px-4 py-2 bg-gray-200 text-gray-800">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="اكتب سؤالك هنا..."
                    className="flex-1"
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()} className="bg-sky-500 hover:bg-sky-600">
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </Card>
    </div>
  );
};

export default SmartAssistant;
