'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { Trade } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-card-yellow', text: 'text-yellow-800', label: 'Pending' },
    accepted: { bg: 'bg-card-blue', text: 'text-blue-800', label: 'Accepted' },
    completed: { bg: 'bg-card-green', text: 'text-green-800', label: 'Completed' },
    declined: { bg: 'bg-card-coral', text: 'text-red-800', label: 'Declined' },
};

const TABS = ['All', 'Pending', 'Completed', 'Declined'];

export default function TradeHistoryPage() {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        const load = async () => {
            setTrades(DemoManager.getMockTrades());
            setIsLoading(false);
        };
        load();
    }, []);

    const filtered = activeTab === 'All'
        ? trades
        : trades.filter(t => t.status === activeTab.toLowerCase());

    const totalCo2 = trades.filter(t => t.status === 'completed').reduce((sum, t) => sum + (t.co2Saved || 0), 0);

    return (
        <div className="min-h-screen bg-background">
            <PageHeader title="Trade History" backHref="/profile" />

            <div className="px-5 pb-28 space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card-green rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 text-center">
                        <p className="text-2xl font-[900] text-dark dark:text-white">{trades.filter(t => t.status === 'completed').length}</p>
                        <p className="text-xs font-bold text-dark/60 dark:text-white/60">Completed</p>
                    </div>
                    <div className="bg-card-yellow rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 text-center">
                        <p className="text-2xl font-[900] text-dark dark:text-white">{totalCo2.toFixed(1)}</p>
                        <p className="text-xs font-bold text-dark/60 dark:text-white/60">kg CO₂ Saved</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={activeTab === tab ? 'tab-pill-active' : 'tab-pill-inactive'}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Trade List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState icon="swap_horiz" title="No trades found" description="Your trade history will appear here" />
                ) : (
                    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-3">
                        {filtered.map((trade) => {
                            const style = STATUS_STYLES[trade.status];
                            return (
                                <motion.div key={trade.id} variants={itemVariants}>
                                    <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl border-2 border-dark dark:border-gray-600 overflow-hidden bg-gray-100 dark:bg-dark-surface shrink-0">
                                            <img src={trade.listingImage} alt={trade.listingTitle} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-dark dark:text-white truncate">{trade.listingTitle}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-dark-surface">
                                                    <img src={trade.traderAvatar} alt={trade.traderName} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-xs text-dark/60 dark:text-white/60">{trade.traderName}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
                                                    {style.label}
                                                </span>
                                                {trade.offeredCoins && (
                                                    <span className="text-xs font-bold text-dark/60 dark:text-white/60 flex items-center gap-1">
                                                        🪙 {trade.offeredCoins}
                                                    </span>
                                                )}
                                                {trade.offeredItem && (
                                                    <span className="text-xs font-bold text-dark/60 dark:text-white/60">
                                                        ↔ {trade.offeredItem}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
