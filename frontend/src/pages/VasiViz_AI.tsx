import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Bot } from "lucide-react";
import {AppSidebar} from "@/components/AppSidebar";
import React, { useState,useRef, useEffect } from "react";
import { ScrollTopFloating } from '@/components/ScrollButton';
import { motion } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}
const OllamaChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
          role: "assistant",
          content:
            "👋 Üdvözöllek! Ez az Ollama-alapú chat. Kérdezz bátran!",
        },
      ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;
    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Hiba történt a szerverrel való kommunikáció közben.",
        },
      ]);
    } finally {
      setLoading(false);
    }
    };

  return (
    <SidebarProvider>
        <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 ">
            <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
                {/* Header with Sidebar Trigger */}
                <div className="p-4 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <div className="flex items-center gap-3 ">
                        <Bot className="h-8 w-8 text-blue-600" />
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Vasiviz AI Chat
                        </h1>
                    </div>
                    </div>
                </div>

                    {/* Main Content */}
                    <div className="flex flex-col h-screen bg-white text-gray-900 pt-16">
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                          {messages.map((msg, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-2xl px-4 py-3 rounded-2xl shadow-md whitespace-pre-line leading-relaxed ${
                                  msg.role === "user"
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200"
                                }`}
                              >
                                {msg.content}
                              </div>
                            </motion.div>
                          ))}

                          {loading && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, repeat: Infinity, repeatType: "mirror" }}
                              className="flex items-center gap-2 text-sm text-gray-500"
                            >
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150" />
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300" />
                              <span>Ollama gondolkodik...</span>
                            </motion.div>
                          )}

                          <div ref={bottomRef} />
                        </div>
                        <div className="border-t border-gray-200 p-4 flex gap-2 bg-gray-50 sticky bottom-0">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Írj ide valamit..."
                                className="flex-1 p-3 bg-white border border-gray-300 rounded-xl text-gray-900 outline-none"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading}
                                className="bg-blue-500 px-4 py-2 rounded-xl font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                            >
                                Küldés
                            </button>
                        </div>
                    </div>
            </div>
        </SidebarInset>
        </div>
        <ScrollTopFloating />
    </SidebarProvider>
  );
};

export default OllamaChat;
