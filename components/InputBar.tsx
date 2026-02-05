"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Globe, Languages, Command } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputBarProps {
    onSend: (message: string, useWeb: boolean, language: string) => void;
    isLoading: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({ onSend, isLoading }) => {
    const [input, setInput] = useState("");
    const [useWeb, setUseWeb] = useState(false);
    const [language, setLanguage] = useState("English");
    const [showLanguages, setShowLanguages] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const languages = ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Hindi"];

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [input]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (input.trim() && !isLoading) {
            onSend(input, useWeb, language);
            setInput("");
            if (textareaRef.current) textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="p-4 md:p-6 bg-gradient-to-t from-background via-background/90 to-transparent backdrop-blur-sm fixed bottom-0 left-0 right-0 md:pl-72 z-50">
            <div className="max-w-3xl mx-auto relative">
                <div className="relative bg-[#09090b]/80 backdrop-blur-xl border border-[#27272a] rounded-[24px] p-2 flex items-center shadow-2xl transition-all focus-within:border-[#4361ee]/50 focus-within:ring-1 focus-within:ring-[#4361ee]/20 group hover:border-white/10">
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        className="w-full bg-transparent border-none focus:ring-0 text-zinc-100 placeholder-zinc-500 py-3 px-4 resize-none max-h-[200px] overflow-y-auto custom-scrollbar text-base font-light"
                        placeholder="Ask Aayushi anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                    />

                    <div className="flex items-center justify-between px-2 pb-1 mt-2">
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setUseWeb(!useWeb)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full flex items-center gap-2 transition-all text-xs font-medium border",
                                    useWeb
                                        ? "bg-primary/10 text-primary border-primary/20 shadow-lg shadow-primary/5"
                                        : "bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10 hover:text-zinc-200"
                                )}
                            >
                                <Globe className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Search</span>
                            </button>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowLanguages(!showLanguages)}
                                    className="px-3 py-1.5 rounded-full flex items-center gap-2 transition-all text-xs font-medium bg-white/5 text-zinc-400 border border-white/5 hover:bg-white/10 hover:text-zinc-200"
                                >
                                    <Languages className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">{language}</span>
                                </button>

                                {showLanguages && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowLanguages(false)}
                                        />
                                        <div className="absolute bottom-full left-0 mb-3 w-40 glass-panel rounded-xl py-1 z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang}
                                                    className={cn(
                                                        "w-full text-left px-4 py-2.5 text-xs transition-colors hover:bg-white/5",
                                                        language === lang ? "text-primary font-medium bg-white/5" : "text-zinc-400"
                                                    )}
                                                    onClick={() => {
                                                        setLanguage(lang);
                                                        setShowLanguages(false);
                                                    }}
                                                >
                                                    {lang}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-1.5 text-zinc-500 text-[10px] font-medium uppercase tracking-widest select-none">
                                <Command className="w-3 h-3" />
                                <span>Return</span>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={!input.trim() || isLoading}
                                className={cn(
                                    "p-2.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:scale-95",
                                    input.trim()
                                        ? "bg-primary text-white shadow-lg shadow-primary/25 hover:scale-105 active:scale-95"
                                        : "bg-zinc-800 text-zinc-500"
                                )}
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        </div>
                    </div>
                </div>
                <p className="mt-4 text-center text-[10px] text-zinc-600 font-medium tracking-wide">
                    Aayushi can make mistakes. Check important info.
                </p>
            </div>
        </div>
    );
};
