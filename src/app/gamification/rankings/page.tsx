'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DemoManager from '@/lib/demo-manager';
import { LeaderboardEntry } from '@/types';

export default function RankingsPage() {
    const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Separate top 3 and the rest for different display styles
    const topThree = rankings.slice(0, 3);
    const restList = rankings.slice(3);

    // Find user's campus or rank if available
    const userCampus = rankings.find(r => r.uid === 'your-campus');

    useEffect(() => {
        const loadRankings = async () => {
            setIsLoading(true);
            setRankings(DemoManager.getMockLeaderboard());
            setIsLoading(false);
        };
        loadRankings();
    }, []);

    // Helper to get placement colors
    const getPlaceColor = (index: number) => {
        switch (index) {
            case 0: return { bg: '#FFD700', text: 'text-black', border: 'border-black' }; // Gold
            case 1: return { bg: '#C0C0C0', text: 'text-black', border: 'border-black' }; // Silver
            case 2: return { bg: '#CD7F32', text: 'text-black', border: 'border-black' }; // Bronze
            default: return { bg: 'bg-white dark:bg-dark-surface', text: 'text-black', border: 'border-gray-200 dark:border-gray-700' };
        }
    };

    // Helper to format k (thousands)
    const formatK = (num?: number) => {
        if (!num) return '0';
        return num >= 1000 ? `${(num / 1000).toFixed(0)}k` : num.toString();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-dark-surface flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#e0f2fe] to-white dark:from-dark-bg dark:to-dark-surface pb-32">
            {/* Header */}
            <header className="flex flex-col gap-1 p-4 pt-8 pb-2 shrink-0 z-10">
                <div className="flex items-center justify-between mb-2">
                    <Link href="/" className="flex w-10 h-10 items-center justify-center rounded-full border-2 border-black bg-white dark:bg-dark-surface shadow-brutal-sm active:translate-y-[2px] active:shadow-none transition-all">
                        <span className="material-symbols-outlined text-black">arrow_back</span>
                    </Link>
                    <button className="flex w-10 h-10 items-center justify-center rounded-full border-2 border-black bg-white dark:bg-dark-surface shadow-brutal-sm active:translate-y-[2px] active:shadow-none transition-all">
                        <span className="material-symbols-outlined text-black">info</span>
                    </button>
                </div>
                <h1 className="text-black text-[40px] leading-[1.1] font-extrabold tracking-tight uppercase">Global<br />Ranking</h1>
                <p className="text-[#111714]/80 text-lg font-bold mt-1">Which campus is the greenest?</p>
            </header>

            {/* Podium Section */}
            <div className="w-full px-4 pt-6 pb-8">
                <div className="flex justify-center items-end gap-2 w-full max-w-md mx-auto h-[260px]">

                    {/* 2nd Place (Left) */}
                    <div className="flex flex-col items-center w-1/3 z-10">
                        <div className="relative mb-2 group">
                            <div className="w-16 h-16 rounded-full border-2 border-black bg-white dark:bg-dark-surface overflow-hidden shadow-brutal-sm z-10 relative">
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${topThree[1]?.logo}')` }}></div>
                            </div>
                            <div className="absolute -top-3 -right-2 bg-[#C0C0C0] text-black border-2 border-black text-xs font-bold px-2 py-0.5 rounded-full shadow-sm z-20">#2</div>
                        </div>
                        <div className="text-center mb-1">
                            <p className="font-bold text-sm leading-tight truncate w-full">{topThree[1]?.name}</p>
                            <p className="text-xs font-semibold text-[#648772]">{formatK(topThree[1]?.co2Saved)} Saved</p>
                        </div>
                        <div className="w-full h-[80px] bg-[#C0C0C0] border-2 border-black rounded-t-xl shadow-brutal-sm flex items-end justify-center pb-2 relative overflow-hidden">
                            <div className="opacity-20 absolute inset-0 bg-white dark:bg-dark-surface"></div>
                            <span className="text-2xl font-black opacity-30">2</span>
                        </div>
                    </div>

                    {/* 1st Place (Center) */}
                    <div className="flex flex-col items-center w-1/3 z-20 -mx-2 mb-0">
                        <div className="relative mb-2">
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl animate-bounce">👑</div>
                            <div className="w-20 h-20 rounded-full border-2 border-black bg-white dark:bg-dark-surface overflow-hidden shadow-brutal-sm z-10 relative ring-4 ring-yellow-400/30">
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${topThree[0]?.logo}')` }}></div>
                            </div>
                            <div className="absolute -top-3 -right-2 bg-[#FFD700] text-black border-2 border-black text-xs font-bold px-2 py-0.5 rounded-full shadow-sm z-20">#1</div>
                        </div>
                        <div className="text-center mb-1">
                            <p className="font-bold text-base leading-tight truncate w-full">{topThree[0]?.name}</p>
                            <p className="text-xs font-semibold text-[#648772]">{formatK(topThree[0]?.co2Saved)} Saved</p>
                        </div>
                        <div className="w-full h-[110px] bg-[#FFD700] border-2 border-black rounded-t-xl shadow-[5px_5px_0px_0px_#000000] flex items-end justify-center pb-2 relative overflow-hidden">
                            <div className="opacity-20 absolute inset-0 bg-white dark:bg-dark-surface"></div>
                            <span className="text-3xl font-black opacity-30">1</span>
                        </div>
                    </div>

                    {/* 3rd Place (Right) */}
                    <div className="flex flex-col items-center w-1/3 z-10">
                        <div className="relative mb-2">
                            <div className="w-16 h-16 rounded-full border-2 border-black bg-white dark:bg-dark-surface overflow-hidden shadow-brutal-sm z-10 relative">
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${topThree[2]?.logo}')` }}></div>
                            </div>
                            <div className="absolute -top-3 -right-2 bg-[#CD7F32] text-black border-2 border-black text-xs font-bold px-2 py-0.5 rounded-full shadow-sm z-20">#3</div>
                        </div>
                        <div className="text-center mb-1">
                            <p className="font-bold text-sm leading-tight truncate w-full">{topThree[2]?.name}</p>
                            <p className="text-xs font-semibold text-[#648772]">{formatK(topThree[2]?.co2Saved)} Saved</p>
                        </div>
                        <div className="w-full h-[60px] bg-[#CD7F32] border-2 border-black rounded-t-xl shadow-brutal-sm flex items-end justify-center pb-2 relative overflow-hidden">
                            <div className="opacity-20 absolute inset-0 bg-white dark:bg-dark-surface"></div>
                            <span className="text-2xl font-black opacity-30">3</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* List Section */}
            <div className="flex flex-col gap-4 px-4 w-full max-w-md mx-auto">
                {restList.map((rank, i) => (
                    rank.uid !== 'your-campus' && (
                        <div key={rank.uid} className="group relative flex items-center justify-between gap-3 rounded-[24px] border-2 border-black bg-white dark:bg-dark-surface p-3 shadow-brutal-sm transition-transform active:scale-[0.98]">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className="text-xl font-bold text-black/40 w-8 text-center shrink-0">{i + 4 < 10 ? `0${i + 4}` : i + 4}</span>
                                <div className="w-12 h-12 rounded-full border border-black bg-gray-100 dark:bg-dark-surface shrink-0 bg-cover bg-center" style={{ backgroundImage: `url('${rank.logo}')` }}></div>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-base font-bold text-black truncate pr-2">{rank.name}</p>
                                        <p className="text-xs font-bold text-black shrink-0">{formatK(rank.co2Saved)} kg</p>
                                    </div>
                                    {/* Progress Bar (Simulated relative to top score) */}
                                    <div className="w-full h-3 bg-gray-100 dark:bg-dark-surface rounded-full border border-black overflow-hidden relative">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-primary"
                                            style={{ width: `${((rank.co2Saved || 0) / (topThree[0]?.co2Saved || 1)) * 100}%` }}
                                        ></div>
                                        {i === 0 && <div className="absolute top-0 right-0 h-full w-full opacity-10 bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[size:4px_4px]"></div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>

            {/* Sticky User Footer */}
            {userCampus && (
                <div className="fixed bottom-0 left-0 w-full p-4 z-50">
                    <div className="relative w-full max-w-md mx-auto rounded-[28px] border-2 border-black bg-[#10b981] p-4 shadow-[5px_5px_0px_0px_#000000] overflow-hidden">
                        {/* Background pattern for texture */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:8px_8px]"></div>

                        <div className="relative flex items-center gap-3 z-10">
                            <div className="flex flex-col items-center justify-center bg-black rounded-xl h-12 w-12 shrink-0 border border-white/20">
                                <span className="text-white text-xs font-medium uppercase">Rank</span>
                                <span className="text-white text-lg font-bold leading-none">{userCampus.level}</span>
                            </div>
                            <div className="flex flex-col flex-1 min-w-0 gap-1">
                                <div className="flex justify-between items-center text-white">
                                    <span className="font-bold text-base">{userCampus.name}</span>
                                    <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">{userCampus.co2Saved?.toLocaleString()} kg</span>
                                </div>
                                <div className="w-full h-4 bg-black/20 rounded-full border border-black/10 overflow-hidden">
                                    <div className="h-full bg-white dark:bg-dark-surface rounded-full relative" style={{ width: '35%' }}>
                                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.05)_25%,rgba(0,0,0,0.05)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.05)_75%,rgba(0,0,0,0.05)_100%)] bg-[length:10px_10px]"></div>
                                    </div>
                                </div>
                            </div>
                            <button className="bg-white dark:bg-dark-surface text-black w-10 h-10 rounded-full border-2 border-black flex items-center justify-center shadow-sm shrink-0 active:scale-95 transition-transform">
                                <span className="material-symbols-outlined font-bold">arrow_upward</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
