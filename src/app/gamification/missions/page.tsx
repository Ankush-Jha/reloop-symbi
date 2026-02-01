'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { Mission } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function MissionsPage() {
    const [missions, setMissions] = useState<Mission[]>([]);

    useEffect(() => {
        setMissions(DemoManager.getMockMissions());
    }, []);

    const [toast, setToast] = useState('');

    const handleClaim = (id: string) => {
        const result = DemoManager.claimMission(id);
        if (result) {
            setMissions(DemoManager.getMockMissions());
            setToast(`Claimed! +${result.coins} coins, +${result.xp} XP`);
            setTimeout(() => setToast(''), 3000);
        }
    };

    const handleProgress = (id: string) => {
        DemoManager.progressMission(id);
        setMissions(DemoManager.getMockMissions());
    };

    const dailyMissions = missions.slice(0, 3);
    const weeklyMissions = missions.slice(3);

    return (
        <div className="min-h-screen bg-background">
            <PageHeader title="Missions" backHref="/gamification" subtitle="Complete tasks, earn rewards" />

            <motion.div
                className="px-5 pb-28 space-y-6"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Timer */}
                <motion.div variants={itemVariants} className="bg-card-yellow rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 flex items-center gap-3">
                    <span className="material-symbols-outlined text-2xl text-dark dark:text-white">timer</span>
                    <div>
                        <p className="font-bold text-dark dark:text-white text-sm">Daily Reset</p>
                        <p className="text-xs text-dark/60 dark:text-white/60">Missions reset in 8h 42m</p>
                    </div>
                </motion.div>

                {/* Daily Missions */}
                <motion.div variants={itemVariants}>
                    <p className="font-extrabold text-dark dark:text-white text-lg mb-3 ml-1">Daily Missions</p>
                    <div className="space-y-3">
                        {dailyMissions.map((mission) => (
                            <MissionCard
                                key={mission.id}
                                mission={mission}
                                onClaim={handleClaim}
                                onProgress={handleProgress}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Weekly Missions */}
                {weeklyMissions.length > 0 && (
                    <motion.div variants={itemVariants}>
                        <p className="font-extrabold text-dark dark:text-white text-lg mb-3 ml-1">Weekly Missions</p>
                        <div className="space-y-3">
                            {weeklyMissions.map((mission) => (
                                <MissionCard
                                    key={mission.id}
                                    mission={mission}
                                    onClaim={handleClaim}
                                    onProgress={handleProgress}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Toast */}
            {toast && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-dark dark:bg-primary text-white dark:text-dark px-6 py-3 rounded-full font-bold text-sm shadow-xl z-50"
                >
                    {toast}
                </motion.div>
            )}
        </div>
    );
}

function MissionCard({ mission, onClaim, onProgress }: { mission: Mission; onClaim: (id: string) => void; onProgress: (id: string) => void }) {
    const progress = Math.min((mission.progress / mission.target) * 100, 100);

    return (
        <div className={`bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 ${mission.claimed ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl border-2 border-dark dark:border-gray-600 flex items-center justify-center shrink-0 ${mission.completed ? 'bg-primary' : 'bg-card-blue'}`}>
                    <span className="material-symbols-outlined text-2xl text-dark dark:text-white">{mission.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-black text-dark dark:text-white text-sm">{mission.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-bold text-primary flex items-center gap-1">
                            +{mission.xpReward} XP
                        </span>
                        <span className="text-xs font-bold text-dark/60 dark:text-white/60 flex items-center gap-1">
                            🪙 {mission.coinsReward}
                        </span>
                    </div>
                </div>
                {mission.completed && !mission.claimed ? (
                    <button
                        onClick={() => onClaim(mission.id)}
                        className="px-4 py-2 bg-primary rounded-full border-2 border-dark dark:border-gray-600 font-bold text-dark dark:text-white text-xs active:scale-95 transition-transform"
                    >
                        Claim
                    </button>
                ) : mission.claimed ? (
                    <span className="material-symbols-outlined text-primary text-2xl">check_circle</span>
                ) : (
                    <button
                        onClick={() => onProgress(mission.id)}
                        className="px-3 py-2 bg-gray-100 dark:bg-dark-surface rounded-full border border-gray-200 dark:border-gray-700 font-bold text-dark/60 dark:text-white/60 text-xs hover:bg-gray-200 dark:bg-gray-700 transition-colors"
                    >
                        +1
                    </button>
                )}
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-dark/40 dark:text-white/40">Progress</span>
                    <span className="text-[10px] font-bold text-dark/40 dark:text-white/40">{mission.progress}/{mission.target}</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-dark-surface rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                    <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>
            </div>
        </div>
    );
}
