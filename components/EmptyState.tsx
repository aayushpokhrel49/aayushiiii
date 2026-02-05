import React from "react";
import { Mic, Search, ChevronDown, Sparkles, Image as ImageIcon, Users, MessageCircle } from "lucide-react";

interface EmptyStateProps {
    onSend: (message: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSend }) => {
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
        <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto px-4 w-full">
            {/* Logo */}
            <div className="mb-12">
                <div className="flex items-center gap-3">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 22H22L12 2Z" fill="white" />
                        {/* Simple geometric logo placeholder */}
                    </svg>
                    <span className="text-4xl font-bold tracking-tight text-white">Grok</span>
                </div>
            </div>

            {/* Input Container */}
            <div className="w-full relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative bg-[#101010] border border-[#2c2c2e] rounded-[32px] p-2 flex items-center shadow-2xl transition-all focus-within:border-[#4361ee]/50 focus-within:bg-[#151515]">
                    <div className="pl-6 py-4 flex-1">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="How can I help you today?"
                            className="w-full bg-transparent border-none outline-none text-lg text-white placeholder:text-[#52525b] font-medium"
                            autoFocus
                        />
                    </div>

                    <div className="flex items-center gap-2 pr-2">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#27272a] text-[#a1a1aa] hover:text-white transition-colors text-sm font-medium">
                            <Sparkles className="w-4 h-4" />
                            <span>Expert</span>
                            <ChevronDown className="w-3 h-3 opacity-60" />
                        </button>

                        <button className="p-3 rounded-full bg-[#1c1c1e] hover:bg-white hover:text-black text-white transition-all duration-200">
                            <Mic className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Pills */}
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <ActionPill icon={<Search className="w-4 h-4" />} label="DeepSearch" />
                <ActionPill icon={<ImageIcon className="w-4 h-4" />} label="Imagine" />
                <ActionPill icon={<Users className="w-4 h-4" />} label="Pick Personas" />
                <ActionPill icon={<MessageCircle className="w-4 h-4" />} label="Voice Chat" />
            </div>

            <div className="mt-12 text-[#3f3f46] text-xs">
                Grok can make mistakes. Verify important information.
            </div>
        </div>
    );
};

const ActionPill = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <button className="flex items-center gap-2 px-4 py-2 bg-[#101010] border border-[#27272a] hover:bg-[#1c1c1e] rounded-full text-sm text-[#a1a1aa] hover:text-white transition-all">
        {icon}
        <span>{label}</span>
    </button>
);
