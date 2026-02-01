'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { Listing } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const RECENT_SEARCHES = ['Textbooks', 'Denim Jacket', 'Headphones', 'Plants'];
const TRENDING = ['Electronics', 'Books', 'Clothing', 'Furniture'];

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Listing[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const allListings = DemoManager.getMockListings();

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        setHasSearched(true);
        const q = query.toLowerCase();
        const filtered = allListings.filter(
            l =>
                l.title.toLowerCase().includes(q) ||
                l.category.toLowerCase().includes(q) ||
                l.description.toLowerCase().includes(q)
        );
        setResults(filtered);
    }, [query]);

    return (
        <div className="min-h-screen bg-background">
            <PageHeader title="Search" />

            <div className="px-5 pb-28 space-y-6">
                {/* Search Input */}
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search items, categories..."
                        className="input-search"
                        autoFocus
                    />
                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" style={{ fontSize: 22 }}>
                        search
                    </span>
                </div>

                {!hasSearched ? (
                    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
                        {/* Recent Searches */}
                        <motion.div variants={itemVariants}>
                            <p className="text-sm font-bold text-dark/60 dark:text-white/60 mb-3">Recent Searches</p>
                            <div className="flex flex-wrap gap-2">
                                {RECENT_SEARCHES.map((term) => (
                                    <button
                                        key={term}
                                        onClick={() => setQuery(term)}
                                        className="px-4 py-2 bg-white dark:bg-dark-surface rounded-full border-2 border-dark dark:border-gray-600 text-sm font-bold text-dark dark:text-white hover:bg-gray-50 dark:bg-dark-bg transition-colors flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm text-dark/40 dark:text-white/40">history</span>
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Trending */}
                        <motion.div variants={itemVariants}>
                            <p className="text-sm font-bold text-dark/60 dark:text-white/60 mb-3">Trending Categories</p>
                            <div className="grid grid-cols-2 gap-3">
                                {TRENDING.map((cat, i) => {
                                    const colors = ['bg-card-green', 'bg-card-yellow', 'bg-card-pink', 'bg-card-blue'];
                                    const icons = ['devices', 'menu_book', 'checkroom', 'chair'];
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setQuery(cat)}
                                            className={`${colors[i]} rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 flex items-center gap-3 hover:-translate-y-1 transition-transform`}
                                        >
                                            <span className="material-symbols-outlined text-2xl text-dark dark:text-white">{icons[i]}</span>
                                            <span className="font-bold text-dark dark:text-white text-sm">{cat}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </motion.div>
                ) : results.length === 0 ? (
                    <EmptyState icon="search_off" title="No results found" description={`Try different keywords for "${query}"`} />
                ) : (
                    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                        <p className="text-sm font-bold text-dark/60 dark:text-white/60 mb-3">{results.length} result{results.length !== 1 ? 's' : ''}</p>
                        <div className="space-y-3">
                            {results.map((listing) => (
                                <motion.div key={listing.id} variants={itemVariants}>
                                    <Link href={`/marketplace/${listing.id}`}>
                                        <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                                            <div className="w-16 h-16 rounded-xl border-2 border-dark dark:border-gray-600 overflow-hidden bg-gray-100 dark:bg-dark-surface shrink-0">
                                                <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-dark dark:text-white truncate">{listing.title}</h3>
                                                <p className="text-xs text-dark/60 dark:text-white/60 truncate">{listing.condition} &middot; {listing.category}</p>
                                                <span className="inline-flex items-center gap-1 mt-1 text-sm font-bold text-primary">
                                                    <span>🪙</span> {listing.price}
                                                </span>
                                            </div>
                                            <span className="material-symbols-outlined text-dark/40 dark:text-white/40">chevron_right</span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
