"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    MessageSquare,
    Trash2,
    LogOut,
    User as UserIcon,
    Settings,
    Search,
    PenSquare,
    Mic,
    Box,
    History,
    Sparkles
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Chat {
    chatId: string;
    title: string;
}

interface SidebarProps {
    chats: Chat[];
    currentChatId: string | null;
    onNewChat: () => void;
    onSelectChat: (id: string) => void;
    onDeleteChat: (id: string) => void;
    onClearHistory: () => void;
    isOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    chats,
    currentChatId,
    onNewChat,
    onSelectChat,
    onDeleteChat,
    onClearHistory,
    isOpen = false,
    onClose,
}) => {
    const { user, signOut } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    return (
        <>
            {/* Mobile Overlay (Premium Blur) */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/40 backdrop-blur-md z-40 md:hidden transition-opacity duration-500",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar Content */}
            <aside className={cn(
                "bg-background/95 backdrop-blur-2xl border-r border-border flex flex-col items-center py-6 h-full transition-all duration-300 ease-in-out z-50",
                "fixed inset-y-0 left-0 w-20 md:relative md:translate-x-0",
                isOpen ? "translate-x-0 w-72 items-stretch px-3" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="mb-10 flex justify-center">
                    <button
                        onClick={onNewChat}
                        className="relative w-12 h-12 flex items-center justify-center group"
                    >
                        <div className="relative w-11 h-11 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-105 transition-all duration-300 active:scale-95 border border-primary/20">
                            <Sparkles className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                    </button>
                </div>

                {/* Main Action Pill */}
                <div className="px-2 mb-8">
                    <button
                        onClick={onNewChat}
                        className={cn(
                            "flex items-center gap-3 p-3.5 bg-muted/50 hover:bg-muted rounded-2xl text-foreground transition-all duration-300 group relative w-full border border-border",
                            !isOpen && "justify-center"
                        )}
                        title="New Chat"
                    >
                        <Plus className="w-5 h-5 flex-shrink-0 text-primary group-hover:rotate-90 transition-transform duration-300" />
                        {isOpen && <span className="font-semibold text-xs tracking-tight">New Chat</span>}
                        {!isOpen && (
                            <div className="absolute left-20 bg-background border border-border text-[10px] font-medium tracking-tight px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-50 pointer-events-none shadow-xl">
                                New Chat
                            </div>
                        )}
                    </button>
                </div>

                {/* History Section */}
                <div className="flex-1 w-full overflow-hidden flex flex-col">
                    {isOpen && (
                        <div className="px-5 mb-4 flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">History</span>
                            <button
                                onClick={onClearHistory}
                                className="p-1.5 text-muted-foreground hover:text-red-500 transition-all rounded-lg hover:bg-red-500/10"
                                title="Clear History"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto px-2 space-y-1.5 custom-scrollbar pb-6">
                        {chats.map((chat) => (
                            <button
                                key={chat.chatId}
                                onClick={() => onSelectChat(chat.chatId)}
                                className={cn(
                                    "w-full flex items-center gap-3.5 p-3 rounded-2xl transition-all duration-300 group relative border",
                                    currentChatId === chat.chatId
                                        ? "bg-white/5 text-white border-white/10 shadow-xl"
                                        : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5 border-transparent",
                                    !isOpen && "justify-center"
                                )}
                            >
                                <div className={cn(
                                    "w-2 h-2 rounded-full flex-shrink-0",
                                    currentChatId === chat.chatId ? "bg-[#4361ee] shadow-[0_0_8px_#4361ee]" : "bg-zinc-800"
                                )} />
                                {isOpen && (
                                    <span className="text-xs font-medium tracking-tight truncate pr-6 text-left flex-1">{chat.title}</span>
                                )}

                                {isOpen && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteChat(chat.chatId);
                                        }}
                                        className="absolute right-3 opacity-0 group-hover:opacity-100 p-1.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}

                                {!isOpen && (
                                    <div className="absolute left-20 bg-background border border-border text-[10px] font-medium tracking-tight px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-50 pointer-events-none shadow-xl">
                                        {chat.title}
                                    </div>
                                )}
                            </button>
                        ))}

                        {chats.length === 0 && isOpen && (
                            <div className="px-5 py-12 text-center border-2 border-dashed border-white/5 rounded-[32px] mx-2">
                                <Box className="w-8 h-8 text-zinc-800 mx-auto mb-4" />
                                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest leading-relaxed">Your digital mind is clear</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Profile Section */}
                <div className="mt-auto flex flex-col gap-8 items-center w-full pb-2">
                    {user && (
                        <div className="relative group w-full flex justify-center px-4">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className={cn(
                                    "p-1 rounded-[20px] overflow-hidden w-12 h-12 ring-1 ring-white/5 hover:ring-[#4361ee]/50 transition-all duration-500 shadow-2xl bg-[#121215]",
                                    isProfileOpen && "ring-[#4361ee]"
                                )}
                            >
                                {user.photoURL ? (
                                    <Image
                                        src={user.photoURL}
                                        alt="User"
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                                        <UserIcon className="w-5 h-5 text-zinc-500" />
                                    </div>
                                )}
                            </button>

                            {/* Ultra-Premium Profile Dropdown */}
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="fixed inset-0 z-40 bg-black/20"
                                            onClick={() => setIsProfileOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: 10, x: isOpen ? 0 : 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0, x: isOpen ? 0 : 20 }}
                                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                            className="absolute bottom-full left-4 mb-4 w-60 bg-background border border-border rounded-2xl shadow-xl p-2 z-50 overflow-hidden"
                                        >
                                            <div className="px-4 py-4 mb-2 bg-muted rounded-xl border border-border">
                                                <p className="text-xs font-semibold text-foreground truncate">{user.displayName || 'User'}</p>
                                                <p className="text-[10px] text-muted-foreground truncate mt-1">{user.email}</p>
                                            </div>

                                            <div className="grid grid-cols-1 gap-1">
                                                <button
                                                    onClick={() => {
                                                        setIsProfileOpen(false);
                                                        window.location.href = '/profile';
                                                    }}
                                                    className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-3 transition-all"
                                                >
                                                    <UserIcon className="w-4 h-4 text-[#4361ee]" />
                                                    Identity
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setIsProfileOpen(false);
                                                        window.location.href = '/settings';
                                                    }}
                                                    className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-3 transition-all"
                                                >
                                                    <Settings className="w-4 h-4 text-[#4361ee]" />
                                                    Core Config
                                                </button>

                                                <div className="h-px bg-white/5 my-1 mx-2" />

                                                <button
                                                    onClick={() => signOut()}
                                                    className="w-full text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-xl flex items-center gap-3 transition-all"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};
