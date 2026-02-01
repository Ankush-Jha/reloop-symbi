'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { Reward, User } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
    voucher: { label: 'Vouchers', icon: 'confirmation_number' },
    merch: { label: 'Merch', icon: 'redeem' },
    donation: { label: 'Donate', icon: 'volunteer_activism' },
    experience: { label: 'Experiences', icon: 'celebration' },
};

const TABS = ['All', 'Vouchers', 'Merch', 'Donate', 'Experiences'];

export default function RewardsPage() {
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState('All');
    const [redeemed, setRedeemed] = useState<Set<string>>(new Set());

    const [toast, setToast] = useState('');

    useEffect(() => {
        setRewards(DemoManager.getMockRewards());
        setUser(DemoManager.getMockUser());
        setRedeemed(new Set(DemoManager.getRedeemedRewards()));
    }, []);

    const filtered = activeTab === 'All'
        ? rewards
        : rewards.filter(r => CATEGORY_LABELS[r.category]?.label === activeTab);

    const handleRedeem = (reward: Reward) => {
        if (!user || user.coins < reward.cost || redeemed.has(reward.id)) return;
        const success = DemoManager.redeemReward(reward.id, reward.cost);
        if (success) {
            setUser(DemoManager.getMockUser());
            setRedeemed(new Set(DemoManager.getRedeemedRewards()));
            setToast(`Redeemed "${reward.title}"!`);
            setTimeout(() => setToast(''), 3000);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background">
            <PageHeader title="Rewards" subtitle="Redeem your ReCoins" />

            <motion.div
                className="px-5 pb-28 space-y-5"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Balance */}
                <motion.div variants={itemVariants} className="bg-primary rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal p-5 flex items-center justify-between">
                    <div>
                        <p className="text-dark/70 dark:text-white/70 font-bold text-sm">Your Balance</p>
                        <p className="text-4xl font-[900] text-dark dark:text-white">{user.coins}</p>
                        <p className="text-dark/60 dark:text-white/60 font-bold text-sm">ReCoins</p>
                    </div>
                    <div className="text-6xl">🪙</div>
                </motion.div>

                {/* Tabs */}
                <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={activeTab === tab ? 'tab-pill-active' : 'tab-pill-inactive'}
                        >
                            {tab}
                        </button>
                    ))}
                </motion.div>

                {/* Rewards Grid */}
                <motion.div variants={containerVariants} className="space-y-3">
                    {filtered.map((reward) => {
                        const isRedeemed = redeemed.has(reward.id);
                        const canAfford = user.coins >= reward.cost;
                        return (
                            <motion.div key={reward.id} variants={itemVariants}>
                                <div className={`bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 flex items-center gap-4 ${!reward.available ? 'opacity-50' : ''}`}>
                                    <div className="w-16 h-16 bg-card-yellow rounded-xl border-2 border-dark dark:border-gray-600 flex items-center justify-center shrink-0 text-3xl">
                                        {reward.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-dark dark:text-white text-sm truncate">{reward.title}</p>
                                        <p className="text-xs text-dark/60 dark:text-white/60 truncate">{reward.description}</p>
                                        <p className="text-sm font-bold text-primary mt-1 flex items-center gap-1">
                                            🪙 {reward.cost}
                                        </p>
                                    </div>
                                    {isRedeemed ? (
                                        <span className="material-symbols-outlined text-primary text-2xl">check_circle</span>
                                    ) : (
                                        <button
                                            onClick={() => handleRedeem(reward)}
                                            disabled={!canAfford || !reward.available}
                                            className={`px-4 py-2 rounded-full border-2 border-dark dark:border-gray-600 font-bold text-xs active:scale-95 transition-transform ${canAfford && reward.available
                                                ? 'bg-primary text-dark'
                                                : 'bg-gray-100 dark:bg-dark-surface text-dark/40 dark:text-white/40'
                                                }`}
                                        >
                                            Redeem
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* How It Works */}
                <motion.div variants={itemVariants} className="bg-card-blue rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-5">
                    <p className="font-black text-dark dark:text-white text-sm mb-3">How to Earn More ReCoins</p>
                    <div className="space-y-2">
                        {[
                            { icon: 'photo_camera', text: 'Scan items for 10-45 coins' },
                            { icon: 'swap_horiz', text: 'Complete trades for 25-100 coins' },
                            { icon: 'flag', text: 'Finish missions for bonus coins' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-lg text-dark/60 dark:text-white/60">{item.icon}</span>
                                <p className="text-xs text-dark/70 dark:text-white/70 font-medium">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            {/* Toast */}
            {toast && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-dark dark:bg-primary text-white dark:text-dark px-6 py-3 rounded-full font-bold text-sm shadow-xl z-50"
                >
                    {toast}
                </motion.div>
            )}
        </div>
    );
}
