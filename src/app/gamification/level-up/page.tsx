'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';

const LEVEL_TITLES: Record<number, string> = {
    1: 'Eco Newbie',
    2: 'Green Starter',
    3: 'Sustainability Scout',
    4: 'Eco Enthusiast',
    5: 'Eco Champion',
    6: 'Green Guardian',
    7: 'Earth Defender',
    8: 'Eco Master',
    9: 'Planet Protector',
    10: 'Sustainability Legend',
};

const PERKS = [
    { icon: 'stars', text: 'New profile badge unlocked', color: 'bg-card-yellow' },
    { icon: 'redeem', text: 'Access to exclusive rewards', color: 'bg-card-pink' },
    { icon: 'trending_up', text: 'Higher marketplace priority', color: 'bg-card-blue' },
];

export default function LevelUpPage() {
    const [user, setUser] = useState(DemoManager.getMockUser());
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-100 via-green-50 to-white flex flex-col items-center justify-center px-8 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-20 h-20 bg-card-yellow rounded-full opacity-30" />
                <div className="absolute top-40 right-8 w-16 h-16 bg-card-pink rounded-full opacity-30" />
                <div className="absolute bottom-40 left-20 w-24 h-24 bg-card-blue rounded-full opacity-20" />
            </div>

            {/* Level Badge */}
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring' as const, stiffness: 200, damping: 15, delay: 0.3 }}
                className="relative mb-6"
            >
                <div className="w-36 h-36 bg-primary rounded-[2.5rem] border-[3px] border-dark dark:border-gray-600 shadow-brutal flex items-center justify-center">
                    <span className="text-6xl font-[900] text-dark dark:text-white">{user.level}</span>
                </div>
                <motion.div
                    className="absolute -top-3 -right-3 bg-card-yellow rounded-full border-2 border-dark dark:border-gray-600 w-12 h-12 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: 'spring' as const }}
                >
                    <span className="text-xl">⭐</span>
                </motion.div>
            </motion.div>

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center mb-8"
            >
                <p className="text-sm font-bold text-dark/60 dark:text-white/60 uppercase tracking-wider mb-2">Level Up!</p>
                <h1 className="text-4xl font-[900] text-dark dark:text-white uppercase tracking-tight">
                    {LEVEL_TITLES[user.level] || 'Eco Legend'}
                </h1>
                <p className="text-dark/60 dark:text-white/60 font-medium mt-2">
                    You&apos;ve reached Level {user.level}
                </p>
            </motion.div>

            {/* Perks */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="w-full max-w-sm space-y-3 mb-8"
            >
                <p className="text-sm font-bold text-dark/60 dark:text-white/60 text-center">New Perks Unlocked</p>
                {PERKS.map((perk, i) => (
                    <motion.div
                        key={i}
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.0 + i * 0.15 }}
                        className={`${perk.color} rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 flex items-center gap-3`}
                    >
                        <span className="material-symbols-outlined text-xl text-dark dark:text-white">{perk.icon}</span>
                        <p className="font-bold text-dark dark:text-white text-sm">{perk.text}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="w-full max-w-sm space-y-3"
            >
                <button className="w-full bg-dark text-white py-4 rounded-2xl font-[900] uppercase tracking-wider shadow-brutal active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined">share</span>
                    Share Achievement
                </button>
                <Link
                    href="/"
                    className="w-full bg-white dark:bg-dark-surface text-dark dark:text-white py-4 rounded-2xl font-bold border-2 border-dark dark:border-gray-600 shadow-brutal-sm active:translate-y-1 active:shadow-none transition-all flex items-center justify-center"
                >
                    Continue
                </Link>
            </motion.div>

            {/* Confetti */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-3 h-3 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                backgroundColor: ['#4ce68a', '#fde047', '#fda4af', '#93c5fd', '#c4b5fd'][i % 5],
                            }}
                            initial={{ top: '-5%', rotate: 0 }}
                            animate={{
                                top: '105%',
                                rotate: Math.random() * 720 - 360,
                                x: Math.random() * 200 - 100,
                            }}
                            transition={{
                                duration: 2 + Math.random() * 2,
                                delay: Math.random() * 0.5,
                                ease: 'easeOut',
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
