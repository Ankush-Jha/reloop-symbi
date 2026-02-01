// ReLoop TypeScript Types

export interface User {
    uid: string;
    name: string;
    email: string;
    photoURL?: string;
    coins: number;
    xp: number;
    level: number;
    levelTitle: string;
    itemsTraded: number;
    co2Saved: number;
    badges: string[];
    campus?: string;
}

export interface UpcycleIdea {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    thumbnail?: string;
    source?: 'youtube' | 'pinterest';
}

export interface ScanResult {
    success: boolean;
    item: {
        objectName: string;
        category: string;
        material?: string;
        condition?: string;
        confidence: number;
        estimatedCoins: number;
        co2Savings: number;
        upcycleIdeas: UpcycleIdea[];
        recyclable?: boolean;
        recycleInfo?: string;
    };
}

export interface Listing {
    id: string;
    title: string;
    description: string;
    price: number;
    condition: string;
    category: string;
    images: string[];
    location?: string;
    isTopImpact?: boolean;
    co2Saved?: number;
    seller: {
        id: string;
        name: string;
        avatar?: string;
        co2Saved?: number;
        itemsTraded?: number;
        responseTime?: string;
    };
    status: 'available' | 'sold' | 'pending';
    createdAt: Date;
}


export interface Mission {
    id: string;
    title: string;
    icon: string;
    target: number;
    progress: number;
    xpReward: number;
    coinsReward: number;
    completed: boolean;
    claimed: boolean;
}

export interface LeaderboardEntry {
    uid: string;
    name: string;
    xp: number;
    level: number;
    avatar?: string;
    co2Saved?: number;
    // Campus specific
    rank?: number;
    type?: 'student' | 'campus';
    logo?: string;
}

export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    lastMessage: string;
    timestamp: Date;
    unread: boolean;
    listingTitle?: string;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
    isOwn: boolean;
}

export interface Notification {
    id: string;
    type: 'trade' | 'achievement' | 'system' | 'coin' | 'level';
    title: string;
    message: string;
    icon: string;
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
}

export interface Trade {
    id: string;
    listingId: string;
    listingTitle: string;
    listingImage: string;
    traderId: string;
    traderName: string;
    traderAvatar: string;
    offeredItem?: string;
    offeredCoins?: number;
    status: 'pending' | 'accepted' | 'completed' | 'declined';
    createdAt: Date;
    completedAt?: Date;
    co2Saved?: number;
}

export interface Story {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    authorAvatar: string;
    campus: string;
    image: string;
    co2Saved: number;
    itemsTraded: number;
    category: string;
    createdAt: Date;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    progress: number;
    target: number;
    unlocked: boolean;
    unlockedAt?: Date;
    xpReward: number;
    category: 'scanning' | 'trading' | 'social' | 'streak' | 'impact';
}

export interface Reward {
    id: string;
    title: string;
    description: string;
    icon: string;
    cost: number;
    category: 'voucher' | 'merch' | 'donation' | 'experience';
    available: boolean;
    partnerLogo?: string;
}

export interface Tutorial {
    id: string;
    title: string;
    description: string;
    icon: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    color: string;
    steps: TutorialStep[];
    estimatedTime: string;
}

export interface TutorialStep {
    title: string;
    content: string;
    image?: string;
    tip?: string;
}

export interface WrappedStats {
    totalScans: number;
    totalTrades: number;
    totalCo2Saved: number;
    totalCoinsEarned: number;
    topCategory: string;
    rank: number;
    totalUsers: number;
    streakRecord: number;
    badgesEarned: number;
    impactEquivalent: string;
}
