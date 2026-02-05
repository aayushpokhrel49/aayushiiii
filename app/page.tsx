"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatWindow } from "@/components/ChatWindow";
import { InputBar } from "@/components/InputBar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Menu,
  ChevronDown,
  Settings2,
  Sparkles,
  Command,
  Search,
  Share2
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { EmptyState } from "@/components/EmptyState";

interface Source {
  title: string;
  href: string;
  snippet: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

interface Chat {
  chatId: string;
  title: string;
  messages: Message[];
}

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState("llama-3.1-8b-instant");
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auth Redirect
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Load Chats from LocalStorage
  useEffect(() => {
    const savedChats = localStorage.getItem("aayushi_chats");
    if (savedChats) {
      try {
        const parsed = JSON.parse(savedChats);
        setChats(parsed);
        if (parsed.length > 0) {
          setCurrentChatId(parsed[0].chatId);
        }
      } catch (e) {
        console.error("Failed to parse chats", e);
      }
    }
  }, []);

  // Save Chats to LocalStorage
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("aayushi_chats", JSON.stringify(chats));
    }
  }, [chats]);

  const currentChat = chats.find(c => c.chatId === currentChatId) || null;

  const handleNewChat = () => {
    const newChat: Chat = {
      chatId: uuidv4(),
      title: "New Chat",
      messages: [],
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.chatId);
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  const handleDeleteChat = (id: string) => {
    const updatedChats = chats.filter(c => c.chatId !== id);
    setChats(updatedChats);
    if (currentChatId === id) {
      setCurrentChatId(updatedChats.length > 0 ? updatedChats[0].chatId : null);
    }
    if (updatedChats.length === 0) {
      localStorage.removeItem("aayushi_chats");
    }
  };

  const handleClearHistory = () => {
    setChats([]);
    setCurrentChatId(null);
    localStorage.removeItem("aayushi_chats");
  };

  const handleSend = async (message: string, useWeb: boolean, language: string) => {
    let activeChatId = currentChatId;
    let updatedChats = [...chats];

    if (!activeChatId) {
      const newChat: Chat = {
        chatId: uuidv4(),
        title: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
        messages: [],
      };
      updatedChats = [newChat, ...chats];
      setChats(updatedChats);
      setCurrentChatId(newChat.chatId);
      activeChatId = newChat.chatId;
    }

    const newMessage: Message = { role: "user", content: message };

    // Update local state first
    const chatIdx = updatedChats.findIndex(c => c.chatId === activeChatId);
    if (chatIdx > -1) {
      updatedChats[chatIdx].messages.push(newMessage);
      if (updatedChats[chatIdx].title === "New Chat") {
        updatedChats[chatIdx].title = message.substring(0, 30) + (message.length > 30 ? "..." : "");
      }
      setChats([...updatedChats]);
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          model,
          useWeb,
          language
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch response");

      // Handle sources from header
      const sourcesHeader = res.headers.get("X-Sources");
      const sources: Source[] = sourcesHeader ? JSON.parse(sourcesHeader) : [];

      // Create initial assistant message
      const aiMessage: Message = {
        role: "assistant",
        content: "",
        sources: sources.length > 0 ? sources : undefined
      };

      // Add empty assistant message to chat
      let currentChats = [...updatedChats];
      const chatIndex = currentChats.findIndex(c => c.chatId === activeChatId);
      if (chatIndex > -1) {
        currentChats[chatIndex].messages.push(aiMessage);
        setChats([...currentChats]);
      }

      // Stream handling
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          // Update message content
          aiMessage.content += chunk;

          // Force update state
          setChats((prevChats) => {
            const newChats = [...prevChats];
            const activeIdx = newChats.findIndex(c => c.chatId === activeChatId);
            if (activeIdx > -1) {
              // Update the last message (assistant)
              const messages = newChats[activeIdx].messages;
              if (messages.length > 0 && messages[messages.length - 1].role === "assistant") {
                messages[messages.length - 1] = { ...aiMessage };
              }
            }
            return newChats;
          });
        }
      }

    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };



  const hasMessages = currentChat && currentChat.messages.length > 0;

  return (
    <div className="flex h-screen bg-[#000000] text-[#fafafa] overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onSelectChat={(id) => {
          setCurrentChatId(id);
          setIsSidebarOpen(false);
          // If switching to a chat, it might have messages, so state updates automatically
        }}
        onDeleteChat={handleDeleteChat}
        onClearHistory={handleClearHistory}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Navbar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-[#000000]/80 backdrop-blur-md z-30 sticky top-0">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-[#1c1c1e] rounded-lg transition-all text-[#a1a1aa]"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Model Selector (Left aligned now) */}
            <div className="relative">
              <button
                onClick={() => setShowModelSelector(!showModelSelector)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#1c1c1e] transition-all text-sm font-medium text-[#a1a1aa] hover:text-white"
              >
                <span className="opacity-70">Grok 2</span>
                <span className="text-xs text-[#71717a]">beta</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
              </button>
              {/* ... Model Dropdown logic (keep existing if needed, simplified for brevity) ... */}
              {showModelSelector && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-[#18181b] border border-[#27272a] rounded-xl shadow-2xl py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  {[
                    { id: "llama-3.1-8b-instant", name: "Grok 2 (Llama)", desc: "Fastest" },
                    { id: "llama-3.3-70b-versatile", name: "Grok 2 Vision", desc: "Capable" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setModel(m.id);
                        setShowModelSelector(false);
                      }}
                      className={`w-full text-left px-4 py-3 flex flex-col gap-0.5 transition-all hover:bg-[#27272a] ${model === m.id ? 'bg-[#27272a]/50' : ''}`}
                    >
                      <span className={`text-sm font-semibold ${model === m.id ? 'text-[#4361ee]' : 'text-[#fafafa]'}`}>{m.name}</span>
                      <span className="text-[10px] text-[#71717a]">{m.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-[#a1a1aa] hover:text-white hover:bg-[#1c1c1e] rounded-lg transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {!hasMessages ? (
            <EmptyState onSend={(msg) => handleSend(msg, false, "English")} />
          ) : (
            <div className="h-full flex flex-col">
              <ChatWindow
                messages={currentChat?.messages || []}
                isLoading={isLoading}
              />
              <div className="p-4 md:p-6 max-w-3xl mx-auto w-full">
                <InputBar onSend={handleSend} isLoading={isLoading} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

