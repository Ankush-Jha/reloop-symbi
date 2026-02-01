'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { User } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const IMPACT_EQUIVALENTS = [
    { value: 2, unit: 'trees planted', icon: '🌳' },
    { value: 180, unit: 'miles not driven', icon: '🚗' },
    { value: 45, unit: 'plastic bags saved', icon: '🛍️' },
    { value: 12, unit: 'gallons water saved', icon: '💧' },
];

const MONTHLY_DATA = [
    { month: 'Aug', co2: 3.2 },
    { month: 'Sep', co2: 5.8 },
    { month: 'Oct', co2: 8.1 },
    { month: 'Nov', co2: 12.4 },
    { month: 'Dec', co2: 7.2 },
    { month: 'Jan', co2: 8.5 },
];

export default function ImpactPage() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        setUser(DemoManager.getMockUser());
    }, []);

    if (!user) return null;

    const maxCo2 = Math.max(...MONTHLY_DATA.map(d => d.co2));

    return (
        <div className="min-h-screen bg-background">
            <PageHeader title="Your Impact" subtitle="Environmental contributions" />

            <motion.div
                className="px-5 pb-28 space-y-6"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Hero Impact Card */}
                <motion.div variants={itemVariants} className="bg-primary rounded-3xl border-[3px] border-dark dark:border-gray-600 shadow-brutal p-6 text-center relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 text-[120px] opacity-10 pointer-events-none">
                        <span className="material-symbols-outlined text-[120px]">eco</span>
                    </div>
                    <p className="text-dark/70 dark:text-white/70 font-bold text-sm uppercase tracking-wider mb-2">Total CO2 Saved</p>
                    <p className="text-6xl font-[900] text-dark dark:text-white">{user.co2Saved}</p>
                    <p className="text-dark/70 dark:text-white/70 font-bold text-lg">kg CO₂</p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
                    <div className="bg-card-yellow rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 text-center">
                        <p className="text-3xl font-[900] text-dark dark:text-white">{user.itemsTraded}</p>
                        <p className="text-xs font-bold text-dark/60 dark:text-white/60 mt-1">Items Traded</p>
                    </div>
                    <div className="bg-card-blue rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 text-center">
                        <p className="text-3xl font-[900] text-dark dark:text-white">47</p>
                        <p className="text-xs font-bold text-dark/60 dark:text-white/60 mt-1">Items Scanned</p>
                    </div>
                </motion.div>

                {/* Impact Equivalents */}
                <motion.div variants={itemVariants}>
                    <p className="font-extrabold text-dark dark:text-white text-lg mb-3 ml-1">That&apos;s Equivalent To</p>
                    <div className="grid grid-cols-2 gap-3">
                        {IMPACT_EQUIVALENTS.map((item, i) => (
                            <div key={i} className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 flex items-center gap-3">
                                <span className="text-3xl">{item.icon}</span>
                                <div>
                                    <p className="text-xl font-[900] text-dark dark:text-white">{item.value}</p>
                                    <p className="text-xs text-dark/60 dark:text-white/60 font-bold">{item.unit}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Monthly Chart */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-5">
                    <p className="font-extrabold text-dark dark:text-white mb-4">Monthly CO₂ Saved</p>
                    <div className="flex items-end gap-2 h-40">
                        {MONTHLY_DATA.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <p className="text-xs font-bold text-dark dark:text-white">{d.co2}</p>
                                <motion.div
                                    className="w-full bg-primary rounded-t-xl border-2 border-dark dark:border-gray-600"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(d.co2 / maxCo2) * 100}%` }}
                                    transition={{ delay: 0.3 + i * 0.1, type: 'spring' as const, stiffness: 200 }}
                                />
                                <p className="text-[10px] font-bold text-dark/50 dark:text-white/50">{d.month}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Share Impact */}
                <motion.div variants={itemVariants}>
                    <button className="w-full bg-dark text-white py-4 rounded-2xl font-[900] uppercase tracking-wider shadow-brutal active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined">share</span>
                        Share Your Impact
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}
