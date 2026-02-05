import React, { useEffect, useRef, useState } from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { User, Sparkles, Globe, ChevronDown, ChevronRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

interface ChatWindowProps {
    messages: Message[];
    isLoading: boolean;
}

const SourcesDisplay = ({ sources }: { sources: Source[] }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!sources || sources.length === 0) return null;

    return (
        <div className="mt-4 mb-2">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="group flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-3 select-none px-2 py-1 rounded-lg hover:bg-white/5 w-fit"
            >
                <div className="flex items-center justify-center w-5 h-5 rounded-md bg-white/5 group-hover:bg-white/10 transition-colors border border-white/5">
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </div>
                <BookOpen className="w-3.5 h-3.5" />
                <span>{sources.length} Sources Found</span>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar snap-x">
                            {sources.map((source, idx) => (
                                <a
                                    key={idx}
                                    href={source.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-shrink-0 w-60 p-3 bg-black/40 border border-white/10 hover:border-primary/50 rounded-xl transition-all group snap-start backdrop-blur-sm"
                                >
                                    <div className="text-xs font-semibold text-zinc-200 truncate group-hover:text-primary mb-1.5">
                                        {source.title}
                                    </div>
                                    <div className="text-[10px] text-zinc-500 truncate flex items-center gap-1.5">
                                        <div className="p-0.5 rounded-full bg-white/5">
                                            <Globe className="w-2.5 h-2.5" />
                                        </div>
                                        {new URL(source.href).hostname.replace('www.', '')}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, isLoading]);

    return (
        <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-10 custom-scrollbar relative scroll-smooth"
        >
            <div className="max-w-3xl mx-auto space-y-8 min-h-[calc(100vh-180px)]">
                {messages.length === 0 && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="h-full flex flex-col items-center justify-center text-center space-y-8 pt-20"
                    >
                        <div className="relative group cursor-default">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                            <div className="relative w-24 h-24 bg-gradient-to-br from-[#1e1e24] to-[#121215] rounded-[2.5rem] flex items-center justify-center text-white border border-white/10 shadow-2xl">
                                <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                            </div>
                        </div>

                        <div className="space-y-3 max-w-lg">
                            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-200 to-zinc-500">
                                How can I help?
                            </h2>
                            <p className="text-zinc-400 text-lg font-light">
                                Aayushi is ready to assist with code, design, and complex problems.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl mt-12">
                            {["Explain quantum computing", "Write a Next.js login page", "Debug this React error", "Summarize AI trends"].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl text-left text-sm text-zinc-300 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                                >
                                    <span className="font-medium group-hover:text-white transition-colors">{suggestion}</span>
                                    <span className="block text-xs text-zinc-500 mt-2 flex items-center gap-1 group-hover:text-primary transition-colors">
                                        Start chat <ChevronRight className="w-3 h-3" />
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                <div className="flex flex-col gap-8 pb-4">
                    {messages.map((msg, idx) => {
                        const isLastMessage = idx === messages.length - 1;
                        const isTyping = isLastMessage && isLoading && msg.role === "assistant";

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                key={idx}
                                className={`flex gap-4 md:gap-6 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                            >
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg border border-white/5 ${msg.role === "user"
                                        ? "bg-zinc-800 text-zinc-400"
                                        : "bg-gradient-to-br from-primary to-blue-600 text-white shadow-primary/20"
                                    }`}>
                                    {msg.role === "user" ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                                </div>

                                <div className={`flex flex-col max-w-[85%] md:max-w-[80%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>

                                    {msg.role === "assistant" && msg.sources && (
                                        <SourcesDisplay sources={msg.sources} />
                                    )}

                                    <div className={`px-6 py-5 rounded-3xl relative shadow-sm ${msg.role === "user"
                                            ? "bg-zinc-800/80 text-zinc-100 rounded-tr-sm"
                                            : "glass-panel rounded-tl-sm text-zinc-200"
                                        }`}>
                                        <div className="markdown-content">
                                            <MarkdownRenderer content={msg.content} />
                                            {isTyping && (
                                                <div className="flex gap-1.5 items-center mt-3 ml-1 h-4">
                                                    {[0, 1, 2].map((i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0.4 }}
                                                            animate={{ opacity: 1, y: [0, -4, 0] }}
                                                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                                                            className="w-1.5 h-1.5 bg-primary rounded-full"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
