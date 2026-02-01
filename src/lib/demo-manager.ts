'use client';

import { User, ScanResult, Listing, UpcycleIdea, Mission, LeaderboardEntry, Message, ChatMessage, Notification, Trade, Story, Achievement, Reward, Tutorial, WrappedStats } from '@/types';

// ─── Storage Keys ────────────────────────────────────────────────
const KEYS = {
    DEMO_MODE: 'reloop_demo_mode',
    USER: 'reloop_user',
    LISTINGS: 'reloop_listings',
    TRADES: 'reloop_trades',
    MISSIONS: 'reloop_missions',
    MESSAGES: 'reloop_messages',
    CONVERSATIONS: 'reloop_conversations',
    NOTIFICATIONS: 'reloop_notifications',
    REDEEMED: 'reloop_redeemed',
    SEEDED: 'reloop_seeded',
    STREAK: 'reloop_streak',
};

// ─── Persistence Helpers ─────────────────────────────────────────
function _save<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.warn('ReLoop: localStorage write failed', e);
    }
}

function _load<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

// ─── Mock Seed Data ──────────────────────────────────────────────

const SEED_USER: User = {
    uid: 'demo-user-123',
    name: 'Demo Hero',
    email: 'demo@reloop.app',
    photoURL: 'https://ui-avatars.com/api/?name=Demo+Hero&background=4ce68a&color=fff',
    coins: 1250,
    xp: 2400,
    level: 5,
    levelTitle: 'Eco Champion',
    itemsTraded: 23,
    co2Saved: 45.2,
    badges: ['early-adopter', 'eco-warrior', 'first-trade'],
    campus: 'ReLoop Campus'
};

const MOCK_SCAN_ITEMS = [
    {
        objectName: 'Vintage Denim Jacket',
        category: 'Clothing',
        estimatedCoins: 45,
        co2Savings: 12.5,
        confidence: 0.98,
        upcycleIdeas: [
            { title: 'Denim Tote Bag', difficulty: 'Medium' as const, description: 'Convert into a sturdy reusable shopping bag.', thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&h=200&fit=crop', source: 'pinterest' as const },
            { title: 'Patchwork Quilt', difficulty: 'Hard' as const, description: 'Combine with other fabrics for a cozy blanket.', thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop', source: 'youtube' as const },
            { title: 'Denim Planters', difficulty: 'Easy' as const, description: 'Use pockets as small planters for succulents.', thumbnail: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&h=200&fit=crop', source: 'pinterest' as const }
        ]
    },
    {
        objectName: 'Glass Bottle',
        category: 'Recyclables',
        estimatedCoins: 15,
        co2Savings: 2.1,
        confidence: 0.97,
        upcycleIdeas: [
            { title: 'Boho Vase', difficulty: 'Easy' as const, description: 'Wrap with twine or paint for a rustic look.', thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop', source: 'pinterest' as const },
            { title: 'Candle Holder', difficulty: 'Medium' as const, description: 'Cut and sand the top for a tea light holder.', thumbnail: 'https://images.unsplash.com/photo-1567361808960-dec9cb578182?w=200&h=200&fit=crop', source: 'youtube' as const },
            { title: 'Terrarium', difficulty: 'Hard' as const, description: 'Create a mini ecosystem with moss and plants.', thumbnail: 'https://images.unsplash.com/photo-1446071103084-c257b5f70672?w=200&h=200&fit=crop', source: 'youtube' as const }
        ]
    },
    {
        objectName: 'Ceramic Vase',
        category: 'Home Decor',
        estimatedCoins: 30,
        co2Savings: 8.3,
        confidence: 0.95,
        upcycleIdeas: [
            { title: 'Pen Holder', difficulty: 'Easy' as const, description: 'Perfect desk organizer for pens and pencils.', thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=200&h=200&fit=crop', source: 'pinterest' as const },
            { title: 'Mosaic Art Piece', difficulty: 'Medium' as const, description: 'Break into pieces for beautiful mosaic art.', thumbnail: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&h=200&fit=crop', source: 'youtube' as const },
            { title: 'Fairy Light Display', difficulty: 'Easy' as const, description: 'Add string lights for magical ambient lighting.', thumbnail: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=200&h=200&fit=crop', source: 'pinterest' as const }
        ]
    }
];

const SEED_LISTINGS: Listing[] = [
    {
        id: 'vintage-denim-jacket',
        title: 'Vintage Denim Jacket',
        description: "Found this gem at a vintage exchange! It's super sturdy, classic 90s cut, and fits oversized. No stains or tears.",
        price: 45, condition: 'Like New ✨', category: 'Clothing 👕', location: 'Campus Center',
        isTopImpact: true, co2Saved: 12.5,
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500'],
        seller: { id: 'sarah-j', name: 'Sarah J.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100', co2Saved: 85, itemsTraded: 34, responseTime: '2h' },
        status: 'available', createdAt: new Date()
    },
    {
        id: 'vintage-camera',
        title: 'Vintage Camera',
        description: 'Classic 35mm film camera in working condition. Perfect for photography enthusiasts who want to try film.',
        price: 150, condition: 'Good', category: 'Electronics 📱', location: 'Library',
        isTopImpact: false, co2Saved: 8.2,
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500'],
        seller: { id: 'demo-seller-1', name: 'RetroFan', avatar: 'https://ui-avatars.com/api/?name=Retro+Fan&background=4ce68a&color=111', co2Saved: 85, itemsTraded: 34, responseTime: '1h' },
        status: 'available', createdAt: new Date()
    },
    {
        id: 'succulent-pot-set',
        title: 'Succulent Pot Set',
        description: 'Set of 3 ceramic planters with drainage holes. Perfect for your desk or windowsill garden.',
        price: 25, condition: 'Like New ✨', category: 'Home & Garden 🌱', location: 'Dorm Building A',
        isTopImpact: true, co2Saved: 3.2,
        images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=500'],
        seller: { id: 'demo-seller-2', name: 'PlantMom', avatar: 'https://ui-avatars.com/api/?name=Plant+Mom&background=4ce68a&color=111', co2Saved: 42, itemsTraded: 18, responseTime: '30min' },
        status: 'available', createdAt: new Date()
    },
    {
        id: 'calculus-textbook',
        title: 'Calculus Textbook',
        description: 'Essential for MATH 201. Minimal highlighting. Save over $100 compared to bookstore price!',
        price: 35, condition: 'Used', category: 'Books 📚', location: 'Math Building',
        isTopImpact: false, co2Saved: 5.5,
        images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500'],
        seller: { id: 'demo-seller-3', name: 'GradStudent', avatar: 'https://ui-avatars.com/api/?name=Grad+Student&background=4ce68a&color=111', co2Saved: 28, itemsTraded: 12, responseTime: '4h' },
        status: 'available', createdAt: new Date()
    },
    {
        id: 'noise-cancelling-headphones',
        title: 'Noise Cancelling Headphones',
        description: 'Sony WH-1000XM3. Battery holds 20+ hours. Great for studying in noisy environments.',
        price: 180, condition: 'Good', category: 'Electronics 📱', location: 'Student Union',
        isTopImpact: true, co2Saved: 15.8,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500'],
        seller: { id: 'demo-seller-4', name: 'TechDude', avatar: 'https://ui-avatars.com/api/?name=Tech+Dude&background=4ce68a&color=111', co2Saved: 65, itemsTraded: 27, responseTime: '1h' },
        status: 'available', createdAt: new Date()
    },
    {
        id: 'desk-lamp',
        title: 'Modern Desk Lamp',
        description: 'Adjustable LED desk lamp with USB charging port. 3 brightness levels, touch control.',
        price: 20, condition: 'Like New ✨', category: 'Home & Garden 🌱', location: 'Engineering Building',
        isTopImpact: false, co2Saved: 2.1,
        images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500'],
        seller: { id: 'demo-seller-5', name: 'NightOwl', avatar: 'https://ui-avatars.com/api/?name=Night+Owl&background=4ce68a&color=111', co2Saved: 15, itemsTraded: 8, responseTime: '3h' },
        status: 'available', createdAt: new Date()
    }
];

const SEED_LEADERBOARD: LeaderboardEntry[] = [
    { uid: 'yale', name: 'Yale', xp: 50000, level: 1, type: 'campus', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Yale_University_Shield_1.svg/1200px-Yale_University_Shield_1.svg.png', co2Saved: 50000 },
    { uid: 'stanford', name: 'Stanford', xp: 42000, level: 2, type: 'campus', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/1200px-Stanford_Cardinal_logo.svg.png', co2Saved: 42000 },
    { uid: 'oxford', name: 'Oxford', xp: 38000, level: 3, type: 'campus', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2f/University_of_Oxford.svg/1200px-University_of_Oxford.svg.png', co2Saved: 38000 },
    { uid: 'berkeley', name: 'UC Berkeley', xp: 35000, level: 4, type: 'campus', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/1/Seal_of_University_of_California%2C_Berkeley.svg/1200px-Seal_of_University_of_California%2C_Berkeley.svg.png', co2Saved: 35000 },
    { uid: 'mit', name: 'MIT', xp: 31000, level: 5, type: 'campus', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png', co2Saved: 31000 },
    { uid: 'usc', name: 'USC', xp: 28000, level: 6, type: 'campus', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/USC_Trojans_logo.svg/1200px-USC_Trojans_logo.svg.png', co2Saved: 28000 },
    { uid: 'cornell', name: 'Cornell', xp: 22000, level: 7, type: 'campus', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Cornell_University_seal.svg/1200px-Cornell_University_seal.svg.png', co2Saved: 22000 },
    { uid: 'northwestern', name: 'Northwestern', xp: 19000, level: 8, type: 'campus', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Northwestern_Wildcats_logo.svg/1200px-Northwestern_Wildcats_logo.svg.png', co2Saved: 19000 },
    { uid: 'your-campus', name: 'Your Campus', xp: 15400, level: 12, type: 'campus', logo: 'https://ui-avatars.com/api/?name=Your+Campus&background=10b981&color=fff', co2Saved: 15400 },
];

const SEED_MISSIONS: Mission[] = [
    { id: 'scan-1', title: 'Scan 1 Item', icon: 'photo_camera', target: 1, progress: 0, xpReward: 50, coinsReward: 10, completed: false, claimed: false },
    { id: 'trade-1', title: 'Complete a Trade', icon: 'swap_horiz', target: 1, progress: 0, xpReward: 100, coinsReward: 25, completed: false, claimed: false },
    { id: 'share-1', title: 'Share Your Impact', icon: 'share', target: 1, progress: 0, xpReward: 30, coinsReward: 5, completed: false, claimed: false },
    { id: 'scan-3', title: 'Scan 3 Items Today', icon: 'photo_camera', target: 3, progress: 1, xpReward: 100, coinsReward: 20, completed: false, claimed: false },
    { id: 'trade-5', title: 'Complete 5 Trades', icon: 'swap_horiz', target: 5, progress: 3, xpReward: 250, coinsReward: 50, completed: false, claimed: false },
    { id: 'streak-7', title: '7-Day Login Streak', icon: 'local_fire_department', target: 7, progress: 4, xpReward: 200, coinsReward: 40, completed: false, claimed: false },
];

const SEED_MESSAGES: Message[] = [
    { id: 'msg-1', senderId: 'sarah-j', senderName: 'Sarah J.', senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100', lastMessage: 'Hey! Is the denim jacket still available?', timestamp: new Date(Date.now() - 300000), unread: true, listingTitle: 'Vintage Denim Jacket' },
    { id: 'msg-2', senderId: 'demo-seller-1', senderName: 'RetroFan', senderAvatar: 'https://ui-avatars.com/api/?name=Retro+Fan&background=4ce68a&color=111', lastMessage: 'Sure, we can meet at the library!', timestamp: new Date(Date.now() - 3600000), unread: false, listingTitle: 'Vintage Camera' },
    { id: 'msg-3', senderId: 'demo-seller-2', senderName: 'PlantMom', senderAvatar: 'https://ui-avatars.com/api/?name=Plant+Mom&background=4ce68a&color=111', lastMessage: 'Thanks for the trade! Enjoy the succulents 🌱', timestamp: new Date(Date.now() - 86400000), unread: false, listingTitle: 'Succulent Pot Set' },
    { id: 'msg-4', senderId: 'demo-seller-4', senderName: 'TechDude', senderAvatar: 'https://ui-avatars.com/api/?name=Tech+Dude&background=4ce68a&color=111', lastMessage: 'Can you do 150 coins instead?', timestamp: new Date(Date.now() - 172800000), unread: true, listingTitle: 'Noise Cancelling Headphones' },
];

const SEED_CONVERSATIONS: Record<string, ChatMessage[]> = {
    'sarah-j': [
        { id: 'chat-1', senderId: 'sarah-j', text: 'Hey! I saw your listing for the Vintage Denim Jacket', timestamp: new Date(Date.now() - 600000), isOwn: false },
        { id: 'chat-2', senderId: 'demo-user-123', text: 'Hi! Yes, it\'s still available!', timestamp: new Date(Date.now() - 540000), isOwn: true },
        { id: 'chat-3', senderId: 'sarah-j', text: 'Awesome! Can we meet at the Campus Center today?', timestamp: new Date(Date.now() - 480000), isOwn: false },
        { id: 'chat-4', senderId: 'demo-user-123', text: 'Sure! How about 3 PM?', timestamp: new Date(Date.now() - 420000), isOwn: true },
        { id: 'chat-5', senderId: 'sarah-j', text: 'Perfect! See you then 😊', timestamp: new Date(Date.now() - 360000), isOwn: false },
    ],
};

const SEED_NOTIFICATIONS: Notification[] = [
    { id: 'notif-1', type: 'trade', title: 'Trade Request', message: 'Sarah J. wants to trade for your Vintage Denim Jacket', icon: 'swap_horiz', timestamp: new Date(Date.now() - 300000), read: false, actionUrl: '/trade-history' },
    { id: 'notif-2', type: 'achievement', title: 'Badge Unlocked!', message: 'You earned the "Eco Warrior" badge!', icon: 'military_tech', timestamp: new Date(Date.now() - 3600000), read: false, actionUrl: '/gamification/achievements' },
    { id: 'notif-3', type: 'coin', title: 'Coins Earned', message: 'You earned +45 ReCoins from scanning!', icon: 'monetization_on', timestamp: new Date(Date.now() - 7200000), read: true },
    { id: 'notif-4', type: 'level', title: 'Level Up!', message: 'Congratulations! You reached Level 5 - Eco Champion', icon: 'arrow_upward', timestamp: new Date(Date.now() - 86400000), read: true, actionUrl: '/gamification/level-up' },
    { id: 'notif-5', type: 'system', title: 'Weekly Mission Reset', message: 'New weekly missions are available. Check them out!', icon: 'flag', timestamp: new Date(Date.now() - 172800000), read: true, actionUrl: '/gamification/missions' },
    { id: 'notif-6', type: 'trade', title: 'Trade Completed', message: 'Your trade with PlantMom was successful!', icon: 'check_circle', timestamp: new Date(Date.now() - 259200000), read: true },
];

const SEED_TRADES: Trade[] = [
    { id: 'trade-1', listingId: 'vintage-denim-jacket', listingTitle: 'Vintage Denim Jacket', listingImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500', traderId: 'sarah-j', traderName: 'Sarah J.', traderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100', offeredCoins: 45, status: 'pending', createdAt: new Date(Date.now() - 300000), co2Saved: 12.5 },
    { id: 'trade-2', listingId: 'succulent-pot-set', listingTitle: 'Succulent Pot Set', listingImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=500', traderId: 'demo-seller-2', traderName: 'PlantMom', traderAvatar: 'https://ui-avatars.com/api/?name=Plant+Mom&background=4ce68a&color=111', offeredItem: 'Mini Cactus Collection', status: 'completed', createdAt: new Date(Date.now() - 604800000), completedAt: new Date(Date.now() - 518400000), co2Saved: 3.2 },
    { id: 'trade-3', listingId: 'calculus-textbook', listingTitle: 'Calculus Textbook', listingImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500', traderId: 'demo-seller-3', traderName: 'GradStudent', traderAvatar: 'https://ui-avatars.com/api/?name=Grad+Student&background=4ce68a&color=111', offeredCoins: 35, status: 'completed', createdAt: new Date(Date.now() - 1209600000), completedAt: new Date(Date.now() - 1123200000), co2Saved: 5.5 },
    { id: 'trade-4', listingId: 'noise-cancelling-headphones', listingTitle: 'Noise Cancelling Headphones', listingImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500', traderId: 'demo-seller-4', traderName: 'TechDude', traderAvatar: 'https://ui-avatars.com/api/?name=Tech+Dude&background=4ce68a&color=111', offeredCoins: 180, status: 'declined', createdAt: new Date(Date.now() - 1814400000), co2Saved: 15.8 },
];

const SEED_STORIES: Story[] = [
    { id: 'story-ananya', title: 'From Waste to Wonder', excerpt: 'How Ananya turned campus waste into art installations', content: 'Ananya, a 3rd-year design student, started collecting discarded materials from the campus cafeteria. What began as a small project for her sustainability class turned into a campus-wide movement. She created stunning art installations from plastic bottles, old textbooks, and broken electronics.\n\n"I realized that what we call waste is just material waiting for a purpose," says Ananya. Her installations now decorate three campus buildings, and she\'s inspired over 200 students to start their own upcycling projects.\n\nThrough ReLoop, Ananya has traded over 150 items, saved 120kg of CO2, and earned enough ReCoins to fund her next art project.', author: 'Ananya Sharma', authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100', campus: 'Delhi University', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500', co2Saved: 120, itemsTraded: 150, category: 'Art & Design', createdAt: new Date(Date.now() - 2592000000) },
    { id: 'story-rahul', title: 'The Textbook Revolution', excerpt: 'Rahul saved his entire dorm $5000 on textbooks', content: 'When Rahul noticed his classmates spending hundreds on textbooks each semester, he decided to create a campus-wide textbook exchange using ReLoop. Within one semester, his initiative saved students over $5000.\n\n"The marketplace made it so easy. Instead of buying new books, students could trade their old ones," Rahul explains. He organized weekly swap meets at the library, where students could bring their old textbooks and find new ones.\n\nHis efforts earned him the "Campus Hero" badge on ReLoop and he was featured in the university newsletter.', author: 'Rahul Patel', authorAvatar: 'https://ui-avatars.com/api/?name=Rahul+Patel&background=4ce68a&color=fff', campus: 'IIT Bombay', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500', co2Saved: 85, itemsTraded: 200, category: 'Books & Education', createdAt: new Date(Date.now() - 5184000000) },
    { id: 'story-priya', title: 'Zero Waste Dorm Room', excerpt: 'Priya achieved a completely zero-waste lifestyle on campus', content: 'Priya challenged herself to produce zero waste for an entire semester. Using ReLoop\'s scanning feature, she found creative ways to upcycle everything from old clothes to electronics.\n\n"The AI scanner was a game changer. It showed me possibilities I never imagined," she says. Her dorm room became a model for sustainable living, attracting visits from other students and even faculty.\n\nPriya documented her journey on social media, gaining over 10,000 followers. She now mentors other students looking to reduce their environmental footprint.', author: 'Priya Krishnan', authorAvatar: 'https://ui-avatars.com/api/?name=Priya+K&background=4ce68a&color=fff', campus: 'BITS Pilani', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=500', co2Saved: 95, itemsTraded: 78, category: 'Lifestyle', createdAt: new Date(Date.now() - 7776000000) },
];

const SEED_ACHIEVEMENTS: Achievement[] = [
    { id: 'first-scan', name: 'First Scan', description: 'Complete your first item scan', icon: '📸', color: '#4ce68a', progress: 1, target: 1, unlocked: true, unlockedAt: new Date(Date.now() - 2592000000), xpReward: 50, category: 'scanning' },
    { id: 'scan-master', name: 'Scan Master', description: 'Scan 50 items', icon: '🔍', color: '#dcfce7', progress: 23, target: 50, unlocked: false, xpReward: 500, category: 'scanning' },
    { id: 'first-trade', name: 'First Trade', description: 'Complete your first trade', icon: '🤝', color: '#fde047', progress: 1, target: 1, unlocked: true, unlockedAt: new Date(Date.now() - 1728000000), xpReward: 100, category: 'trading' },
    { id: 'trade-pro', name: 'Trade Pro', description: 'Complete 25 trades', icon: '💼', color: '#fef9c3', progress: 23, target: 25, unlocked: false, xpReward: 500, category: 'trading' },
    { id: 'eco-warrior', name: 'Eco Warrior', description: 'Save 10kg of CO2', icon: '🌿', color: '#dcfce7', progress: 10, target: 10, unlocked: true, unlockedAt: new Date(Date.now() - 864000000), xpReward: 200, category: 'impact' },
    { id: 'planet-saver', name: 'Planet Saver', description: 'Save 100kg of CO2', icon: '🌍', color: '#e0f2fe', progress: 45, target: 100, unlocked: false, xpReward: 1000, category: 'impact' },
    { id: 'social-butterfly', name: 'Social Butterfly', description: 'Share your impact 5 times', icon: '🦋', color: '#fce7f3', progress: 2, target: 5, unlocked: false, xpReward: 150, category: 'social' },
    { id: 'streak-7', name: '7-Day Streak', description: 'Log in 7 days in a row', icon: '🔥', color: '#fb923c', progress: 4, target: 7, unlocked: false, xpReward: 200, category: 'streak' },
    { id: 'streak-30', name: '30-Day Streak', description: 'Log in 30 days in a row', icon: '💎', color: '#c4b5fd', progress: 4, target: 30, unlocked: false, xpReward: 1000, category: 'streak' },
    { id: 'early-adopter', name: 'Early Adopter', description: 'Join ReLoop in its early days', icon: '🌟', color: '#4ce68a', progress: 1, target: 1, unlocked: true, unlockedAt: new Date(Date.now() - 5184000000), xpReward: 100, category: 'social' },
];

const SEED_REWARDS: Reward[] = [
    { id: 'reward-1', title: 'Campus Cafe Voucher', description: '10% off at the campus cafeteria', icon: '☕', cost: 100, category: 'voucher', available: true },
    { id: 'reward-2', title: 'ReLoop Tote Bag', description: 'Eco-friendly canvas tote bag', icon: '👜', cost: 250, category: 'merch', available: true },
    { id: 'reward-3', title: 'Plant a Tree', description: 'We plant a tree in your name', icon: '🌳', cost: 500, category: 'donation', available: true },
    { id: 'reward-4', title: 'Campus Bookstore Credit', description: '$5 credit at the bookstore', icon: '📚', cost: 200, category: 'voucher', available: true },
    { id: 'reward-5', title: 'ReLoop Sticker Pack', description: 'Set of 10 eco-themed stickers', icon: '🎨', cost: 75, category: 'merch', available: true },
    { id: 'reward-6', title: 'Ocean Cleanup Donation', description: 'Donate to ocean cleanup efforts', icon: '🌊', cost: 300, category: 'donation', available: true },
    { id: 'reward-7', title: 'Workshop Pass', description: 'Free pass to upcycling workshop', icon: '🛠️', cost: 400, category: 'experience', available: true },
    { id: 'reward-8', title: 'ReLoop Water Bottle', description: 'Stainless steel eco bottle', icon: '🍶', cost: 350, category: 'merch', available: false },
];

const SEED_TUTORIALS: Tutorial[] = [
    {
        id: 'upcycling-101', title: 'Upcycling 101', description: 'Learn the basics of creative reuse', icon: '📚', level: 'Beginner', color: 'bg-card-green', estimatedTime: '10 min', steps: [
            { title: 'What is Upcycling?', content: 'Upcycling is the process of transforming unwanted materials into new products of higher quality or environmental value. Unlike recycling, which breaks down materials, upcycling gives items a new purpose.', tip: 'Start with items you already have at home!' },
            { title: 'Tools You\'ll Need', content: 'Basic upcycling requires just a few tools: scissors, glue, paint, and your creativity. As you advance, you might want sandpaper, a sewing kit, or basic woodworking tools.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&fit=crop' },
            { title: 'Your First Project', content: 'Start simple: transform an old t-shirt into a reusable shopping bag. No sewing required! Just cut the sleeves and neckline, then tie the bottom shut.', tip: 'Use a sharp pair of scissors for clean cuts.' },
            { title: 'Share Your Creation', content: 'Show off your upcycled creation on ReLoop! Scan the finished item to earn bonus coins and inspire other students.' },
        ]
    },
    {
        id: 'zero-waste', title: 'Zero Waste Living', description: 'Tips for a sustainable lifestyle', icon: '🌍', level: 'Beginner', color: 'bg-card-yellow', estimatedTime: '15 min', steps: [
            { title: 'The 5 R\'s', content: 'Refuse what you don\'t need, Reduce what you do need, Reuse what you consume, Recycle what you can\'t reuse, and Rot (compost) the rest.' },
            { title: 'Campus Swaps', content: 'Use ReLoop\'s marketplace to swap items instead of buying new. Textbooks, clothes, and dorm supplies are perfect for trading.' },
            { title: 'Dorm Room Audit', content: 'Go through your room and identify items you no longer use. Scan them with ReLoop to discover their upcycling potential or list them for trade.' },
        ]
    },
    {
        id: 'diy-furniture', title: 'DIY Furniture Flips', description: 'Transform old furniture', icon: '🪑', level: 'Intermediate', color: 'bg-card-pink', estimatedTime: '20 min', steps: [
            { title: 'Assessing Your Piece', content: 'Look for solid construction — wobbly joints or water damage may be too far gone. Scratches, outdated finishes, and worn upholstery are all fixable.' },
            { title: 'Prep & Sand', content: 'Remove hardware, clean thoroughly, and sand with 120-grit sandpaper. This creates a surface that paint and stain can grip.' },
            { title: 'Paint & Finish', content: 'Apply chalk paint for a matte farmhouse look, or spray paint for a modern finish. Always use thin, even coats and allow proper drying time.' },
            { title: 'New Hardware', content: 'Swapping handles and knobs is the easiest way to modernize furniture. Look for interesting options at thrift stores.' },
        ]
    },
    {
        id: 'textile-recycling', title: 'Textile Recycling', description: 'Give new life to old clothes', icon: '👕', level: 'Intermediate', color: 'bg-card-blue', estimatedTime: '15 min', steps: [
            { title: 'Sort Your Closet', content: 'Separate clothes into categories: wearable, repairable, upcyclable, and recyclable. Each category has a different path.' },
            { title: 'Simple Repairs', content: 'Learn basic sewing: buttons, hems, and patches. These simple fixes can extend a garment\'s life by years.' },
            { title: 'Creative Transformations', content: 'Turn jeans into shorts, t-shirts into bags, or sweaters into pillow covers. The possibilities are endless!' },
        ]
    },
    {
        id: 'electronics-upcycle', title: 'Electronics Upcycle', description: 'Creative tech projects', icon: '📱', level: 'Advanced', color: 'bg-card-coral', estimatedTime: '25 min', steps: [
            { title: 'Safety First', content: 'Always discharge capacitors and remove batteries before working with electronics. Wear safety glasses and work in a well-ventilated area.' },
            { title: 'Salvageable Components', content: 'LEDs, speakers, motors, and circuit boards can all find new life. Even broken screens can become interesting art pieces.' },
            { title: 'Project Ideas', content: 'Build a Bluetooth speaker from old headphones, create LED art from broken screens, or repurpose a laptop into a digital photo frame.' },
        ]
    },
];

const SEED_WRAPPED: WrappedStats = {
    totalScans: 47,
    totalTrades: 23,
    totalCo2Saved: 45.2,
    totalCoinsEarned: 1250,
    topCategory: 'Clothing',
    rank: 4,
    totalUsers: 500,
    streakRecord: 12,
    badgesEarned: 3,
    impactEquivalent: '2 trees planted',
};

// ─── Seed localStorage on first run ──────────────────────────────
function _ensureSeeded(): void {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(KEYS.SEEDED)) return;

    _save(KEYS.USER, SEED_USER);
    _save(KEYS.LISTINGS, SEED_LISTINGS);
    _save(KEYS.TRADES, SEED_TRADES);
    _save(KEYS.MISSIONS, SEED_MISSIONS);
    _save(KEYS.MESSAGES, SEED_MESSAGES);
    _save(KEYS.CONVERSATIONS, SEED_CONVERSATIONS);
    _save(KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    _save(KEYS.REDEEMED, [] as string[]);

    localStorage.setItem(KEYS.SEEDED, 'true');
}

// ─── DemoManager ─────────────────────────────────────────────────
export const DemoManager = {

    // ── Init (call once on app mount) ────────────────────────────
    init(): void {
        _ensureSeeded();
    },

    // ── Demo Mode Toggle ─────────────────────────────────────────
    get isEnabled(): boolean {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem(KEYS.DEMO_MODE) === 'true';
    },

    setMode(enabled: boolean): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(KEYS.DEMO_MODE, enabled ? 'true' : 'false');
        window.dispatchEvent(new CustomEvent('demo-mode-changed', { detail: enabled }));
        setTimeout(() => window.location.reload(), 500);
    },

    toggle(): void {
        this.setMode(!this.isEnabled);
    },

    // ── User ─────────────────────────────────────────────────────
    getMockUser(): User {
        _ensureSeeded();
        return _load<User>(KEYS.USER, SEED_USER);
    },

    updateUser(partial: Partial<User>): User {
        const user = this.getMockUser();
        const updated = { ...user, ...partial };
        // Recalculate level from XP
        updated.level = Math.floor(updated.xp / 500) + 1;
        const titles = ['Seedling', 'Sprout', 'Sapling', 'Tree Hugger', 'Eco Champion', 'Green Guardian', 'Planet Hero', 'Eco Legend'];
        updated.levelTitle = titles[Math.min(updated.level - 1, titles.length - 1)];
        _save(KEYS.USER, updated);
        return updated;
    },

    // ── Listings ─────────────────────────────────────────────────
    getMockListings(): Listing[] {
        _ensureSeeded();
        return _load<Listing[]>(KEYS.LISTINGS, SEED_LISTINGS);
    },

    getListingById(id: string): Listing | undefined {
        return this.getMockListings().find(l => l.id === id);
    },

    addListing(listing: Listing): void {
        const listings = this.getMockListings();
        listings.unshift(listing);
        _save(KEYS.LISTINGS, listings);
    },

    updateListing(id: string, partial: Partial<Listing>): void {
        const listings = this.getMockListings();
        const idx = listings.findIndex(l => l.id === id);
        if (idx !== -1) {
            listings[idx] = { ...listings[idx], ...partial };
            _save(KEYS.LISTINGS, listings);
        }
    },

    // ── Trades ───────────────────────────────────────────────────
    getMockTrades(): Trade[] {
        _ensureSeeded();
        return _load<Trade[]>(KEYS.TRADES, SEED_TRADES);
    },

    addTrade(trade: Trade): void {
        const trades = this.getMockTrades();
        trades.unshift(trade);
        _save(KEYS.TRADES, trades);
    },

    completeTrade(tradeId: string): void {
        const trades = this.getMockTrades();
        const idx = trades.findIndex(t => t.id === tradeId);
        if (idx === -1) return;

        const trade = trades[idx];
        trades[idx] = { ...trade, status: 'completed', completedAt: new Date() };
        _save(KEYS.TRADES, trades);

        // Award coins + XP to user
        const user = this.getMockUser();
        const coinsEarned = trade.offeredCoins || 0;
        const xpEarned = 50;
        const co2 = trade.co2Saved || 2;
        this.updateUser({
            coins: user.coins + coinsEarned,
            xp: user.xp + xpEarned,
            co2Saved: user.co2Saved + co2,
            itemsTraded: user.itemsTraded + 1,
        });

        // Mark listing as sold
        if (trade.listingId) {
            this.updateListing(trade.listingId, { status: 'sold' });
        }
    },

    // ── Messages & Conversations ─────────────────────────────────
    getMockMessages(): Message[] {
        _ensureSeeded();
        return _load<Message[]>(KEYS.MESSAGES, SEED_MESSAGES);
    },

    getConversation(contactId: string): ChatMessage[] {
        _ensureSeeded();
        const all = _load<Record<string, ChatMessage[]>>(KEYS.CONVERSATIONS, SEED_CONVERSATIONS);
        return all[contactId] || [];
    },

    addMessage(contactId: string, message: ChatMessage): void {
        const all = _load<Record<string, ChatMessage[]>>(KEYS.CONVERSATIONS, SEED_CONVERSATIONS);
        if (!all[contactId]) all[contactId] = [];
        all[contactId].push(message);
        _save(KEYS.CONVERSATIONS, all);

        // Update the message-list preview
        const messages = this.getMockMessages();
        const idx = messages.findIndex(m => m.senderId === contactId);
        if (idx !== -1) {
            messages[idx] = { ...messages[idx], lastMessage: message.text, timestamp: new Date(), unread: !message.isOwn };
            _save(KEYS.MESSAGES, messages);
        }
    },

    markConversationRead(contactId: string): void {
        const messages = this.getMockMessages();
        const idx = messages.findIndex(m => m.senderId === contactId);
        if (idx !== -1) {
            messages[idx] = { ...messages[idx], unread: false };
            _save(KEYS.MESSAGES, messages);
        }
    },

    // ── Missions ─────────────────────────────────────────────────
    getMockMissions(): Mission[] {
        _ensureSeeded();
        return _load<Mission[]>(KEYS.MISSIONS, SEED_MISSIONS);
    },

    progressMission(missionId: string): void {
        const missions = this.getMockMissions();
        const idx = missions.findIndex(m => m.id === missionId);
        if (idx === -1) return;

        const mission = missions[idx];
        if (mission.claimed) return;

        const newProgress = Math.min(mission.progress + 1, mission.target);
        missions[idx] = {
            ...mission,
            progress: newProgress,
            completed: newProgress >= mission.target,
        };
        _save(KEYS.MISSIONS, missions);
    },

    claimMission(missionId: string): { coins: number; xp: number } | null {
        const missions = this.getMockMissions();
        const idx = missions.findIndex(m => m.id === missionId);
        if (idx === -1) return null;

        const mission = missions[idx];
        if (!mission.completed || mission.claimed) return null;

        missions[idx] = { ...mission, claimed: true };
        _save(KEYS.MISSIONS, missions);

        // Award coins + XP
        const user = this.getMockUser();
        this.updateUser({
            coins: user.coins + mission.coinsReward,
            xp: user.xp + mission.xpReward,
        });

        return { coins: mission.coinsReward, xp: mission.xpReward };
    },

    // ── Notifications ────────────────────────────────────────────
    getMockNotifications(): Notification[] {
        _ensureSeeded();
        return _load<Notification[]>(KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    },

    addNotification(notif: Notification): void {
        const notifs = this.getMockNotifications();
        notifs.unshift(notif);
        _save(KEYS.NOTIFICATIONS, notifs);
    },

    markNotificationsRead(): void {
        const notifs = this.getMockNotifications();
        const updated = notifs.map(n => ({ ...n, read: true }));
        _save(KEYS.NOTIFICATIONS, updated);
    },

    // ── Rewards ──────────────────────────────────────────────────
    getMockRewards(): Reward[] {
        return [...SEED_REWARDS];
    },

    getRedeemedRewards(): string[] {
        _ensureSeeded();
        return _load<string[]>(KEYS.REDEEMED, []);
    },

    redeemReward(rewardId: string, cost: number): boolean {
        const user = this.getMockUser();
        if (user.coins < cost) return false;

        const redeemed = this.getRedeemedRewards();
        if (redeemed.includes(rewardId)) return false;

        redeemed.push(rewardId);
        _save(KEYS.REDEEMED, redeemed);

        this.updateUser({ coins: user.coins - cost });
        return true;
    },

    // ── Static Data (read-only, no persistence needed) ───────────
    getMockLeaderboard(): LeaderboardEntry[] {
        return [...SEED_LEADERBOARD];
    },

    getMockStories(): Story[] {
        return [...SEED_STORIES];
    },

    getStoryById(id: string): Story | undefined {
        return SEED_STORIES.find(s => s.id === id);
    },

    getMockAchievements(): Achievement[] {
        return [...SEED_ACHIEVEMENTS];
    },

    getMockTutorials(): Tutorial[] {
        return [...SEED_TUTORIALS];
    },

    getTutorialById(id: string): Tutorial | undefined {
        return SEED_TUTORIALS.find(t => t.id === id);
    },

    getMockWrapped(): WrappedStats {
        return { ...SEED_WRAPPED };
    },

    // ── Scanner ──────────────────────────────────────────────────
    getMockScanResult(): ScanResult {
        const randomItem = MOCK_SCAN_ITEMS[Math.floor(Math.random() * MOCK_SCAN_ITEMS.length)];
        return {
            success: true,
            item: { ...randomItem, recyclable: true, recycleInfo: 'Recyclable in most areas' }
        };
    },

    async simulateDelay(ms: number = 800): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // ── Gamification Helpers ─────────────────────────────────────
    getStreak(): number {
        if (typeof window === 'undefined') return 1;
        const saved = localStorage.getItem(KEYS.STREAK);
        return saved ? parseInt(saved, 10) : 1;
    },

    updateStreak(days: number): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(KEYS.STREAK, days.toString());
    },

    addXP(currentXP: number, amount: number): { newXP: number; leveledUp: boolean; newLevel?: number } {
        const newXP = currentXP + amount;
        const currentLevel = Math.floor(currentXP / 500) + 1;
        const newLevel = Math.floor(newXP / 500) + 1;
        return {
            newXP,
            leveledUp: newLevel > currentLevel,
            newLevel: newLevel > currentLevel ? newLevel : undefined
        };
    },

    // ── Reset ────────────────────────────────────────────────────
    resetAll(): void {
        if (typeof window === 'undefined') return;
        Object.values(KEYS).forEach(key => localStorage.removeItem(key));
        _ensureSeeded();
    },

    // ── Scan History ─────────────────────────────────────────────
    saveScan(result: ScanResult): void {
        if (typeof window === 'undefined') return;
        const history = this.getScanHistory();
        history.unshift(result);
        _save('reloop_scan_history', history);
    },

    getScanHistory(): ScanResult[] {
        if (typeof window === 'undefined') return [];
        return _load<ScanResult[]>('reloop_scan_history', []);
    },
};

export default DemoManager;
