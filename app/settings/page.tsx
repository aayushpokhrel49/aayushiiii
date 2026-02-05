"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ArrowLeft, Monitor, Moon, Sun, Globe, Bell, Shield, Smartphone, User as UserIcon, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function SettingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [theme, setTheme] = useState("dark");
    const [notifications, setNotifications] = useState(true);

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

    const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 px-1">{title}</h2>
            <div className="bg-[#121214] border border-[#27272a] rounded-2xl overflow-hidden divide-y divide-white/5">
                {children}
            </div>
        </div>
    );

    const Item = ({ icon, label, description, action }: any) => (
        <div className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400">
                    {icon}
                </div>
                <div>
                    <h3 className="font-medium text-sm text-zinc-200">{label}</h3>
                    {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
                </div>
            </div>
            <div>{action}</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col items-center py-10 px-4">
            <div className="w-full max-w-2xl">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Chat
                    </Link>
                    <h1 className="text-2xl font-bold">Settings</h1>
                </div>

                <Section title="Appearance">
                    <Item
                        icon={<Moon className="w-5 h-5" />}
                        label="Theme"
                        description="Select your preferred interface theme"
                        action={
                            <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                                {[
                                    { id: 'light', icon: Sun },
                                    { id: 'system', icon: Monitor },
                                    { id: 'dark', icon: Moon }
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTheme(t.id)}
                                        className={cn(
                                            "w-8 h-8 flex items-center justify-center rounded-md transition-all",
                                            theme === t.id ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"
                                        )}
                                    >
                                        <t.icon className="w-4 h-4" />
                                    </button>
                                ))}
                            </div>
                        }
                    />
                    <Item
                        icon={<Globe className="w-5 h-5" />}
                        label="Language"
                        description="Currently set to English (US)"
                        action={<span className="text-sm text-zinc-500 font-medium">English</span>}
                    />
                </Section>

                <Section title="Preferences">
                    <Item
                        icon={<Bell className="w-5 h-5" />}
                        label="Notifications"
                        description="Receive alerts about new features"
                        action={
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={cn(
                                    "w-11 h-6 rounded-full relative transition-colors duration-300",
                                    notifications ? "bg-primary" : "bg-zinc-700"
                                )}
                            >
                                <span className={cn(
                                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm",
                                    notifications ? "left-[22px]" : "left-1"
                                )} />
                            </button>
                        }
                    />
                    <Item
                        icon={<Smartphone className="w-5 h-5" />}
                        label="Haptic Feedback"
                        description="Vibrate on mobile interactions"
                        action={<span className="text-xs text-zinc-500">On</span>}
                    />
                </Section>

                <Section title="Privacy & Security">
                    <Item
                        icon={<Shield className="w-5 h-5" />}
                        label="Data Controls"
                        description="Manage your chat history and data"
                        action={<button className="text-xs font-medium text-primary hover:underline">Manage</button>}
                    />
                </Section>

                <Section title="Developer Info">
                    <Item
                        icon={<UserIcon className="w-5 h-5" />}
                        label="Developer"
                        description="Created and maintained by"
                        action={<span className="text-sm text-zinc-300 font-medium">Aayush Pokhrel</span>}
                    />
                    <Item
                        icon={<Globe className="w-5 h-5" />}
                        label="Website"
                        description="Visit the official website"
                        action={
                            <a
                                href="https://aayushhpokhrel.com.np"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                            >
                                <span>aayushhpokhrel.com.np</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        }
                    />
                    <Item
                        icon={<Mail className="w-5 h-5" />}
                        label="Email"
                        description="Get in touch for support or feedback"
                        action={
                            <a
                                href="mailto:info@aayushhpokhrel.com.np"
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                            >
                                <span>info@aayushhpokhrel.com.np</span>
                                <Mail className="w-3 h-3" />
                            </a>
                        }
                    />
                </Section>

                <div className="text-center mt-12 mb-8">
                    <p className="text-xs text-zinc-600">Aayushi v1.0.0 • Built with ❤️</p>
                </div>
            </div>
        </div>
    );
}
