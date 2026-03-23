'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, MessageCircle, Bot, User } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatModalProps {
  onClose: () => void;
  messages: Message[];
  setMessages: (updater: (prev: Message[]) => Message[]) => void;
  predictionContext?: {
    predicted_weekly_sales: number;
    confidence_score: number;
    family: string;
    brand: string;
    cold_start_detected: boolean;
  };
}

export default function ChatModal({ onClose, messages, setMessages, predictionContext }: ChatModalProps) {
  // Seed a greeting only once, when history is empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages(() => [{
        role: 'assistant',
        content: predictionContext
          ? `I can help you understand this prediction for ${predictionContext.brand} ${predictionContext.family} (${predictionContext.predicted_weekly_sales.toFixed(2)} units/week, ${predictionContext.confidence_score.toFixed(0)}% confidence). What would you like to know?`
          : 'Hello! I can answer questions about this prediction, how the model works, or help you interpret the results. What would you like to know?',
      }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const { data } = await axios.post(`${API_URL}/chat/`, {
        message: userMessage,
        history,
        prediction_context: predictionContext,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I could not reach the AI service right now. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:w-[480px] sm:max-w-lg bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
           style={{ height: 'min(600px, 90vh)' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0099FF] to-[#0066CC] px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Ask about this prediction</p>
              <p className="text-white/70 text-xs">AI-powered · No memory between sessions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start space-x-2.5 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                ${msg.role === 'assistant' ? 'bg-gradient-to-br from-[#0099FF] to-[#0066CC]' : 'bg-[#E5001A]'}`}>
                {msg.role === 'assistant'
                  ? <Bot className="w-4 h-4 text-white" />
                  : <User className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                ${msg.role === 'assistant'
                  ? 'bg-white border border-gray-200 text-[#2C2C2C] rounded-tl-sm shadow-sm prose prose-sm max-w-none'
                  : 'bg-[#E5001A] text-white rounded-tr-sm'}`}>
                {msg.role === 'assistant' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0099FF] to-[#0066CC] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#0099FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#0099FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#0099FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 bg-gray-50 flex gap-2 overflow-x-auto flex-shrink-0">
            {[
              'How much should I order monthly?',
              'What does the confidence mean?',
              'How was this model trained?',
            ].map((q) => (
              <button
                key={q}
                onClick={() => { setInput(q); }}
                className="text-xs whitespace-nowrap bg-white border border-[#0099FF]/30 text-[#0066CC] px-3 py-1.5 rounded-full hover:bg-[#E6F5FF] transition-colors flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center space-x-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-[#0099FF] focus-within:ring-2 focus-within:ring-[#0099FF]/20 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask anything about this prediction..."
              className="flex-1 bg-transparent text-sm text-[#2C2C2C] placeholder-gray-400 outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-8 h-8 flex items-center justify-center bg-[#0099FF] rounded-lg text-white disabled:opacity-40 hover:bg-[#0066CC] transition-colors flex-shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
