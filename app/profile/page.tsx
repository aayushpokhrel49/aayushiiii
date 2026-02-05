"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Calendar, LogOut } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#09090b] text-white">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col items-center py-10 px-4">
            <div className="w-full max-w-2xl">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Chat
                </Link>

                <div className="bg-[#121214] border border-[#27272a] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />

                    <div className="relative pt-10 pb-4 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full p-1 bg-[#121214] ring-4 ring-[#27272a] mb-6 shadow-xl relative z-10">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <div className="w-full h-full bg-zinc-800 rounded-full flex items-center justify-center">
                                    <User className="w-10 h-10 text-zinc-400" />
                                </div>
                            )}
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight mb-2">{user.displayName || "User"}</h1>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-medium text-zinc-400">Pro Plan</span>
                        </div>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-black/20 rounded-2xl border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-zinc-500 mb-0.5">Email Address</p>
                                <p className="text-base font-semibold truncate select-all">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-black/20 rounded-2xl border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-zinc-500 mb-0.5">Member Since</p>
                                <p className="text-base font-semibold capitalize">February 2026</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/5 flex justify-between items-center">
                        <p className="text-xs text-zinc-500">User ID: {user.uid.substring(0, 8)}...</p>
                        <button
                            onClick={() => signOut()}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors font-medium text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
