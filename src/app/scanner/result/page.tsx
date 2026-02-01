'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ScannerService from '@/lib/scanner-service';
import { ScanResult } from '@/types';
import { useNavStore } from '@/lib/store/nav-store';

export default function ScanResultPage() {
    const router = useRouter();
    const [result, setResult] = useState<ScanResult | null>(null);
    const [scannedImage, setScannedImage] = useState<string | null>(null);
    const { setActions, reset } = useNavStore();

    useEffect(() => {
        const storedResult = ScannerService.getStoredResult();
        const storedImage = ScannerService.getStoredImage();

        if (!storedResult) {
            router.push('/scanner');
            return;
        }

        setResult(storedResult);
        setScannedImage(storedImage);
    }, [router]);

    // Register nav action
    useEffect(() => {
        setActions({
            label: 'Done',
            onClick: () => router.push('/'),
            variant: 'primary'
        });

        // Cleanup on unmount
        return () => reset();
    }, [router]);

    if (!result) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const { item } = result;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="px-5 pt-6 pb-4 flex items-center gap-4">
                <Link
                    href="/scanner"
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-dark-surface rounded-xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm"
                >
                    <span className="material-symbols-outlined text-dark dark:text-white">arrow_back</span>
                </Link>
                <h1 className="font-black text-dark dark:text-white text-xl">Scan Result</h1>
            </header>

            <div className="px-5 pb-28 space-y-5">
                {/* Success Card */}
                <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-dark dark:border-gray-600 shadow-brutal p-6 text-center">
                    <div className="w-16 h-16 bg-card-green rounded-full border-2 border-dark dark:border-gray-600 mx-auto flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-4xl text-dark dark:text-white">check</span>
                    </div>
                    <h2 className="text-2xl font-black text-dark dark:text-white">{item.objectName}</h2>
                    <p className="text-dark/60 dark:text-white/60 font-medium mt-1">{item.category}</p>
                </div>

                {/* Rewards */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card-yellow rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-5 text-center">
                        <p className="text-4xl font-black text-dark dark:text-white">+{item.estimatedCoins}</p>
                        <p className="text-sm font-bold text-dark/70 dark:text-white/70 mt-1">Coins</p>
                    </div>
                    <div className="bg-card-green rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-5 text-center">
                        <p className="text-4xl font-black text-dark dark:text-white">{item.co2Savings}</p>
                        <p className="text-sm font-bold text-dark/70 dark:text-white/70 mt-1">kg CO₂</p>
                    </div>
                </div>

                {/* Scanned Image */}
                {scannedImage && (
                    <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm overflow-hidden">
                        <img src={scannedImage} alt="Scanned item" className="w-full h-40 object-cover" />
                    </div>
                )}

                {/* Action Options */}
                <div className="space-y-3">
                    <p className="font-black text-dark dark:text-white text-sm">What would you like to do?</p>

                    <Link href="/scanner/ideas">
                        <div className="bg-card-pink rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 flex items-center gap-4 card-hover">
                            <div className="w-12 h-12 bg-white dark:bg-dark-surface rounded-xl border-2 border-dark dark:border-gray-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl text-dark dark:text-white">recycling</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-dark dark:text-white">Reuse It</p>
                                <p className="text-sm text-dark/60 dark:text-white/60">Get creative upcycling ideas</p>
                            </div>
                            <div className="w-8 h-8 bg-white dark:bg-dark-surface rounded-lg border-2 border-dark dark:border-gray-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm text-dark dark:text-white">chevron_right</span>
                            </div>
                        </div>
                    </Link>

                    <Link href="/marketplace/create">
                        <div className="bg-card-blue rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 flex items-center gap-4 card-hover">
                            <div className="w-12 h-12 bg-white dark:bg-dark-surface rounded-xl border-2 border-dark dark:border-gray-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl text-dark dark:text-white">storefront</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-dark dark:text-white">Trade It</p>
                                <p className="text-sm text-dark/60 dark:text-white/60">List on the marketplace</p>
                            </div>
                            <div className="w-8 h-8 bg-white dark:bg-dark-surface rounded-lg border-2 border-dark dark:border-gray-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm text-dark dark:text-white">chevron_right</span>
                            </div>
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    );
}
