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
            <div className="mb-12 relative group cursor-default">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse" />
                <div className="flex items-center gap-4 relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1e1e24] to-[#121215] border border-white/10 shadow-2xl flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <span className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/50">
                        Aayushi
                    </span>
                </div>
            </div>

            {/* Input Container */}
            <div className="w-full relative group max-w-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative bg-[#09090b]/80 backdrop-blur-xl border border-[#27272a] rounded-[24px] p-2 flex items-center shadow-2xl transition-all focus-within:border-[#4361ee]/50 focus-within:ring-1 focus-within:ring-[#4361ee]/20 group-hover:border-white/10">
                    <div className="pl-5 py-3 flex-1">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="How can I help you today?"
                            className="w-full bg-transparent border-none outline-none text-lg text-white placeholder:text-[#52525b] font-light"
                            autoFocus
                        />
                    </div>

                    <div className="flex items-center gap-2 pr-2">
                        <button className="p-2.5 rounded-xl hover:bg-white/5 text-[#a1a1aa] hover:text-white transition-all duration-200">
                            <Mic className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Pills */}
            <div className="mt-10 flex flex-wrap gap-3 justify-center max-w-2xl">
                {[
                    { icon: <Search className="w-3.5 h-3.5" />, label: "DeepSearch" },
                    { icon: <ImageIcon className="w-3.5 h-3.5" />, label: "Generate Image" },
                    { icon: <Users className="w-3.5 h-3.5" />, label: "Brainstorm" },
                    { icon: <MessageCircle className="w-3.5 h-3.5" />, label: "Chat" },
                ].map((action, idx) => (
                    <button
                        key={idx}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 rounded-xl text-sm text-[#a1a1aa] hover:text-white transition-all hover:-translate-y-0.5"
                    >
                        {action.icon}
                        <span>{action.label}</span>
                    </button>
                ))}
            </div>

            <div className="mt-12 text-[#3f3f46] text-xs font-medium tracking-wide">
                Aayushi can make mistakes. Verify important information.
            </div>
        </div>
    );
};


