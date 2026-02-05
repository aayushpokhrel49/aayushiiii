"use client";

import React from "react";
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
    History
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
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar Content */}
            <aside className={cn(
                "bg-[#000000] border-r border-[#1c1c1e] flex flex-col items-center py-4 h-full transition-all duration-300 ease-in-out z-50",
                "fixed inset-y-0 left-0 w-16 md:relative md:translate-x-0",
                isOpen ? "translate-x-0 w-64 items-stretch px-2" : "-translate-x-full md:translate-x-0"
            )}>
                {/* Logo / Home */}
                <div className="mb-8 flex justify-center">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-black font-bold text-xl">
                        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 22H22L12 2Z" fill="currentColor" />
                            {/* Placeholder geometric logo */}
                        </svg>
                    </div>
                </div>

                {/* Main Nav Icons */}
                <div className="flex-1 flex flex-col gap-6 w-full items-center">
                    <button
                        onClick={onNewChat}
                        className="p-3 bg-[#1c1c1e] hover:bg-[#2c2c2e] rounded-xl text-white transition-all group relative"
                        title="New Chat"
                    >
                        <Plus className="w-6 h-6" />
                        {!isOpen && (
                            <span className="absolute left-14 bg-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                New Chat
                            </span>
                        )}
                        {isOpen && <span className="ml-3 font-medium">New Chat</span>}
                    </button>

                    <button className="p-3 text-[#8e8e93] hover:text-white transition-all group relative">
                        <Search className="w-6 h-6" />
                    </button>

                    <button className="p-3 text-[#8e8e93] hover:text-white transition-all group relative">
                        <PenSquare className="w-6 h-6" />
                    </button>
                </div>

                {/* Bottom Actions */}
                <div className="mt-auto flex flex-col gap-6 items-center w-full pb-4">
                    {user && (
                        <div className="relative group">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="p-1 rounded-full overflow-hidden w-8 h-8 ring-2 ring-[#2c2c2e] hover:ring-[#4361ee] transition-all"
                            >
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                        <UserIcon className="w-4 h-4 text-zinc-400" />
                                    </div>
                                )}
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsProfileOpen(false)}
                                    />
                                    <div className="absolute bottom-full left-0 mb-3 w-48 bg-[#18181b] border border-[#27272a] rounded-xl shadow-2xl py-1.5 z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2">

                                        <div className="px-3 py-2 border-b border-white/5 mb-1">
                                            <p className="text-xs font-semibold text-white truncate">{user.displayName || 'User'}</p>
                                            <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                window.location.href = '/profile';
                                            }}
                                            className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
                                        >
                                            <UserIcon className="w-3.5 h-3.5" />
                                            Profile
                                        </button>

                                        <button
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                window.location.href = '/settings';
                                            }}
                                            className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
                                        >
                                            <Settings className="w-3.5 h-3.5" />
                                            Settings
                                        </button>

                                        <div className="h-px bg-white/5 my-1" />

                                        <button
                                            onClick={() => signOut()}
                                            className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                                        >
                                            <LogOut className="w-3.5 h-3.5" />
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};
