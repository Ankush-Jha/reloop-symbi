'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import DemoManager from '@/lib/demo-manager';

export default function SettingsPage() {
    const [isDemoMode, setIsDemoMode] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setIsDemoMode(DemoManager.isEnabled);
        setMounted(true);
    }, []);

    const toggleDemoMode = () => {
        DemoManager.setMode(!isDemoMode);
        setIsDemoMode(!isDemoMode);
    };

    const isDark = theme === 'dark';

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="px-5 pt-6 pb-4 flex items-center gap-4">
                <Link
                    href="/"
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-dark-surface rounded-xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm"
                >
                    <span className="material-symbols-outlined text-dark dark:text-white">arrow_back</span>
                </Link>
                <h1 className="font-black text-dark dark:text-white text-xl">Settings</h1>
            </header>

            <div className="px-5 pb-28 space-y-5">
                {/* Account Section */}
                <section>
                    <p className="text-sm font-bold text-dark/60 dark:text-white/60 mb-3">Account</p>
                    <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm overflow-hidden">
                        <Link href="/profile" className="flex items-center gap-4 p-4 border-b-2 border-gray-100 dark:border-gray-700">
                            <div className="w-10 h-10 bg-card-blue rounded-xl border-2 border-dark dark:border-gray-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-dark dark:text-white">person</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-dark dark:text-white">Profile</p>
                                <p className="text-xs text-dark/60 dark:text-white/50">View and edit</p>
                            </div>
                            <span className="material-symbols-outlined text-dark/40 dark:text-white/40">chevron_right</span>
                        </Link>
                        <Link href="/notifications" className="flex items-center gap-4 p-4">
                            <div className="w-10 h-10 bg-card-pink rounded-xl border-2 border-dark dark:border-gray-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-dark dark:text-white">notifications</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-dark dark:text-white">Notifications</p>
                                <p className="text-xs text-dark/60 dark:text-white/50">Manage alerts</p>
                            </div>
                            <span className="material-symbols-outlined text-dark/40 dark:text-white/40">chevron_right</span>
                        </Link>
                    </div>
                </section>

                {/* Appearance Section */}
                <section>
                    <p className="text-sm font-bold text-dark/60 dark:text-white/60 mb-3">Appearance</p>
                    <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-card-blue rounded-xl border-2 border-dark dark:border-gray-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-dark dark:text-white">
                                {mounted && isDark ? 'dark_mode' : 'light_mode'}
                            </span>
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-dark dark:text-white">Dark Mode</p>
                            <p className="text-xs text-dark/60 dark:text-white/50">
                                {mounted ? (isDark ? 'On' : 'Off') : '...'}
                            </p>
                        </div>
                        <label className="relative inline-flex cursor-pointer">
                            <input
                                type="checkbox"
                                checked={mounted && isDark}
                                onChange={() => setTheme(isDark ? 'light' : 'dark')}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-8 bg-gray-200 dark:bg-gray-700 border-2 border-dark dark:border-gray-500 rounded-full peer-checked:bg-primary after:content-[''] after:absolute after:top-1 after:left-1 after:bg-dark after:border-2 after:border-dark after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-6 peer-checked:after:bg-white peer-checked:after:border-white" />
                        </label>
                    </div>
                </section>

                {/* Developer Section */}
                <section>
                    <p className="text-sm font-bold text-dark/60 dark:text-white/60 mb-3">Developer</p>
                    <div className="bg-card-yellow rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-white dark:bg-dark-surface rounded-xl border-2 border-dark dark:border-gray-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-dark dark:text-white">science</span>
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-dark dark:text-white">Demo Mode</p>
                            <p className="text-xs text-dark/60 dark:text-white/50">Mock data only</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isDemoMode}
                                onChange={toggleDemoMode}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-8 bg-white dark:bg-gray-700 border-2 border-dark dark:border-gray-500 rounded-full peer-checked:bg-primary after:content-[''] after:absolute after:top-1 after:left-1 after:bg-dark after:border-2 after:border-dark after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-6 peer-checked:after:bg-white peer-checked:after:border-white" />
                        </label>
                    </div>
                </section>

                {/* About Section */}
                <section>
                    <p className="text-sm font-bold text-dark/60 dark:text-white/60 mb-3">About</p>
                    <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm overflow-hidden">
                        <Link href="/help" className="flex items-center gap-4 p-4 border-b-2 border-gray-100 dark:border-gray-700">
                            <div className="w-10 h-10 bg-card-green rounded-xl border-2 border-dark dark:border-gray-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-dark dark:text-white">help</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-dark dark:text-white">Help & Support</p>
                                <p className="text-xs text-dark/60 dark:text-white/50">FAQ & contact</p>
                            </div>
                            <span className="material-symbols-outlined text-dark/40 dark:text-white/40">chevron_right</span>
                        </Link>
                        <Link href="/privacy" className="flex items-center gap-4 p-4 border-b-2 border-gray-100 dark:border-gray-700">
                            <div className="w-10 h-10 bg-card-blue rounded-xl border-2 border-dark dark:border-gray-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-dark dark:text-white">privacy_tip</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-dark dark:text-white">Privacy Policy</p>
                                <p className="text-xs text-dark/60 dark:text-white/50">Your data rights</p>
                            </div>
                            <span className="material-symbols-outlined text-dark/40 dark:text-white/40">chevron_right</span>
                        </Link>
                        <div className="flex items-center gap-4 p-4">
                            <div className="w-10 h-10 bg-card-yellow rounded-xl border-2 border-dark dark:border-gray-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-dark dark:text-white">info</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-dark dark:text-white">Version</p>
                                <p className="text-xs text-dark/60 dark:text-white/50">2.0.0 (Next.js)</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Logout */}
                <button
                    onClick={() => {
                        if (confirm('Are you sure you want to log out? This will reset the demo data.')) {
                            DemoManager.resetAll();
                            window.location.href = '/';
                        }
                    }}
                    className="w-full bg-card-coral rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 flex items-center gap-4 active:scale-95 transition-transform"
                >
                    <div className="w-10 h-10 bg-white dark:bg-dark-surface rounded-xl border-2 border-dark dark:border-gray-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-dark dark:text-white">logout</span>
                    </div>
                    <p className="font-bold text-dark dark:text-white">Log Out</p>
                </button>
            </div>
        </div>
    );
}
