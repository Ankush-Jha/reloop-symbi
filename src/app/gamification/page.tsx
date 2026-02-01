'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DemoManager from '@/lib/demo-manager';
import { LevelUpModal } from '@/components/ui/LevelUpModal';
import { BadgeRevealModal } from '@/components/ui/BadgeRevealModal';
import { StreakBadge } from '@/components/ui/StreakBadge';

// Sample badges for demo
const DEMO_BADGES = [
    { id: 'first-scan', name: 'First Scan', description: 'Completed your first item scan!', icon: '📸', color: '#4ce68a' },
    { id: 'eco-starter', name: 'Eco Starter', description: 'Saved 1kg of CO2', icon: '🌱', color: '#dcfce7' },
    { id: 'trader', name: 'Active Trader', description: 'Completed 5 trades', icon: '🤝', color: '#fde047' },
    { id: 'upcycler', name: 'Master Upcycler', description: 'Created 10 upcycle projects', icon: '♻️', color: '#93c5fd' },
    { id: 'streak-7', name: '7 Day Streak', description: 'Logged in 7 days in a row!', icon: '🔥', color: '#fb923c' },
];

// Level titles
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

export default function GamificationPage() {
    const [user, setUser] = useState(DemoManager.getMockUser());
    const [streak, setStreak] = useState(1);

    // Modal states
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [showBadgeReveal, setShowBadgeReveal] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState(DEMO_BADGES[0]);
    const [currentLevel, setCurrentLevel] = useState(user.level);

    useEffect(() => {
        // Load streak from localStorage
        const savedStreak = localStorage.getItem('reloop_streak');
        if (savedStreak) {
            setStreak(parseInt(savedStreak, 10));
        }
    }, []);

    const handleAddXP = (amount: number) => {
        const newXP = user.xp + amount;
        const newLevel = Math.floor(newXP / 1000) + 1;

        if (newLevel > user.level) {
            setCurrentLevel(newLevel);
            setShowLevelUp(true);
        }

        setUser({
            ...user,
            xp: newXP,
            level: newLevel,
            levelTitle: LEVEL_TITLES[newLevel] || 'Eco Legend',
        });
    };

    const handleUnlockBadge = (badge: typeof DEMO_BADGES[0]) => {
        setSelectedBadge(badge);
        setShowBadgeReveal(true);
    };

    const handleIncreaseStreak = () => {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('reloop_streak', newStreak.toString());
    };

    const handleResetDemo = () => {
        setUser(DemoManager.getMockUser());
        setStreak(1);
        setCurrentLevel(5);
        localStorage.setItem('reloop_streak', '1');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-50 to-white dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
            {/* Header */}
            <header className="px-5 pt-6 pb-4 flex items-center justify-between">
                <Link
                    href="/"
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-dark-surface rounded-xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm"
                >
                    <span className="material-symbols-outlined text-dark dark:text-white">arrow_back</span>
                </Link>
                <h1 className="font-black text-dark dark:text-white text-xl uppercase">Gamification Demo</h1>
                <StreakBadge streak={streak} />
            </header>

            <div className="px-5 pb-28 space-y-6">
                {/* Quick Nav */}
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { href: '/gamification/achievements', icon: 'military_tech', label: 'Badges', color: 'bg-card-pink' },
                        { href: '/gamification/missions', icon: 'flag', label: 'Missions', color: 'bg-card-yellow' },
                        { href: '/gamification/rankings', icon: 'leaderboard', label: 'Ranks', color: 'bg-card-blue' },
                        { href: '/gamification/wrapped', icon: 'auto_awesome', label: 'Wrapped', color: 'bg-card-green' },
                    ].map((nav) => (
                        <Link
                            key={nav.href}
                            href={nav.href}
                            className={`${nav.color} rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-3 flex flex-col items-center gap-1 hover:-translate-y-1 transition-transform`}
                        >
                            <span className="material-symbols-outlined text-xl text-dark dark:text-white">{nav.icon}</span>
                            <span className="text-[10px] font-[800] text-dark dark:text-white uppercase">{nav.label}</span>
                        </Link>
                    ))}
                </div>

                {/* User Stats Card */}
                <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal p-5">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-primary border-2 border-dark dark:border-gray-600 flex items-center justify-center">
                            <span className="text-2xl font-black text-dark dark:text-white">{user.level}</span>
                        </div>
                        <div>
                            <p className="font-black text-xl text-dark dark:text-white">{user.name}</p>
                            <p className="text-sm font-bold text-primary">{user.levelTitle}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-3">
                            <p className="text-xl font-black text-dark dark:text-white">{user.xp}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">XP</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-3">
                            <p className="text-xl font-black text-dark dark:text-white">{user.coins}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">Coins</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-3">
                            <p className="text-xl font-black text-dark dark:text-white">{streak}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">Streak</p>
                        </div>
                    </div>

                    {/* XP Progress */}
                    <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-bold text-dark dark:text-white">Level {user.level}</span>
                            <span className="font-bold text-gray-400 dark:text-gray-500">{user.xp % 1000}/1000 XP</span>
                        </div>
                        <div className="h-3 bg-gray-100 dark:bg-dark-surface rounded-full overflow-hidden border border-dark dark:border-gray-600">
                            <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${(user.xp % 1000) / 10}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Level Up Test */}
                <div className="bg-card-green rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal p-5">
                    <h2 className="font-black text-dark dark:text-white mb-3 flex items-center gap-2">
                        <span>🎯</span> Test Level Up
                    </h2>
                    <p className="text-sm text-dark/70 dark:text-white/70 mb-4">
                        Add XP to trigger level up celebration when you cross 1000 XP thresholds.
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleAddXP(100)}
                            className="flex-1 py-3 bg-white dark:bg-dark-surface rounded-xl border-2 border-dark dark:border-gray-600 font-bold text-dark dark:text-white hover:bg-gray-50 dark:bg-dark-bg"
                        >
                            +100 XP
                        </button>
                        <button
                            onClick={() => handleAddXP(500)}
                            className="flex-1 py-3 bg-white dark:bg-dark-surface rounded-xl border-2 border-dark dark:border-gray-600 font-bold text-dark dark:text-white hover:bg-gray-50 dark:bg-dark-bg"
                        >
                            +500 XP
                        </button>
                        <button
                            onClick={() => handleAddXP(1000)}
                            className="flex-1 py-3 bg-dark rounded-xl font-bold text-white hover:bg-gray-800"
                        >
                            +1000 XP
                        </button>
                    </div>
                </div>

                {/* Badge Unlock Test */}
                <div className="bg-card-yellow rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal p-5">
                    <h2 className="font-black text-dark dark:text-white mb-3 flex items-center gap-2">
                        <span>🏅</span> Test Badge Unlock
                    </h2>
                    <p className="text-sm text-dark/70 dark:text-white/70 mb-4">
                        Click any badge to see the unlock animation.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {DEMO_BADGES.map((badge) => (
                            <button
                                key={badge.id}
                                onClick={() => handleUnlockBadge(badge)}
                                className="w-14 h-14 rounded-xl border-2 border-dark dark:border-gray-600 flex items-center justify-center hover:scale-105 transition-transform"
                                style={{ backgroundColor: badge.color }}
                            >
                                <span className="text-2xl">{badge.icon}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Streak Test */}
                <div className="bg-card-pink rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal p-5">
                    <h2 className="font-black text-dark dark:text-white mb-3 flex items-center gap-2">
                        <span>🔥</span> Test Streak Badge
                    </h2>
                    <p className="text-sm text-dark/70 dark:text-white/70 mb-4">
                        Increase streak to see different flame intensities (1, 7, 30 days).
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={handleIncreaseStreak}
                            className="flex-1 py-3 bg-white dark:bg-dark-surface rounded-xl border-2 border-dark dark:border-gray-600 font-bold text-dark dark:text-white hover:bg-gray-50 dark:bg-dark-bg"
                        >
                            +1 Day
                        </button>
                        <button
                            onClick={() => { setStreak(7); localStorage.setItem('reloop_streak', '7'); }}
                            className="flex-1 py-3 bg-orange-400 rounded-xl border-2 border-dark dark:border-gray-600 font-bold text-dark dark:text-white hover:bg-orange-300"
                        >
                            7 Days
                        </button>
                        <button
                            onClick={() => { setStreak(30); localStorage.setItem('reloop_streak', '30'); }}
                            className="flex-1 py-3 bg-red-400 rounded-xl border-2 border-dark dark:border-gray-600 font-bold text-white hover:bg-red-500"
                        >
                            30 Days
                        </button>
                    </div>
                </div>

                {/* Reset Button */}
                <button
                    onClick={handleResetDemo}
                    className="w-full py-4 bg-dark text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">refresh</span>
                    Reset Demo
                </button>
            </div>

            {/* Modals */}
            <LevelUpModal
                isOpen={showLevelUp}
                onClose={() => setShowLevelUp(false)}
                newLevel={currentLevel}
                levelTitle={LEVEL_TITLES[currentLevel] || 'Eco Legend'}
            />
            <BadgeRevealModal
                isOpen={showBadgeReveal}
                onClose={() => setShowBadgeReveal(false)}
                badge={selectedBadge}
                onViewCollection={() => { }}
            />
        </div>
    );
}
