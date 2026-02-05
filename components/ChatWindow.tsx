import React, { useEffect, useRef, useState } from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { User, Sparkles, Globe, ChevronDown, ChevronRight, BookOpen, Cpu, Box, Search } from "lucide-react";
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
                        <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar snap-x max-w-full w-full">
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
            className="flex-1 overflow-y-auto px-4 md:px-8 py-8 space-y-12 custom-scrollbar relative scroll-smooth bg-transparent"
        >
            <div className="max-w-4xl mx-auto space-y-10 min-h-[calc(100vh-200px)] flex flex-col justify-center">
                {messages.length === 0 && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-center justify-center text-center space-y-12 py-10"
                    >
                        <div className="relative group cursor-default mb-4">
                            <div className="absolute -inset-8 bg-[#4361ee]/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-500 animate-pulse" />
                            <div className="relative w-28 h-28 bg-gradient-to-br from-[#1e1e24] to-[#09090b] rounded-[40px] flex items-center justify-center text-white border border-white/5 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                                <Sparkles className="w-12 h-12 text-[#4361ee] drop-shadow-[0_0_12px_rgba(67,97,238,0.5)]" />
                            </div>
                        </div>

                        <div className="space-y-4 max-w-2xl px-4">
                            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight">
                                Design your <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4361ee] to-[#4cc9f0]">future.</span>
                            </h2>
                            <p className="text-zinc-500 text-lg md:text-xl font-medium tracking-wide max-w-md mx-auto leading-relaxed">
                                Universal intelligence at your command. Let&apos;s build something extraordinary.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mt-12 px-4">
                            {[
                                { title: "Neural Engineering", desc: "Explain complex concepts", icon: <Cpu className="w-4 h-4" /> },
                                { title: "Architectural Design", desc: "Draft code structures", icon: <Box className="w-4 h-4" /> },
                                { title: "Strategic Analysis", desc: "Market trends & data", icon: <Search className="w-4 h-4" /> },
                                { title: "Creative Synthesis", desc: "Original content & ideas", icon: <Sparkles className="w-4 h-4" /> }
                            ].map((suggestion, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ y: -5, scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                                    className="p-6 bg-white/5 border border-white/5 hover:border-white/10 rounded-[32px] text-left transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                        {suggestion.icon}
                                    </div>
                                    <span className="block text-xs font-black uppercase tracking-[0.2em] text-[#4361ee] mb-1">{suggestion.title}</span>
                                    <span className="text-sm text-zinc-400 font-medium group-hover:text-white transition-colors leading-snug">{suggestion.desc}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                <div className="flex flex-col gap-10 pb-12 w-full">
                    {messages.map((msg, idx) => {
                        const isLastMessage = idx === messages.length - 1;
                        const isTyping = isLastMessage && isLoading && msg.role === "assistant";

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                key={idx}
                                className={cn(
                                    "flex gap-5 md:gap-8 group",
                                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-2xl border border-white/5 transition-transform group-hover:scale-105",
                                    msg.role === "user"
                                        ? "bg-[#18181b] text-zinc-500"
                                        : "bg-gradient-to-br from-[#4361ee] to-[#4cc9f0] text-white"
                                )}>
                                    {msg.role === "user" ? <User className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                                </div>

                                <div className={cn(
                                    "flex flex-col max-w-[90%] md:max-w-[85%] space-y-3",
                                    msg.role === "user" ? "items-end" : "items-start"
                                )}>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
                                            {msg.role === "user" ? "Authorized Oracle" : "Aayushi Core"}
                                        </span>
                                    </div>

                                    {msg.role === "assistant" && msg.sources && (
                                        <SourcesDisplay sources={msg.sources} />
                                    )}

                                    <div className={cn(
                                        "px-8 py-6 rounded-[36px] relative shadow-2xl transition-all duration-500",
                                        msg.role === "user"
                                            ? "bg-white text-black font-medium rounded-tr-sm"
                                            : "bg-[#121215]/50 backdrop-blur-xl border border-white/5 rounded-tl-sm text-zinc-200"
                                    )}>
                                        <div className="markdown-content text-lg leading-relaxed">
                                            <MarkdownRenderer content={msg.content} />
                                            {isTyping && (
                                                <div className="flex gap-2 items-center mt-6 ml-1 h-5">
                                                    {[0, 1, 2].map((i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0.2 }}
                                                            animate={{ opacity: 1, y: [0, -6, 0] }}
                                                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.25 }}
                                                            className="w-2 h-2 bg-[#4361ee] rounded-full"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {isLastMessage && !isLoading && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="pt-2"
                                        >
                                            <div className="flex items-center gap-4 text-[10px] text-zinc-600 font-black uppercase tracking-widest pl-4">
                                                <span>Synthesized</span>
                                                <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                                                <span>2026 Core</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
