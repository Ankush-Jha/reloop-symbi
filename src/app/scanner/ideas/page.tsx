'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ScannerService from '@/lib/scanner-service';
import { ScanResult, UpcycleIdea } from '@/types';

const DIFFICULTY_COLORS: Record<string, string> = {
    Easy: 'bg-card-green',
    Medium: 'bg-card-yellow',
    Hard: 'bg-card-pink',
};

const TIME_BY_DIFFICULTY: Record<string, string> = {
    Easy: '15 min',
    Medium: '30 min',
    Hard: '45 min',
};

export default function UpcycleIdeasPage() {
    const router = useRouter();
    const [result, setResult] = useState<ScanResult | null>(null);

    useEffect(() => {
        const storedResult = ScannerService.getStoredResult();
        if (!storedResult) {
            router.push('/scanner');
            return;
        }
        setResult(storedResult);
    }, [router]);

    if (!result) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const { item } = result;
    const ideas = item.upcycleIdeas || [];

    const openYouTubeSearch = (title: string) => {
        const query = encodeURIComponent(`${title} DIY tutorial`);
        window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    };

    const openPinterestSearch = (title: string) => {
        const query = encodeURIComponent(`${title} DIY`);
        window.open(`https://www.pinterest.com/search/pins/?q=${query}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="px-5 pt-6 pb-4">
                <div className="flex items-center gap-4 mb-4">
                    <Link
                        href="/scanner/result"
                        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-dark-surface rounded-xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm"
                    >
                        <span className="material-symbols-outlined text-dark dark:text-white">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="font-black text-dark dark:text-white text-xl">Reuse Ideas</h1>
                        <p className="text-sm text-dark/60 dark:text-white/60">For your {item.objectName}</p>
                    </div>
                </div>
            </header>

            <div className="px-5 pb-28 space-y-3">
                {ideas.map((idea, index) => {
                    const thumbnail = idea.thumbnail || `https://source.unsplash.com/200x200/?${encodeURIComponent(idea.title + ' DIY')}`;
                    const bgColor = DIFFICULTY_COLORS[idea.difficulty] || 'bg-card-green';
                    const isYouTube = idea.source === 'youtube';
                    const timeEstimate = TIME_BY_DIFFICULTY[idea.difficulty] || '30 min';

                    return (
                        <div
                            key={index}
                            onClick={() => openYouTubeSearch(idea.title)}
                            className={`${bgColor} rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 flex items-center gap-4 card-hover cursor-pointer`}
                        >
                            {/* Thumbnail */}
                            <div className="relative shrink-0">
                                <div className="w-16 h-16 rounded-xl border-2 border-dark dark:border-gray-600 overflow-hidden bg-white dark:bg-dark-surface">
                                    <img
                                        src={thumbnail}
                                        alt={idea.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(idea.title)}&background=22c358&color=fff&size=200`;
                                        }}
                                    />
                                </div>
                                {/* Source badge */}
                                <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${isYouTube ? 'bg-red-500' : 'bg-[#E60023]'} rounded-full border-2 border-dark dark:border-gray-600 flex items-center justify-center`}>
                                    <span className="text-white text-xs font-bold">{isYouTube ? '▶' : '📌'}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-black text-dark dark:text-white truncate">{idea.title}</h3>
                                <p className="text-xs text-dark/60 dark:text-white/60 line-clamp-1 mb-2">{idea.description}</p>
                                <div className="flex gap-2">
                                    <span className="inline-flex items-center px-2 py-0.5 bg-white dark:bg-dark-surface rounded-lg border border-dark dark:border-gray-600 text-xs font-bold text-dark dark:text-white">
                                        ⏱ {timeEstimate}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-0.5 bg-white dark:bg-dark-surface rounded-lg border border-dark dark:border-gray-600 text-xs font-bold text-dark dark:text-white">
                                        {idea.difficulty}
                                    </span>
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="w-8 h-8 bg-white dark:bg-dark-surface rounded-lg border-2 border-dark dark:border-gray-600 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-sm text-dark dark:text-white">chevron_right</span>
                            </div>
                        </div>
                    );
                })}

                {/* Find More */}
                <div className="pt-4 space-y-3">
                    <p className="text-sm font-bold text-dark/60 dark:text-white/60 text-center">Find More Ideas</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => openYouTubeSearch(item.objectName + ' upcycle')}
                            className="bg-white dark:bg-dark-surface py-3 rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm font-bold text-dark dark:text-white flex items-center justify-center gap-2"
                        >
                            <span className="text-red-500">▶</span>
                            YouTube
                        </button>
                        <button
                            onClick={() => openPinterestSearch(item.objectName + ' upcycle')}
                            className="bg-white dark:bg-dark-surface py-3 rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm font-bold text-dark dark:text-white flex items-center justify-center gap-2"
                        >
                            <span className="text-[#E60023]">📌</span>
                            Pinterest
                        </button>
                    </div>
                </div>

                {/* Back Button */}
                <button
                    onClick={() => router.push('/scanner/result')}
                    className="w-full bg-dark text-white py-4 rounded-2xl font-black uppercase tracking-wider shadow-brutal active:translate-y-1 active:shadow-none transition-all"
                >
                    Back to Result
                </button>
            </div>
        </div>
    );
}
