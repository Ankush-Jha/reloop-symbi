'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { StreakBadge } from '@/components/ui/StreakBadge';
import { User } from '@/types';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
  }
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [streak, setStreak] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDemoMode(DemoManager.isEnabled);
    // Always load user data on mount to ensure client-side storage is matched
    setUser(DemoManager.getMockUser());
    setStreak(DemoManager.getStreak());
  }, []);

  const leaderboard = DemoManager.getMockLeaderboard().slice(0, 3);

  // Prevent hydration mismatch by rendering nothing or a skeleton until mounted
  // Or render a safe default if preferred, but null is safest to avoid layout shift if data differs significantly
  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.header
        className="px-5 pt-6 pb-4"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-bold mb-1 ml-1">Welcome back,</p>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-[900] text-dark dark:text-white tracking-tight">{user.name.split(' ')[0]}</h1>
              <StreakBadge streak={streak} />
            </div>
          </div>
          <Link href="/profile" className="relative group">
            <div className="w-14 h-14 rounded-full border-2 border-dark dark:border-gray-600 overflow-hidden shadow-brutal-sm bg-gray-200 dark:bg-gray-700 group-hover:scale-105 transition-transform">
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            </div>
            {isDemoMode && (
              <span className="absolute 0 top-0 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                <span className="w-2 h-2 bg-white dark:bg-dark-surface rounded-full animate-pulse" />
              </span>
            )}
          </Link>
        </div>
      </motion.header>

      <div className="px-5 pb-28 space-y-6">
        {/* Big Scan Button Hero */}
        <motion.div
          variants={itemVariants}
          className="relative group"
        >
          <div className="absolute inset-0 bg-dark rounded-[2.5rem] translate-x-2 translate-y-2"></div>
          <div className="relative bg-primary rounded-[2.5rem] border-3 border-dark dark:border-gray-600 p-8 overflow-hidden">
            <div className="absolute -right-8 -top-8 text-[150px] opacity-10 pointer-events-none rotate-12">
              <span className="material-symbols-outlined text-[180px]">photo_camera</span>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl font-[900] text-dark dark:text-white uppercase tracking-tight mb-2 leading-none">Scan &<br />Earn!</h2>
              <p className="text-dark/80 dark:text-white/80 font-bold mb-6 max-w-[200px] leading-tight">
                Scan any item to discover upcycling ideas & earn eco-coins
              </p>
              <Link href="/scanner"
                className="inline-flex items-center gap-3 bg-dark text-white pl-6 pr-8 py-4 rounded-full font-bold text-lg uppercase tracking-wide shadow-brutal-sm hover:translate-y-1 active:scale-95 transition-all group-hover:shadow-none"
              >
                <span className="material-symbols-outlined text-2xl">photo_camera</span>
                Scan Item
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Grid (Restored 3-col layout) */}
        <motion.div variants={itemVariants}>
          <p className="font-extrabold text-dark dark:text-white text-lg mb-3 ml-1">Quick Actions</p>
          <div className="grid grid-cols-3 gap-3">
            <Link href="/rewards" className="group relative">
              <div className="absolute inset-0 bg-dark rounded-2xl translate-x-1 translate-y-1"></div>
              <div className="relative bg-card-pink border-3 border-dark dark:border-gray-600 rounded-2xl p-4 flex flex-col items-center gap-2 group-hover:-translate-y-1 transition-transform">
                <span className="material-symbols-outlined text-4xl text-dark dark:text-white">redeem</span>
                <span className="text-xs font-[800] text-dark dark:text-white uppercase tracking-wide">Rewards</span>
              </div>
            </Link>
            <Link href="/impact" className="group relative">
              <div className="absolute inset-0 bg-dark rounded-2xl translate-x-1 translate-y-1"></div>
              <div className="relative bg-card-green border-3 border-dark dark:border-gray-600 rounded-2xl p-4 flex flex-col items-center gap-2 group-hover:-translate-y-1 transition-transform">
                <span className="material-symbols-outlined text-4xl text-dark dark:text-white">eco</span>
                <span className="text-xs font-[800] text-dark dark:text-white uppercase tracking-wide">Impact</span>
              </div>
            </Link>
            <Link href="/gamification" className="group relative">
              <div className="absolute inset-0 bg-dark rounded-2xl translate-x-1 translate-y-1"></div>
              <div className="relative bg-card-blue border-3 border-dark dark:border-gray-600 rounded-2xl p-4 flex flex-col items-center gap-2 group-hover:-translate-y-1 transition-transform">
                <span className="material-symbols-outlined text-4xl text-dark dark:text-white">stadia_controller</span>
                <span className="text-xs font-[800] text-dark dark:text-white uppercase tracking-wide">Games</span>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Impact & Stats Row */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 gap-3"
        >
          <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 hover:translate-y-1 transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-card-yellow rounded-xl border-2 border-dark dark:border-gray-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl text-dark dark:text-white">monetization_on</span>
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-[900] text-dark dark:text-white leading-tight">{user.coins}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold truncate">ReCoins</p>
              </div>
            </div>
          </div>

          {/* Compact Impact Display */}
          <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 hover:translate-y-1 transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-light rounded-xl border-2 border-dark dark:border-gray-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-3xl text-dark dark:text-white">eco</span>
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-[900] text-dark dark:text-white leading-tight">{user.co2Saved}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold truncate">kg Saved</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Level Progress */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-5 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-full border-2 border-dark dark:border-gray-600 flex items-center justify-center shadow-sm">
                <span className="font-[900] text-lg text-dark dark:text-white">{user.level}</span>
              </div>
              <div>
                <p className="font-[800] text-dark dark:text-white text-lg leading-none">{user.levelTitle}</p>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-1">{user.xp} XP Earned</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold bg-gray-100 dark:bg-dark-surface px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700">
                {1000 - (user.xp % 1000)} XP to next lvl
              </span>
            </div>
          </div>

          <div className="h-4 bg-gray-100 dark:bg-dark-surface rounded-full overflow-hidden border-2 border-dark dark:border-gray-600 relative">
            {/* Liquid progress effect */}
            <div
              className="h-full bg-primary absolute top-0 left-0 transition-all duration-1000 ease-out"
              style={{ width: `${(user.xp % 1000) / 10}%` }}
            />
            <div
              className="h-full w-full absolute top-0 left-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)',
                backgroundSize: '1rem 1rem'
              }}
            />
          </div>
        </motion.div>

        {/* Campus Leaderboard */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4 px-1">
            <p className="font-extrabold text-dark dark:text-white text-lg">Top Students</p>
            <Link href="/gamification/rankings" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
              View All
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm overflow-hidden">
            {leaderboard.map((leader, i) => (
              <div
                key={leader.uid}
                className={`flex items-center gap-4 p-4 ${i < leaderboard.length - 1 ? 'border-b-2 border-gray-100 dark:border-gray-700' : ''} hover:bg-gray-50 dark:bg-dark-bg transition-colors cursor-pointer`}
              >
                <div className={`w-8 h-8 rounded-lg border-2 border-dark dark:border-gray-600 flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-yellow-100 text-yellow-700' :
                  i === 1 ? 'bg-gray-200 dark:bg-gray-700 text-gray-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                  {i + 1}
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-sm ring-2 ring-gray-100">
                  <img src={leader.avatar} alt={leader.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-dark dark:text-white truncate">{leader.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">Level {leader.level}</p>
                </div>
                <div className="text-right">
                  <p className="font-[900] text-dark dark:text-white">{leader.xp}</p>
                  <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">XP</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
