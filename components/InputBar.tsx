"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Globe, Languages, Command, Mic } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputBarProps {
    onSend: (message: string, useWeb: boolean, language: string) => void;
    onVoiceClick: () => void;
    isLoading: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({ onSend, onVoiceClick, isLoading }) => {
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
        <div className="w-full relative py-6">
            <div className="max-w-3xl mx-auto relative px-4">
                <div className="relative bg-[#121215]/80 backdrop-blur-3xl border border-white/5 rounded-[32px] flex flex-col shadow-[0_0_80px_-20px_rgba(0,0,0,0.8)] transition-all duration-500 focus-within:border-[#4361ee]/30 focus-within:shadow-[0_0_80px_-20px_rgba(67,97,238,0.2)] group hover:border-white/10 overflow-hidden">

                    {/* Dynamic Interaction Glow (Subtle) */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#4361ee]/0 via-transparent to-transparent group-focus-within:from-[#4361ee]/5 transition-all duration-1000 pointer-events-none" />

                    {/* Textarea Area */}
                    <div className="relative flex items-center p-3">
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            className="w-full bg-transparent border-none focus:ring-0 text-zinc-100 placeholder-zinc-500 py-3 px-5 resize-none max-h-[220px] overflow-y-auto custom-scrollbar text-lg font-light leading-relaxed"
                            placeholder="Message Aayushi..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Controls Dock */}
                    <div className="flex items-center justify-between px-4 pb-4">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setUseWeb(!useWeb)}
                                className={cn(
                                    "px-4 py-2 rounded-2xl flex items-center gap-2.5 transition-all text-xs font-black uppercase tracking-widest border",
                                    useWeb
                                        ? "bg-[#4361ee] text-white border-white/10 shadow-lg shadow-[#4361ee]/20"
                                        : "bg-white/5 text-zinc-500 border-white/5 hover:bg-white/10 hover:text-zinc-300"
                                )}
                            >
                                <Globe className="w-4 h-4" />
                                <span className="hidden sm:inline">Search</span>
                            </button>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowLanguages(!showLanguages)}
                                    className="px-4 py-2 rounded-2xl flex items-center gap-2.5 transition-all text-xs font-black uppercase tracking-widest bg-white/5 text-zinc-500 border border-white/5 hover:bg-white/10 hover:text-zinc-300"
                                >
                                    <Languages className="w-4 h-4" />
                                    <span className="hidden sm:inline">{language}</span>
                                </button>

                                {showLanguages && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowLanguages(false)}
                                        />
                                        <div className="absolute bottom-full left-0 mb-4 w-48 bg-[#121215]/95 backdrop-blur-2xl border border-white/10 rounded-2xl py-2 z-50 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-3 zoom-in-95 duration-300 transition-all">
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang}
                                                    className={cn(
                                                        "w-full text-left px-5 py-3 text-xs font-black uppercase tracking-widest transition-colors hover:bg-white/5",
                                                        language === lang ? "text-[#4361ee] bg-white/5" : "text-zinc-500"
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
                            <button
                                type="button"
                                onClick={onVoiceClick}
                                className="p-3.5 rounded-2xl bg-white/5 text-zinc-400 border border-white/5 hover:bg-white/10 hover:text-[#4361ee] transition-all active:scale-90 group relative flex items-center justify-center"
                                title="Voice Interaction"
                            >
                                <Mic className="w-5 h-5" />
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#4361ee] rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity ring-4 ring-black" />
                            </button>

                            <div className="hidden lg:flex items-center gap-2 text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em] select-none mr-1">
                                <Command className="w-3.5 h-3.5" />
                                <span>Send</span>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={!input.trim() || isLoading}
                                className={cn(
                                    "p-3.5 rounded-2xl transition-all duration-500 disabled:opacity-20 disabled:scale-90 disabled:grayscale",
                                    input.trim()
                                        ? "bg-white text-[#4361ee] shadow-2xl shadow-[#4361ee]/20 hover:scale-105 active:scale-95"
                                        : "bg-zinc-900 text-zinc-600 border border-white/5"
                                )}
                            >
                                <Send className="w-5 h-5 ml-0.5" />
                            </button>
                        </div>
                    </div>
                </div>
                <p className="mt-5 text-center text-[10px] text-zinc-600 font-black tracking-[0.25em] uppercase opacity-40">
                    Aayushi Intelligence Core • 2026 Edition
                </p>
            </div>
        </div>
    );
};
