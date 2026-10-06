'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Phone,
  Bot,
  User,
  ExternalLink,
} from 'lucide-react';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Hello! I am the Torcia Assistant. I am currently learning about our new admission policies. For urgent queries, please call 0342-2049976.',
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Contextual auto-reply
    setTimeout(() => {
      let botReply =
        'Thank you for your question. For detailed admissions counseling or fee schedules, please submit our Online Inquiry form or contact our admissions desk at 0342-2049976.';
      
      const lower = userText.toLowerCase();
      if (lower.includes('admission') || lower.includes('fee') || lower.includes('apply')) {
        botReply =
          'Admissions for the 2026-2027 academic session are currently open from Playgroup to Class V! You can submit an inquiry directly via our Admissions page or call 0342-2049976.';
      } else if (lower.includes('timing') || lower.includes('hour') || lower.includes('time')) {
        botReply =
          'Our campus office timings are Monday to Saturday: 7:45 am – 2:00 pm (Friday: 7:45 am – 1:00 pm).';
      } else if (lower.includes('address') || lower.includes('location') || lower.includes('where')) {
        botReply =
          'The Torcia School is located at Plot # 20/13 Block 5C, near Abbasi Shaheed Hospital, Nazimabad, Karachi.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 font-sans">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-[calc(100vw-2rem)] sm:w-96 max-h-[500px] sm:max-h-[540px] h-[440px] sm:h-[480px] bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl flex flex-col overflow-hidden mb-3 select-none"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#87131A] to-[#A01A22] text-white p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center border border-white/20">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm leading-tight text-white">Torcia Assistant</h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-white/80">Admissions & Campus Helper</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Contact Notice Banner */}
            <div className="bg-red-50/80 border-b border-red-100 px-4 py-2 flex items-center justify-between text-xs text-red-900">
              <span className="flex items-center gap-1 font-semibold text-[11px]">
                <Phone className="w-3 h-3 text-[#A01A22]" /> 0342-2049976
              </span>
              <a
                href="tel:03422049976"
                className="text-[11px] font-bold text-[#A01A22] hover:underline"
              >
                Call Desk
              </a>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-white/60 to-gray-50/60">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-[#A01A22] text-white flex items-center justify-center shrink-0 mb-1">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#A01A22] text-white rounded-br-xs'
                        : 'bg-white/95 text-gray-800 border border-gray-100 rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span
                      className={`block text-[10px] mt-1 text-right ${
                        msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 mb-1">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-gray-400 text-xs pl-9">
                  <div className="flex gap-1 items-center bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A01A22] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A01A22] animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A01A22] animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-white/95 border-t border-gray-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about admissions, timings..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#A01A22]/40 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-9 h-9 rounded-full bg-[#A01A22] hover:bg-[#87131A] text-white flex items-center justify-center shrink-0 transition-all shadow-md active:scale-95 disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group relative flex items-center gap-2 bg-[#A01A22] hover:bg-[#87131A] text-white px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-full shadow-[0_10px_25px_rgba(160,26,34,0.35)] hover:shadow-[0_15px_30px_rgba(160,26,34,0.45)] transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
        aria-label="Toggle AI Assistant"
      >
        <div className="relative">
          {isOpen ? (
            <X className="w-5 h-5 text-white transition-transform group-hover:rotate-90 duration-300" />
          ) : (
            <MessageCircle className="w-5 h-5 text-white" />
          )}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-yellow-400 ring-2 ring-[#A01A22] animate-ping" />
          )}
        </div>
        <span className="text-xs sm:text-sm font-bold tracking-wide select-none">
          {isOpen ? 'Close Assistant' : 'Ask AI'}
        </span>
      </button>
    </div>
  );
}
