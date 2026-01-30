
import React, { useState, useRef, useEffect } from 'react';
import { getLogiBotResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const LogiBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi! I am LogiBot. How can I help you scale your shipping today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const stream = await getLogiBotResponse(history, userMsg);
      let fullText = '';
      
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of stream) {
        fullText += chunk.text;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, text: fullText }];
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[150] flex flex-col items-end">
      {isOpen && (
        <div className="bg-slate-900 border border-white/10 w-80 md:w-96 h-[500px] mb-4 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-blue-600 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">🤖</div>
              <span className="font-bold text-white">LogiBot AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">✕</button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                  m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'
                }`}>
                  {m.text || (loading && i === messages.length - 1 ? '...' : '')}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/5 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask LogiBot..." 
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <button onClick={handleSend} className="bg-blue-600 px-4 py-2 rounded-xl text-white font-bold">Send</button>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-2xl shadow-2xl shadow-blue-500/40 transition-transform active:scale-90"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

export default LogiBot;
