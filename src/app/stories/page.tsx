'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { Story } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function StoriesPage() {
    const [stories, setStories] = useState<Story[]>([]);

    useEffect(() => {
        setStories(DemoManager.getMockStories());
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <PageHeader title="Success Stories" subtitle="Inspiring campus sustainability" />

            <motion.div
                className="px-5 pb-28 space-y-5"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Featured Story */}
                {stories[0] && (
                    <motion.div variants={itemVariants}>
                        <Link href={`/stories/${stories[0].id}`}>
                            <div className="relative rounded-3xl border-2 border-dark dark:border-gray-600 shadow-brutal overflow-hidden group">
                                <div className="aspect-[16/10] bg-gray-100 dark:bg-dark-surface relative">
                                    <img
                                        src={stories[0].image}
                                        alt={stories[0].title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                        <span className="px-3 py-1 bg-primary text-dark rounded-full text-xs font-bold mb-3 inline-block">
                                            Featured
                                        </span>
                                        <h2 className="text-2xl font-[900] leading-tight">{stories[0].title}</h2>
                                        <p className="text-white/80 text-sm mt-1">{stories[0].excerpt}</p>
                                        <div className="flex items-center gap-2 mt-3">
                                            <div className="w-6 h-6 rounded-full border border-white/50 overflow-hidden">
                                                <img src={stories[0].authorAvatar} alt={stories[0].author} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-xs font-bold text-white/80">{stories[0].author}</span>
                                            <span className="text-xs text-white/50">&middot;</span>
                                            <span className="text-xs text-white/50">{stories[0].campus}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )}

                {/* Other Stories */}
                {stories.slice(1).map((story) => (
                    <motion.div key={story.id} variants={itemVariants}>
                        <Link href={`/stories/${story.id}`}>
                            <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm overflow-hidden flex hover:-translate-y-1 transition-transform">
                                <div className="w-28 shrink-0">
                                    <img
                                        src={story.image}
                                        alt={story.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 p-4 min-w-0">
                                    <span className="text-xs font-bold text-primary">{story.category}</span>
                                    <h3 className="font-black text-dark dark:text-white text-sm mt-1 line-clamp-2">{story.title}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs text-dark/60 dark:text-white/60">{story.author}</span>
                                        <span className="text-xs text-dark/40 dark:text-white/40">&middot;</span>
                                        <span className="text-xs text-primary font-bold">{story.co2Saved}kg CO₂</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}

                {/* CTA */}
                <motion.div variants={itemVariants} className="bg-card-green rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-5 text-center">
                    <span className="text-3xl mb-2 block">✨</span>
                    <p className="font-black text-dark dark:text-white">Have a story to share?</p>
                    <p className="text-sm text-dark/60 dark:text-white/60 mt-1">We&apos;d love to feature your sustainability journey</p>
                    <button className="mt-4 px-6 py-3 bg-dark text-white rounded-full font-bold text-sm active:scale-95 transition-transform">
                        Submit Your Story
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}
