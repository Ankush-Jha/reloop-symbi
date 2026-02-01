'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { Achievement } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { BadgeRevealModal } from '@/components/ui/BadgeRevealModal';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
    scanning: { label: 'Scanning', icon: 'photo_camera' },
    trading: { label: 'Trading', icon: 'swap_horiz' },
    impact: { label: 'Impact', icon: 'eco' },
    social: { label: 'Social', icon: 'group' },
    streak: { label: 'Streak', icon: 'local_fire_department' },
};

export default function AchievementsPage() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [selectedBadge, setSelectedBadge] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        setAchievements(DemoManager.getMockAchievements());
    }, []);

    const unlocked = achievements.filter(a => a.unlocked).length;
    const total = achievements.length;

    const filtered = filter === 'all'
        ? achievements
        : filter === 'unlocked'
            ? achievements.filter(a => a.unlocked)
            : achievements.filter(a => a.category === filter);

    const categories = Object.keys(CATEGORY_LABELS);

    return (
        <div className="min-h-screen bg-background">
            <PageHeader title="Achievements" backHref="/gamification" subtitle={`${unlocked}/${total} unlocked`} />

            <motion.div
                className="px-5 pb-28 space-y-5"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Progress */}
                <motion.div variants={itemVariants} className="bg-primary rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="font-black text-dark dark:text-white">Overall Progress</p>
                        <p className="text-sm font-bold text-dark/70 dark:text-white/70">{Math.round((unlocked / total) * 100)}%</p>
                    </div>
                    <div className="h-4 bg-dark/20 rounded-full overflow-hidden border-2 border-dark dark:border-gray-600">
                        <motion.div
                            className="h-full bg-dark rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(unlocked / total) * 100}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    <button
                        onClick={() => setFilter('all')}
                        className={filter === 'all' ? 'tab-pill-active' : 'tab-pill-inactive'}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unlocked')}
                        className={filter === 'unlocked' ? 'tab-pill-active' : 'tab-pill-inactive'}
                    >
                        Unlocked
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={filter === cat ? 'tab-pill-active' : 'tab-pill-inactive'}
                        >
                            {CATEGORY_LABELS[cat].label}
                        </button>
                    ))}
                </motion.div>

                {/* Achievement Grid */}
                <motion.div variants={containerVariants} className="grid grid-cols-2 gap-3">
                    {filtered.map((achievement) => (
                        <motion.div key={achievement.id} variants={itemVariants}>
                            <button
                                onClick={() => {
                                    if (achievement.unlocked) {
                                        setSelectedBadge({ id: achievement.id, name: achievement.name, description: achievement.description, icon: achievement.icon, color: achievement.color });
                                        setShowModal(true);
                                    }
                                }}
                                className={`w-full rounded-2xl border-2 p-4 text-center transition-all ${achievement.unlocked
                                    ? 'bg-white dark:bg-dark-surface border-dark dark:border-gray-600 shadow-brutal-sm hover:-translate-y-1'
                                    : 'bg-gray-50 dark:bg-dark-bg border-gray-200 dark:border-gray-700 opacity-60'
                                    }`}
                            >
                                <div
                                    className="w-16 h-16 rounded-xl border-2 border-dark dark:border-gray-600 mx-auto flex items-center justify-center mb-3"
                                    style={{ backgroundColor: achievement.unlocked ? achievement.color : '#e5e7eb' }}
                                >
                                    <span className="text-3xl">{achievement.unlocked ? achievement.icon : '🔒'}</span>
                                </div>
                                <p className="font-black text-dark dark:text-white text-sm">{achievement.name}</p>
                                <p className="text-[10px] text-dark/60 dark:text-white/60 mt-1">{achievement.description}</p>

                                {/* Progress Bar */}
                                {!achievement.unlocked && (
                                    <div className="mt-3">
                                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden border border-gray-300">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all"
                                                style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-dark/40 dark:text-white/40 mt-1 font-bold">{achievement.progress}/{achievement.target}</p>
                                    </div>
                                )}

                                <p className="text-[10px] text-primary font-bold mt-2">+{achievement.xpReward} XP</p>
                            </button>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {selectedBadge && (
                <BadgeRevealModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    badge={selectedBadge}
                />
            )}
        </div>
    );
}
