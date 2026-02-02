"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

type Message = {
  role: "user" | "agent";
  text?: string;
  thinking?: boolean;
};

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", text: "Hello 👋 Ask me anything." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    setLoading(true);

    // 1️⃣ Add user message
    setMessages(prev => [
      ...prev,
      { role: "user", text: userText },
      { role: "agent", thinking: true } // 2️⃣ thinking placeholder
    ]);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });

      const data = await res.json();

      // 3️⃣ Replace thinking bubble with real answer
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "agent",
          text: data.reply || "No response."
        };
        return updated;
      });
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "agent",
          text: "❌ Error connecting to agent."
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">

      {/* Center Chat Card */}
      <div className="w-full max-w-4xl h-[85vh] bg-[#0f0f0f] border border-gray-800 rounded-2xl flex flex-col">

        {/* Header */}
        <div className="border-b border-gray-800 px-6 py-4 text-gray-200 font-medium">
          AI Assistant
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-[#1e1e1e] text-gray-200"
                }`}
              >
                {msg.thinking ? <ThinkingDots /> : msg.text}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={loading ? "AI is thinking..." : "Send a message..."}
              disabled={loading}
              className="flex-1 bg-[#1e1e1e] text-gray-200 placeholder-gray-500 rounded-lg px-4 py-3 outline-none border border-gray-700 focus:border-gray-500 disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-4 rounded-lg flex items-center justify-center disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* 🔵 Thinking Dots Animation */
function ThinkingDots() {
  return (
    <div className="flex gap-1">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
    </div>
  );
}
