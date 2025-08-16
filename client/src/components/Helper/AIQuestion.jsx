'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import img from '../../assets/img.png';

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const assistantMessage = {
        role: 'assistant',
        content: `I received: "${input}". This is a fixed AI response!`,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-pink-50 to-blue-50 p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-none bg-white/80 backdrop-blur-lg animate-float overflow-x-hidden rounded-lg">
        <CardContent className="p-4">
          <div className="space-y-2 mb-2 h-[60vh] overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8 animate-glow">
                    <AvatarImage src={img} alt="Robot Profile" />
                    <AvatarFallback>
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[80%] shadow-lg animate-glow transition-all hover:scale-105 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white'
                      : 'gradient-border bg-white text-black'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 animate-fade-in">
                <Avatar className="w-8 h-8 animate-glow">
                  <AvatarImage src={img} alt="Robot Profile" />
                  <AvatarFallback>
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-typing"></span>
                    <span
                      className="w-2 h-2 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full animate-typing"
                      style={{ animationDelay: '0.2s' }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-full animate-typing"
                      style={{ animationDelay: '0.4s' }}
                    ></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 animate-slide-up">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask the AI assistant..."
              className="gradient-border bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white hover:opacity-90 transition-all hover:scale-105 shadow-lg animate-glow"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
