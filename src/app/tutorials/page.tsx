'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { Tutorial } from '@/types';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function TutorialsPage() {
    const [tutorials, setTutorials] = useState<Tutorial[]>([]);

    useEffect(() => {
        setTutorials(DemoManager.getMockTutorials());
    }, []);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="px-5 pt-6 pb-4">
                <h1 className="text-2xl font-black text-dark dark:text-white">DIY Tutorials</h1>
                <p className="text-sm text-dark/60 dark:text-white/60">Learn sustainable crafting</p>
            </header>

            <motion.div
                className="px-5 pb-28 space-y-3"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {tutorials.map((tutorial) => (
                    <motion.div key={tutorial.id} variants={itemVariants}>
                        <Link href={`/tutorials/${tutorial.id}`}>
                            <div className={`${tutorial.color} rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer`}>
                                <div className="w-14 h-14 bg-white dark:bg-dark-surface rounded-xl border-2 border-dark dark:border-gray-600 flex items-center justify-center text-2xl">
                                    {tutorial.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-black text-dark dark:text-white">{tutorial.title}</h3>
                                    <p className="text-xs text-dark/60 dark:text-white/60 mb-2">{tutorial.description}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center px-2 py-0.5 bg-white dark:bg-dark-surface rounded-lg border border-dark dark:border-gray-600 text-xs font-bold text-dark dark:text-white">
                                            {tutorial.level}
                                        </span>
                                        <span className="text-xs text-dark/40 dark:text-white/40 font-bold">{tutorial.estimatedTime}</span>
                                    </div>
                                </div>
                                <div className="w-8 h-8 bg-white dark:bg-dark-surface rounded-lg border-2 border-dark dark:border-gray-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-sm text-dark dark:text-white">chevron_right</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}

                {/* Coming Soon */}
                <motion.div variants={itemVariants} className="text-center py-8">
                    <div className="w-16 h-16 bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 mx-auto flex items-center justify-center mb-4">
                        <span className="text-3xl">🚧</span>
                    </div>
                    <p className="text-dark/60 dark:text-white/60 font-medium">More tutorials coming soon!</p>
                </motion.div>
            </motion.div>
        </div>
    );
}
