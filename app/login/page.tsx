"use client";

import React, { useState } from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, Chrome, UserPlus } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const getFriendlyErrorMessage = (errorCode: string) => {
        switch (errorCode) {
            case "auth/invalid-email":
                return "Invalid email address format.";
            case "auth/user-disabled":
                return "This user account has been disabled.";
            case "auth/user-not-found":
                return "No account found with this email.";
            case "auth/wrong-password":
                return "Incorrect password. Please try again.";
            case "auth/email-already-in-use":
                return "An account already exists with this email.";
            case "auth/weak-password":
                return "Password should be at least 6 characters.";
            case "auth/popup-closed-by-user":
                return "Sign-in popup was closed before completion.";
            default:
                return "Authentication failed. Please try again.";
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            router.push("/");
        } catch (err: any) {
            setError(getFriendlyErrorMessage(err.code || ""));
            setIsLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        setError("");
        setIsLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push("/");
        } catch (err: any) {
            setError(getFriendlyErrorMessage(err.code || ""));
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-white p-4">
            <div className="w-full max-w-md bg-[#18181b] border border-[#27272a] rounded-2xl p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-[#4361ee] rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(67,97,238,0.3)]">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Aayushi</h1>
                    <p className="text-[#a1a1aa] mt-2 text-center">
                        {isLogin ? "Welcome back to your AI assistant" : "Join Aayushi today"}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <div className="w-1 h-1 bg-current rounded-full" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#a1a1aa] mb-1.5 ml-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#71717a]" />
                            <input
                                type="email"
                                required
                                disabled={isLoading}
                                className="w-full bg-[#1c1c21] border border-[#27272a] rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#4361ee]/50 focus:border-[#4361ee] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#a1a1aa] mb-1.5 ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#71717a]" />
                            <input
                                type="password"
                                required
                                disabled={isLoading}
                                className="w-full bg-[#1c1c21] border border-[#27272a] rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#4361ee]/50 focus:border-[#4361ee] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#4361ee] hover:bg-[#3450d9] text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                                {isLogin ? "Sign In" : "Create Account"}
                            </>
                        )}
                    </button>
                </form>

                <div className="relative my-8 text-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#27272a]"></div>
                    </div>
                    <span className="relative px-4 bg-[#18181b] text-[#71717a] text-sm">
                        Or continue with
                    </span>
                </div>

                <button
                    onClick={signInWithGoogle}
                    disabled={isLoading}
                    className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                        <>
                            <Chrome className="w-5 h-5" />
                            Google
                        </>
                    )}
                </button>

                <p className="mt-8 text-center text-[#a1a1aa] text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                        }}
                        disabled={isLoading}
                        className="text-[#4361ee] hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLogin ? "Sign up" : "Sign in"}
                    </button>
                </p>
            </div>
        </div>
    );
}
