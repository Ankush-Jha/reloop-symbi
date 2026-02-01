'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DemoManager from '@/lib/demo-manager';
import { User } from '@/types';
import { StreakBadge } from '@/components/ui/StreakBadge';
import { BadgeRevealModal } from '@/components/ui/BadgeRevealModal';

// Badge metadata for display
const BADGE_META: Record<string, { name: string; description: string; icon: string; color: string }> = {
    'early-adopter': { name: 'Early Adopter', description: 'Joined ReLoop in the early days!', icon: '🌟', color: '#4ce68a' },
    'eco-warrior': { name: 'Eco Warrior', description: 'Saved over 10kg of CO2', icon: '🌿', color: '#dcfce7' },
    'first-trade': { name: 'First Trade', description: 'Completed your first successful trade', icon: '🤝', color: '#fde047' },
    'streak-7': { name: 'On Fire', description: 'Logged in 7 days in a row', icon: '🔥', color: '#fb923c' }
};

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [streak, setStreak] = useState(1);
    const [showBadgeReveal, setShowBadgeReveal] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState<any>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editName, setEditName] = useState('');
    const [toast, setToast] = useState('');

    useEffect(() => {
        setUser(DemoManager.getMockUser());
        setStreak(DemoManager.getStreak());
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="px-5 pt-6 pb-4 flex items-center justify-between">
                <Link
                    href="/"
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-dark-surface rounded-xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm"
                >
                    <span className="material-symbols-outlined text-dark dark:text-white">arrow_back</span>
                </Link>
                <div className="flex items-center gap-2">
                    <h1 className="font-black text-dark dark:text-white text-xl">Profile</h1>
                    <StreakBadge streak={streak} />
                </div>
                <Link
                    href="/settings"
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-dark-surface rounded-xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm"
                >
                    <span className="material-symbols-outlined text-dark dark:text-white">settings</span>
                </Link>
            </header>

            <div className="px-5 pb-28 space-y-5">
                {/* Profile Card */}
                <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-dark dark:border-gray-600 shadow-brutal p-6 text-center">
                    <div className="relative inline-block mb-4">
                        <div className="w-24 h-24 rounded-full border-4 border-dark dark:border-gray-600 overflow-hidden shadow-brutal-sm bg-white dark:bg-dark-surface">
                            <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-full border-2 border-dark dark:border-gray-600 flex items-center justify-center">
                            <span className="text-lg font-black text-dark dark:text-white">{user.level}</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-dark dark:text-white">{user.name}</h2>
                    <p className="text-dark/60 dark:text-white/60 font-medium">{user.levelTitle}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-card-green rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 text-center">
                        <p className="text-2xl font-black text-dark dark:text-white">{user.co2Saved}</p>
                        <p className="text-xs font-bold text-dark/60 dark:text-white/60">kg CO₂</p>
                    </div>
                    <div className="bg-card-yellow rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 text-center">
                        <p className="text-2xl font-black text-dark dark:text-white">{user.itemsTraded}</p>
                        <p className="text-xs font-bold text-dark/60 dark:text-white/60">Items</p>
                    </div>
                    <div className="bg-card-pink rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 text-center">
                        <p className="text-2xl font-black text-dark dark:text-white">{user.coins}</p>
                        <p className="text-xs font-bold text-dark/60 dark:text-white/60">Coins</p>
                    </div>
                </div>

                {/* Level Progress */}
                <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="font-black text-dark dark:text-white">Level Progress</p>
                        <p className="text-sm text-dark/60 dark:text-white/60">{user.xp} XP</p>
                    </div>
                    <div className="h-4 bg-gray-100 dark:bg-dark-surface rounded-full overflow-hidden border-2 border-dark dark:border-gray-600">
                        <div
                            className="h-full bg-primary transition-all rounded-full"
                            style={{ width: `${(user.xp % 500) / 5}%` }}
                        />
                    </div>
                    <p className="text-xs text-dark/60 dark:text-white/60 mt-2 text-right">
                        {500 - (user.xp % 500)} XP to Level {user.level + 1}
                    </p>
                </div>

                {/* Badges */}
                <div>
                    <p className="text-sm font-bold text-dark/60 dark:text-white/60 mb-3">Badges Earned</p>
                    <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4">
                        <div className="flex gap-3 flex-wrap">
                            {user.badges.map((badgeId) => {
                                const meta = BADGE_META[badgeId] || { name: badgeId, icon: '🏆', color: '#e5e7eb', description: 'Unlocked Badge' };
                                return (
                                    <button
                                        key={badgeId}
                                        onClick={() => {
                                            setSelectedBadge({ id: badgeId, ...meta });
                                            setShowBadgeReveal(true);
                                        }}
                                        className="w-14 h-14 rounded-xl border-2 border-dark dark:border-gray-600 flex items-center justify-center hover:scale-110 transition-transform"
                                        style={{ backgroundColor: meta.color }}
                                        title={meta.name}
                                    >
                                        <span className="text-2xl">{meta.icon}</span>
                                    </button>
                                );
                            })}
                            <div className="w-14 h-14 bg-gray-100 dark:bg-dark-surface rounded-xl border-2 border-dashed border-dark/30 flex items-center justify-center">
                                <span className="text-dark/30 dark:text-white/30 text-2xl">?</span>
                            </div>
                            <div className="w-14 h-14 bg-gray-100 dark:bg-dark-surface rounded-xl border-2 border-dashed border-dark/30 flex items-center justify-center">
                                <span className="text-dark/30 dark:text-white/30 text-2xl">?</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-2 gap-3">
                    <Link href="/impact" className="bg-card-green rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 flex items-center gap-3 hover:-translate-y-1 transition-transform">
                        <span className="material-symbols-outlined text-xl text-dark dark:text-white">eco</span>
                        <span className="font-bold text-dark dark:text-white text-sm">My Impact</span>
                    </Link>
                    <Link href="/trade-history" className="bg-card-yellow rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 flex items-center gap-3 hover:-translate-y-1 transition-transform">
                        <span className="material-symbols-outlined text-xl text-dark dark:text-white">history</span>
                        <span className="font-bold text-dark dark:text-white text-sm">Trade History</span>
                    </Link>
                    <Link href="/messages" className="bg-card-blue rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 flex items-center gap-3 hover:-translate-y-1 transition-transform">
                        <span className="material-symbols-outlined text-xl text-dark dark:text-white">chat</span>
                        <span className="font-bold text-dark dark:text-white text-sm">Messages</span>
                    </Link>
                    <Link href="/rewards" className="bg-card-pink rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 flex items-center gap-3 hover:-translate-y-1 transition-transform">
                        <span className="material-symbols-outlined text-xl text-dark dark:text-white">redeem</span>
                        <span className="font-bold text-dark dark:text-white text-sm">Rewards</span>
                    </Link>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => { setEditName(user.name); setShowEditModal(true); }}
                        className="bg-dark dark:bg-primary text-white dark:text-dark py-4 rounded-2xl font-bold shadow-brutal-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-lg">edit</span>
                        Edit
                    </button>
                    <button
                        onClick={() => {
                            const text = `I've saved ${user.co2Saved}kg CO₂, traded ${user.itemsTraded} items, and earned ${user.coins} ReCoins on ReLoop! 🌱`;
                            navigator.clipboard.writeText(text);
                            setToast('Impact copied to clipboard!');
                            setTimeout(() => setToast(''), 3000);
                        }}
                        className="bg-card-yellow text-dark py-4 rounded-2xl font-bold border-2 border-dark dark:border-gray-600 shadow-brutal-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-lg">share</span>
                        Share
                    </button>
                </div>
            </div>

            {selectedBadge && (
                <BadgeRevealModal
                    isOpen={showBadgeReveal}
                    onClose={() => setShowBadgeReveal(false)}
                    badge={selectedBadge}
                />
            )}

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-dark-surface w-full max-w-sm rounded-3xl p-6 border-2 border-dark dark:border-gray-600 shadow-brutal">
                        <h3 className="text-xl font-black text-dark dark:text-white mb-4">Edit Profile</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-dark/60 dark:text-white/60 mb-2 block">Display Name</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full h-12 rounded-xl bg-gray-50 dark:bg-dark border-2 border-dark dark:border-gray-600 px-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 py-3 bg-gray-100 dark:bg-dark border-2 border-transparent rounded-xl font-bold text-dark dark:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (editName.trim()) {
                                            DemoManager.updateUser({ name: editName.trim() });
                                            setUser(DemoManager.getMockUser());
                                            setShowEditModal(false);
                                            setToast('Profile updated!');
                                            setTimeout(() => setToast(''), 3000);
                                        }
                                    }}
                                    className="flex-1 py-3 bg-primary border-2 border-dark dark:border-gray-600 rounded-xl font-bold text-dark"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
