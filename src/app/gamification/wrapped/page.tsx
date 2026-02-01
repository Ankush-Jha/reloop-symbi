'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { WrappedStats } from '@/types';

const SLIDES = [
    { key: 'intro', bg: 'from-green-400 to-green-600' },
    { key: 'scans', bg: 'from-blue-400 to-blue-600' },
    { key: 'trades', bg: 'from-yellow-400 to-orange-500' },
    { key: 'impact', bg: 'from-green-500 to-emerald-600' },
    { key: 'rank', bg: 'from-purple-400 to-purple-600' },
    { key: 'summary', bg: 'from-gray-800 to-gray-900' },
];

export default function WrappedPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [stats, setStats] = useState<WrappedStats | null>(null);

    useEffect(() => {
        setStats(DemoManager.getMockWrapped());
    }, []);

    const next = () => setCurrentSlide(Math.min(currentSlide + 1, SLIDES.length - 1));
    const prev = () => setCurrentSlide(Math.max(currentSlide - 1, 0));

    if (!stats) return null;

    const slide = SLIDES[currentSlide];

    return (
        <div className={`min-h-screen bg-gradient-to-b ${slide.bg} flex flex-col relative overflow-hidden`} onClick={next}>
            {/* Close */}
            <div className="absolute top-6 right-5 z-20">
                <Link
                    href="/gamification"
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <span className="material-symbols-outlined text-white">close</span>
                </Link>
            </div>

            {/* Progress Bar */}
            <div className="absolute top-6 left-5 right-16 flex gap-1 z-20">
                {SLIDES.map((_, i) => (
                    <div key={i} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
                        <div className={`h-full bg-white dark:bg-dark-surface rounded-full transition-all duration-300 ${i < currentSlide ? 'w-full' : i === currentSlide ? 'w-full' : 'w-0'}`} />
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center px-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
                        className="text-center text-white w-full"
                    >
                        {currentSlide === 0 && (
                            <div>
                                <motion.p
                                    className="text-xl font-bold opacity-80 mb-4"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 0.8 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Your
                                </motion.p>
                                <motion.h1
                                    className="text-6xl font-[900] uppercase tracking-tight"
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    ReLoop<br />Wrapped
                                </motion.h1>
                                <motion.p
                                    className="text-lg opacity-80 mt-6"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 0.8 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    2025 in Review
                                </motion.p>
                            </div>
                        )}

                        {currentSlide === 1 && (
                            <div>
                                <p className="text-xl font-bold opacity-80 mb-2">You scanned</p>
                                <motion.p
                                    className="text-8xl font-[900]"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring' as const, stiffness: 200, delay: 0.3 }}
                                >
                                    {stats.totalScans}
                                </motion.p>
                                <p className="text-2xl font-bold mt-2">items this year</p>
                                <p className="text-lg opacity-70 mt-4">Most scanned: {stats.topCategory}</p>
                            </div>
                        )}

                        {currentSlide === 2 && (
                            <div>
                                <p className="text-xl font-bold opacity-80 mb-2">You completed</p>
                                <motion.p
                                    className="text-8xl font-[900]"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring' as const, stiffness: 200, delay: 0.3 }}
                                >
                                    {stats.totalTrades}
                                </motion.p>
                                <p className="text-2xl font-bold mt-2">successful trades</p>
                                <p className="text-lg opacity-70 mt-4">Earned {stats.totalCoinsEarned} ReCoins</p>
                            </div>
                        )}

                        {currentSlide === 3 && (
                            <div>
                                <p className="text-xl font-bold opacity-80 mb-2">You saved</p>
                                <motion.p
                                    className="text-8xl font-[900]"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring' as const, stiffness: 200, delay: 0.3 }}
                                >
                                    {stats.totalCo2Saved}
                                </motion.p>
                                <p className="text-2xl font-bold mt-2">kg of CO₂</p>
                                <p className="text-lg opacity-70 mt-4">That&apos;s {stats.impactEquivalent}!</p>
                            </div>
                        )}

                        {currentSlide === 4 && (
                            <div>
                                <p className="text-xl font-bold opacity-80 mb-2">Your campus rank</p>
                                <motion.p
                                    className="text-8xl font-[900]"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring' as const, stiffness: 200, delay: 0.3 }}
                                >
                                    #{stats.rank}
                                </motion.p>
                                <p className="text-2xl font-bold mt-2">out of {stats.totalUsers} students</p>
                                <p className="text-lg opacity-70 mt-4">Top {Math.round((stats.rank / stats.totalUsers) * 100)}% of all users!</p>
                            </div>
                        )}

                        {currentSlide === 5 && (
                            <div>
                                <motion.h2
                                    className="text-4xl font-[900] uppercase mb-8"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Your 2025
                                </motion.h2>
                                <div className="grid grid-cols-2 gap-4 text-left">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                                        <p className="text-3xl font-[900]">{stats.totalScans}</p>
                                        <p className="text-sm opacity-70">Scans</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                                        <p className="text-3xl font-[900]">{stats.totalTrades}</p>
                                        <p className="text-sm opacity-70">Trades</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                                        <p className="text-3xl font-[900]">{stats.totalCo2Saved}kg</p>
                                        <p className="text-sm opacity-70">CO₂ Saved</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                                        <p className="text-3xl font-[900]">{stats.badgesEarned}</p>
                                        <p className="text-sm opacity-70">Badges</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); }}
                                    className="mt-8 w-full bg-white dark:bg-dark-surface text-dark dark:text-white py-4 rounded-2xl font-[900] uppercase tracking-wider active:scale-95 transition-transform"
                                >
                                    Share My Wrapped
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Tap hint */}
            {currentSlide < SLIDES.length - 1 && (
                <motion.p
                    className="text-white/50 text-sm text-center pb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    Tap to continue
                </motion.p>
            )}

            {/* Navigation arrows for accessibility */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-between px-6 z-20" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={prev}
                    disabled={currentSlide === 0}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center disabled:opacity-30"
                >
                    <span className="material-symbols-outlined text-white">chevron_left</span>
                </button>
                <button
                    onClick={next}
                    disabled={currentSlide === SLIDES.length - 1}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center disabled:opacity-30"
                >
                    <span className="material-symbols-outlined text-white">chevron_right</span>
                </button>
            </div>
        </div>
    );
}
