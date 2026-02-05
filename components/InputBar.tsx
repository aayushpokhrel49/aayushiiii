"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Globe, Languages, Command, Mic } from "lucide-react";

interface InputBarProps {
    onSend: (message: string, useWeb: boolean, language: string) => void;
    onVoiceClick: () => void;
    isLoading: boolean;
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
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
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
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
                <div className="relative bg-muted/50 backdrop-blur-3xl border border-border rounded-2xl flex flex-col shadow-sm transition-all duration-300 focus-within:border-primary/30 group hover:border-border overflow-hidden">
                    {/* Textarea Area */}
                    <div className="relative flex items-center p-3">
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            className="w-full bg-transparent border-none focus:ring-0 text-foreground placeholder-muted-foreground py-3 px-5 resize-none max-h-[220px] overflow-y-auto custom-scrollbar text-base font-normal leading-relaxed"
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
                                    "px-4 py-2 rounded-xl flex items-center gap-2 transition-all text-xs font-semibold tracking-tight border",
                                    useWeb
                                        ? "bg-primary text-primary-foreground border-primary/20 shadow-md"
                                        : "bg-muted text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                                )}
                            >
                                <Globe className="w-4 h-4" />
                                <span className="hidden sm:inline">Search</span>
                            </button>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowLanguages(!showLanguages)}
                                    className="px-4 py-2 rounded-xl flex items-center gap-2 transition-all text-xs font-semibold tracking-tight bg-muted text-muted-foreground border border-border hover:bg-accent hover:text-foreground"
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
                                        <div className="absolute bottom-full left-0 mb-4 w-48 bg-background border border-border rounded-xl py-2 z-50 overflow-hidden shadow-xl">
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang}
                                                    className={cn(
                                                        "w-full text-left px-5 py-3 text-xs font-semibold tracking-tight transition-colors hover:bg-muted",
                                                        language === lang ? "text-primary bg-muted" : "text-muted-foreground"
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
                                className="p-3.5 rounded-xl bg-muted text-muted-foreground border border-border hover:bg-accent hover:text-primary transition-all active:scale-95 group relative flex items-center justify-center"
                                title="Voice Control"
                            >
                                <Mic className="w-5 h-5" />
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity ring-4 ring-background" />
                            </button>

                            <div className="hidden lg:flex items-center gap-2 text-muted-foreground text-[9px] font-semibold uppercase tracking-widest select-none mr-1">
                                <Command className="w-3.5 h-3.5" />
                                <span>Send</span>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={!input.trim() || isLoading}
                                className={cn(
                                    "p-3.5 rounded-xl transition-all duration-300 disabled:opacity-50",
                                    input.trim()
                                        ? "bg-primary text-primary-foreground shadow-md hover:scale-105 active:scale-95"
                                        : "bg-muted text-muted-foreground border border-border"
                                )}
                            >
                                <Send className="w-5 h-5 ml-0.5" />
                            </button>
                        </div>
                    </div>
                </div>
                <p className="mt-5 text-center text-[10px] text-muted-foreground font-medium tracking-widest uppercase opacity-60">
                    Aayushi AI Assistant
                </p>
            </div>
        </div>
    );
};
