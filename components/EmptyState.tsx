import React from "react";
import { motion } from "framer-motion";
import { Mic, Search, Sparkles, Image as ImageIcon, Users, MessageCircle, ArrowRight } from "lucide-react";

interface EmptyStateProps {
    onSend: (message: string) => void;
    onVoiceClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSend, onVoiceClick }) => {
    const [inputValue, setInputValue] = React.useState("");

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (inputValue.trim()) {
                onSend(inputValue);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen max-w-4xl mx-auto px-6 w-full relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        opacity: [0.05, 0.1, 0.05],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-[#4361ee]/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        opacity: [0.03, 0.08, 0.03],
                        scale: [1.1, 1, 1.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-[#4cc9f0]/10 rounded-full blur-[100px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full flex flex-col items-center relative z-10"
            >
                {/* Logo Section */}
                <div className="mb-16 flex flex-col items-center group">
                    <div className="relative mb-8">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-6 bg-gradient-to-tr from-[#4361ee]/30 to-[#4cc9f0]/20 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000"
                        />
                        <div className="relative w-24 h-24 rounded-[32px] bg-gradient-to-br from-[#4361ee] via-[#4361ee] to-[#4cc9f0] border border-white/20 shadow-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                            <Sparkles className="w-12 h-12 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                        </div>
                    </div>

                    <div className="text-center">
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-4">
                            Aayushi
                        </h1>
                        <div className="flex items-center gap-3 justify-center">
                            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#4361ee]" />
                            <span className="text-[10px] md:text-xs text-zinc-500 font-black tracking-[0.4em] uppercase">Intelligence Core</span>
                            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#4361ee]" />
                        </div>
                    </div>
                </div>

                {/* Search Interaction Dock */}
                <div className="w-full max-w-2xl relative group mb-12">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#4361ee]/20 to-[#4cc9f0]/20 rounded-[34px] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />

                    <div className="relative bg-[#121215]/80 backdrop-blur-3xl border border-white/5 rounded-[30px] p-2 flex items-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] transition-all duration-500 focus-within:border-[#4361ee]/30 focus-within:shadow-[0_0_80px_-20px_rgba(67,97,238,0.3)]">
                        <div className="pl-6 py-4 flex-1">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Initialize a new conversation..."
                                className="w-full bg-transparent border-none outline-none text-xl text-white placeholder:text-zinc-700 font-light tracking-wide"
                                autoFocus
                            />
                        </div>

                        <div className="flex items-center gap-2 pr-3">
                            <button
                                onClick={onVoiceClick}
                                className="p-3.5 rounded-2xl bg-white/5 text-zinc-400 hover:text-[#4361ee] hover:bg-white/10 transition-all active:scale-90"
                                title="Voice Activation"
                            >
                                <Mic className="w-6 h-6" />
                            </button>

                            {inputValue.trim() && (
                                <motion.button
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    onClick={() => onSend(inputValue)}
                                    className="p-3.5 rounded-2xl bg-white text-[#4361ee] shadow-xl hover:scale-105 active:scale-95 transition-all"
                                >
                                    <ArrowRight className="w-6 h-6" />
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Advanced Action Grid */}
                <div className="flex flex-wrap gap-4 justify-center max-w-2xl opacity-80 hover:opacity-100 transition-opacity">
                    {[
                        { icon: <Search className="w-4 h-4" />, label: "Nexus Search", desc: "Global data retrieval" },
                        { icon: <ImageIcon className="w-4 h-4" />, label: "Vision Lab", desc: "Generative imagery" },
                        { icon: <Users className="w-4 h-4" />, label: "Synth Mind", desc: "Expert brainstorming" },
                        { icon: <MessageCircle className="w-4 h-4" />, label: "Neural Chat", desc: "Fluent dialogue" },
                    ].map((action, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
                            className="flex flex-col items-start gap-1 px-5 py-4 bg-white/5 border border-white/5 rounded-[24px] text-left transition-all group w-[160px]"
                        >
                            <div className="p-2 bg-white/5 rounded-xl text-[#4361ee] group-hover:bg-[#4361ee] group-hover:text-white transition-colors mb-2">
                                {action.icon}
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-wider text-white">{action.label}</span>
                            <span className="text-[9px] text-zinc-500 font-bold leading-tight">{action.desc}</span>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Footer Tagline */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-12 left-0 right-0 text-center"
            >
                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.5em]">
                    Powered by Aayushi Digital Core v1.0
                </p>
            </motion.div>
        </div>
    );
};



