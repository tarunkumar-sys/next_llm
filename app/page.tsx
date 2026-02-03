'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiId = (Date.now() + 1).toString();
    setMessages(prev => [
      ...prev,
      { id: aiId, role: 'assistant', content: '', isTyping: true },
    ]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let text = '';

      while (true) {
        const { value, done } = await reader!.read();
        if (done) break;

        text += decoder.decode(value);
        setMessages(prev =>
          prev.map(m =>
            m.id === aiId
              ? { ...m, content: text, isTyping: false }
              : m
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const TypingDots = () => (
    <div className="flex gap-1">
      <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" />
      <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-150" />
      <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-300" />
    </div>
  );

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-full bg-zinc-950 border border-zinc-800 rounded-3xl flex flex-col">

        <div className="p-4 border-b border-zinc-800 text-zinc-200 font-semibold">
          IoTSolvez Customer Care Assistant
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-[80%] text-sm ${
                  m.role === 'user'
                    ? 'bg-white text-black'
                    : 'bg-zinc-800 text-white'
                }`}
              >
                {m.isTyping ? <TypingDots /> : m.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800 flex gap-2">
          <input
            className="flex-1 bg-zinc-900 text-white px-4 py-2 rounded-xl border border-zinc-700"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask IoTSolvez support..."
          />
          <button
            disabled={isLoading}
            className="bg-white text-black px-4 rounded-xl disabled:opacity-50"
          >
            Send
          </button>
        </form>

      </div>
    </div>
  );
}
