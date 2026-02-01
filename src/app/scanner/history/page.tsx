'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DemoManager from '@/lib/demo-manager';
import { ScanResult } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import ScannerService from '@/lib/scanner-service';

export default function ScanHistoryPage() {
    const router = useRouter();
    const [history, setHistory] = useState<ScanResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading for better UX
        setTimeout(() => {
            setHistory(DemoManager.getScanHistory());
            setIsLoading(false);
        }, 500);
    }, []);

    const handleItemClick = (result: ScanResult) => {
        // Store as "current" result so result page can display it
        ScannerService.storeResult(result);
        router.push('/scanner/result');
    };

    return (
        <div className="min-h-screen bg-background">
            <PageHeader title="Scan History" backHref="/scanner" />

            <div className="px-5 pb-28 space-y-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : history.length === 0 ? (
                    <EmptyState
                        icon="history"
                        title="No scans yet"
                        description="Items you scan will appear here."
                    />
                ) : (
                    history.map((scan, index) => (
                        <div
                            key={index}
                            onClick={() => handleItemClick(scan)}
                            className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 flex items-center gap-4 active:scale-95 transition-transform cursor-pointer"
                        >
                            <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0 border-2 border-dark dark:border-gray-600">
                                <span className="material-symbols-outlined text-3xl text-dark dark:text-white">
                                    {scan.item.category === 'Electronics' ? 'devices' :
                                        scan.item.category === 'Clothing' ? 'apparel' :
                                            scan.item.category === 'Books' ? 'menu_book' :
                                                'recycling'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-dark dark:text-white truncate">{scan.item.objectName}</h3>
                                <p className="text-sm text-dark/60 dark:text-white/60">{scan.item.category}</p>
                                <div className="flex gap-3 mt-1">
                                    <span className="text-xs font-bold text-primary flex items-center gap-0.5">
                                        🪙 +{scan.item.estimatedCoins}
                                    </span>
                                    <span className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-0.5">
                                        🌱 {scan.item.co2Savings}kg
                                    </span>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm text-dark dark:text-white">arrow_forward</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
