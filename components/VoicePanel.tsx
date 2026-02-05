"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Send, Sparkles, RefreshCw, MicOff } from "lucide-react";

interface VoicePanelProps {
    isOpen: boolean;
    onClose: () => void;
    onFinalTranscript: (transcript: string) => void;
}

export const VoicePanel: React.FC<VoicePanelProps> = ({ isOpen, onClose, onFinalTranscript }) => {
    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;

                recognitionRef.current.onresult = (event: any) => {
                    const currentTranscript = Array.from(event.results)
                        .map((result: any) => result[0].transcript)
                        .join("");
                    setTranscript(currentTranscript);
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    setIsListening(false);
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };
            }
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            startListening();
        } else {
            stopListening();
            setTranscript("");
        }
    }, [isOpen]);

    const startListening = () => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                console.error("Failed to start recognition", e);
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (e) { }
            setIsListening(false);
        }
    };

    const handleSend = () => {
        if (transcript.trim()) {
            onFinalTranscript(transcript);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-6 text-white overflow-hidden"
                >
                    {/* Dynamic Ambient Background Glows */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.1, 0.2, 0.1],
                                rotate: [0, 45, 0]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#4361ee]/20 to-[#4cc9f0]/10 rounded-full blur-[140px]"
                        />
                    </div>

                    {/* Header Controls */}
                    <div className="absolute top-8 left-0 right-0 px-8 flex justify-between items-center z-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4361ee] to-[#4cc9f0] border border-white/20 flex items-center justify-center shadow-lg shadow-[#4361ee]/40">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black tracking-widest uppercase">Aayushi</span>
                                <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-0.5">Voice Interaction</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all active:scale-90 group"
                        >
                            <X className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                        </button>
                    </div>

                    <div className="w-full max-w-4xl flex flex-col items-center text-center relative z-10">
                        {/* Status/Wave Visualizer */}
                        <div className="relative mb-24 flex items-center justify-center">
                            {/* Wave Rings Layer */}
                            <AnimatePresence>
                                {isListening && (
                                    <>
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: [1, 1.8 + i * 0.4], opacity: [0.2 - i * 0.05, 0] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: i * 0.8 }}
                                                className="absolute w-40 h-40 border-2 border-[#4361ee] rounded-full"
                                            />
                                        ))}
                                    </>
                                )}
                            </AnimatePresence>

                            {/* Center Visualizer Waves */}
                            <div className="absolute inset-0 flex items-center justify-center gap-2 h-64 pointer-events-none">
                                {[...Array(24)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={isListening ? {
                                            height: [16, Math.random() * 120 + 40, 16],
                                            opacity: [0.3, 1, 0.3],
                                            backgroundColor: ["#4361ee", "#4cc9f0", "#4361ee"]
                                        } : { height: 8, opacity: 0.15 }}
                                        transition={{
                                            duration: 0.5 + Math.random() * 0.3,
                                            repeat: Infinity,
                                            delay: i * 0.03,
                                            ease: "easeInOut"
                                        }}
                                        className="w-1.5 rounded-full bg-[#4361ee]"
                                    />
                                ))}
                            </div>

                            {/* Main Mic Interaction Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={isListening ? stopListening : startListening}
                                className={cn(
                                    "relative z-20 w-32 h-32 rounded-[40px] flex items-center justify-center transition-all duration-1000 shadow-2xl overflow-hidden group border",
                                    isListening
                                        ? "bg-white text-[#4361ee] ring-8 ring-[#4361ee]/20 border-white"
                                        : "bg-[#121215] text-zinc-500 border-white/5"
                                )}
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#4361ee]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <AnimatePresence mode="wait">
                                    {isListening ? (
                                        <motion.div
                                            key="mic-on"
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.5, opacity: 0 }}
                                        >
                                            <Mic className="w-12 h-12" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="mic-off"
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.5, opacity: 0 }}
                                        >
                                            <MicOff className="w-12 h-12" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>

                        {/* Large Transcript Display */}
                        <div className="w-full flex-1 flex flex-col items-center px-8 relative min-h-[160px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={transcript || "empty"}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    className="max-w-3xl w-full"
                                >
                                    <p className={cn(
                                        "text-4xl md:text-6xl font-black tracking-tight leading-[1.1] transition-all duration-700",
                                        transcript ? "text-white" : "text-zinc-800"
                                    )}>
                                        {transcript || "Speak to start..."}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Footer Control Dock */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="mt-20 flex items-center justify-center gap-4 bg-white/5 p-3 rounded-[32px] border border-white/5 backdrop-blur-md"
                        >
                            <button
                                onClick={() => {
                                    setTranscript("");
                                    if (!isListening) startListening();
                                }}
                                className="group flex items-center gap-3 px-6 py-4 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-[24px] transition-all border border-transparent hover:border-white/10"
                                title="Reset"
                            >
                                <RefreshCw className="w-5 h-5 group-active:rotate-180 transition-transform duration-500" />
                                <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Reset</span>
                            </button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSend}
                                disabled={!transcript.trim()}
                                className="h-[60px] px-12 bg-white text-[#4361ee] rounded-[24px] font-black text-sm uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl hover:shadow-[#4361ee]/20 transition-all disabled:opacity-30 disabled:grayscale"
                            >
                                <Send className="w-5 h-5" />
                                <span>Proceed</span>
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
