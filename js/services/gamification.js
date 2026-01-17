// Gamification Service for ReLoop
// Handles XP, Levels, Missions, Badges, and Leaderboard

// Level thresholds - XP required for each level
const LEVEL_THRESHOLDS = [
    0,      // Level 1
    100,    // Level 2
    250,    // Level 3
    500,    // Level 4
    850,    // Level 5
    1300,   // Level 6
    1850,   // Level 7
    2500,   // Level 8
    3300,   // Level 9
    4200,   // Level 10
    5200,   // Level 11
    6400,   // Level 12
    7800,   // Level 13
    9400,   // Level 14
    11200,  // Level 15
    13200,  // Level 16
    15500,  // Level 17
    18000,  // Level 18
    20800,  // Level 19
    24000   // Level 20
];

// Level titles
const LEVEL_TITLES = {
    1: 'Rookie Recycler',
    2: 'Green Beginner',
    3: 'Eco Learner',
    4: 'Sustainability Starter',
    5: 'Planet Protector',
    6: 'Earth Guardian',
    7: 'Eco Warrior',
    8: 'Green Champion',
    9: 'Sustainability Hero',
    10: 'Eco Legend',
    15: 'Planet Savior',
    20: 'Eco Master'
};

// Badge definitions
const BADGES = {
    first_trade: {
        id: 'first_trade',
        name: 'First Trade',
        icon: '🎉',
        description: 'Complete your first trade',
        check: (stats) => stats.itemsTraded >= 1,
        xpReward: 50
    },
    eco_warrior: {
        id: 'eco_warrior',
        name: 'Eco Warrior',
        icon: '🌱',
        description: 'Save 10kg of CO2',
        check: (stats) => stats.co2Saved >= 10,
        xpReward: 100
    },
    power_seller: {
        id: 'power_seller',
        name: 'Power Seller',
        icon: '💰',
        description: 'Sell 10 items',
        check: (stats) => stats.itemsSold >= 10,
        xpReward: 150
    },
    social_butterfly: {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        icon: '🦋',
        description: 'Send 50 messages',
        check: (stats) => stats.messagesSent >= 50,
        xpReward: 75
    },
    scanner_pro: {
        id: 'scanner_pro',
        name: 'Scanner Pro',
        icon: '📸',
        description: 'Scan 25 items',
        check: (stats) => stats.itemsScanned >= 25,
        xpReward: 100
    },
    level_5: {
        id: 'level_5',
        name: 'Rising Star',
        icon: '⭐',
        description: 'Reach Level 5',
        check: (stats) => stats.level >= 5,
        xpReward: 0 // No XP for level badges to avoid loops
    },
    level_10: {
        id: 'level_10',
        name: 'Eco Champion',
        icon: '🏆',
        description: 'Reach Level 10',
        check: (stats) => stats.level >= 10,
        xpReward: 0
    },
    five_trades: {
        id: 'five_trades',
        name: 'Trade Master',
        icon: '🤝',
        description: 'Complete 5 trades',
        check: (stats) => stats.itemsTraded >= 5,
        xpReward: 100
    }
};

// Daily mission definitions
const DAILY_MISSIONS = {
    daily_login: {
        id: 'daily_login',
        title: 'Daily Check-in',
        icon: 'login',
        description: 'Log in today',
        target: 1,
        xpReward: 20,
        coinReward: 10,
        difficulty: 'Easy'
    },
    scan_items: {
        id: 'scan_items',
        title: 'Snap 3 items today',
        icon: 'photo_camera',
        description: 'Scan items to identify them',
        target: 3,
        xpReward: 50,
        coinReward: 25,
        difficulty: 'Easy'
    },
    send_message: {
        id: 'send_message',
        title: 'Message a trader',
        icon: 'chat',
        description: 'Chat with another user',
        target: 1,
        xpReward: 30,
        coinReward: 15,
        difficulty: 'Easy'
    },
    list_item: {
        id: 'list_item',
        title: 'List a recyclable item',
        icon: 'recycling',
        description: 'Create a new listing',
        target: 1,
        xpReward: 75,
        coinReward: 35,
        difficulty: 'Medium'
    },
    complete_trade: {
        id: 'complete_trade',
        title: 'Complete a trade',
        icon: 'sync_alt',
        description: 'Finish a trade with another user',
        target: 1,
        xpReward: 150,
        coinReward: 75,
        difficulty: 'Medium'
    },
    share_story: {
        id: 'share_story',
        title: 'Share your impact story',
        icon: 'campaign',
        description: 'Share your eco story',
        target: 1,
        xpReward: 100,
        coinReward: 50,
        difficulty: 'Hard'
    }
};

const GamificationService = {
    // ============ LEVEL SYSTEM ============

    // Calculate level from XP
    calculateLevel(xp) {
        let level = 1;
        for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
            if (xp >= LEVEL_THRESHOLDS[i]) {
                level = i + 1;
                break;
            }
        }
        return Math.min(level, 20);
    },

    // Get XP progress within current level
    getLevelProgress(xp) {
        const level = this.calculateLevel(xp);
        const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
        const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
        
        const progress = xp - currentThreshold;
        const required = nextThreshold - currentThreshold;
        
        return {
            level,
            currentXP: xp,
            levelXP: progress,
            requiredXP: required,
            percentage: Math.min(100, Math.round((progress / required) * 100)),
            nextLevelXP: nextThreshold
        };
    },

    // Get title for level
    getLevelTitle(level) {
        // Find the highest title that applies
        let title = LEVEL_TITLES[1];
        for (const [lvl, t] of Object.entries(LEVEL_TITLES)) {
            if (level >= parseInt(lvl)) {
                title = t;
            }
        }
        return title;
    },

    // Check if user leveled up and handle it
    async checkLevelUp(userId, oldXP, newXP) {
        const oldLevel = this.calculateLevel(oldXP);
        const newLevel = this.calculateLevel(newXP);
        
        if (newLevel > oldLevel) {
            // Store level up info in sessionStorage for level-up.html
            sessionStorage.setItem('levelUp', JSON.stringify({
                oldLevel,
                newLevel,
                newXP,
                title: this.getLevelTitle(newLevel)
            }));
            
            return {
                leveledUp: true,
                oldLevel,
                newLevel,
                title: this.getLevelTitle(newLevel)
            };
        }
        
        return { leveledUp: false };
    },

    // ============ LEADERBOARD ============

    // Get leaderboard (top users by XP or CO2)
    async getLeaderboard(sortBy = 'xp', limit = 50) {
        try {
            const query = db.collection('users')
                .orderBy(sortBy, 'desc')
                .limit(limit);

            const snapshot = await query.get();
            return snapshot.docs.map((doc, index) => ({
                rank: index + 1,
                id: doc.id,
                ...doc.data(),
                level: this.calculateLevel(doc.data().xp || 0)
            }));
        } catch (error) {
            console.error('Error getting leaderboard:', error);
            return [];
        }
    },

    // Get user's rank in leaderboard
    async getUserRank(userId, sortBy = 'xp') {
        try {
            const userDoc = await db.collection('users').doc(userId).get();
            if (!userDoc.exists) return null;

            const userData = userDoc.data();
            const userValue = userData[sortBy] || 0;

            // Count users with higher value
            const higherCount = await db.collection('users')
                .where(sortBy, '>', userValue)
                .get();

            return {
                rank: higherCount.size + 1,
                value: userValue,
                level: this.calculateLevel(userData.xp || 0)
            };
        } catch (error) {
            console.error('Error getting user rank:', error);
            return null;
        }
    },

    // ============ DAILY MISSIONS ============

    // Get today's date string
    getTodayDate() {
        return new Date().toISOString().split('T')[0];
    },

    // Get user's daily missions with progress
    async getDailyMissions(userId) {
        if (!userId) return [];

        try {
            const today = this.getTodayDate();
            const missionDoc = await db.collection('users').doc(userId)
                .collection('dailyMissions').doc(today).get();

            let progress = {};
            if (missionDoc.exists) {
                progress = missionDoc.data();
            }

            // Return missions with progress
            return Object.values(DAILY_MISSIONS).map(mission => ({
                ...mission,
                progress: progress[mission.id]?.progress || 0,
                claimed: progress[mission.id]?.claimed || false,
                completed: (progress[mission.id]?.progress || 0) >= mission.target
            }));
        } catch (error) {
            console.error('Error getting daily missions:', error);
            return Object.values(DAILY_MISSIONS).map(m => ({
                ...m,
                progress: 0,
                claimed: false,
                completed: false
            }));
        }
    },

    // Update mission progress
    async updateMissionProgress(userId, missionId, increment = 1) {
        if (!userId) return { success: false };

        try {
            const today = this.getTodayDate();
            const missionRef = db.collection('users').doc(userId)
                .collection('dailyMissions').doc(today);

            const missionDoc = await missionRef.get();
            let currentProgress = 0;

            if (missionDoc.exists && missionDoc.data()[missionId]) {
                currentProgress = missionDoc.data()[missionId].progress || 0;
            }

            const newProgress = currentProgress + increment;
            const mission = DAILY_MISSIONS[missionId];
            const completed = mission && newProgress >= mission.target;

            await missionRef.set({
                [missionId]: {
                    progress: newProgress,
                    claimed: missionDoc.exists ? (missionDoc.data()[missionId]?.claimed || false) : false,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }
            }, { merge: true });

            return { success: true, progress: newProgress, completed };
        } catch (error) {
            console.error('Error updating mission progress:', error);
            return { success: false, error: error.message };
        }
    },

    // Claim mission reward
    async claimMissionReward(userId, missionId) {
        if (!userId) return { success: false, error: 'Not authenticated' };

        const mission = DAILY_MISSIONS[missionId];
        if (!mission) return { success: false, error: 'Mission not found' };

        try {
            const today = this.getTodayDate();
            const missionRef = db.collection('users').doc(userId)
                .collection('dailyMissions').doc(today);
            const userRef = db.collection('users').doc(userId);

            // Use transaction for atomic update
            const result = await db.runTransaction(async (transaction) => {
                const missionDoc = await transaction.get(missionRef);
                const userDoc = await transaction.get(userRef);

                if (!userDoc.exists) {
                    throw new Error('User not found');
                }

                const missionData = missionDoc.exists ? missionDoc.data()[missionId] : null;
                
                if (!missionData || missionData.progress < mission.target) {
                    throw new Error('Mission not completed');
                }

                if (missionData.claimed) {
                    throw new Error('Reward already claimed');
                }

                const userData = userDoc.data();
                const oldXP = userData.xp || 0;
                const newXP = oldXP + mission.xpReward;

                // Update user XP and coins
                transaction.update(userRef, {
                    xp: firebase.firestore.FieldValue.increment(mission.xpReward),
                    coins: firebase.firestore.FieldValue.increment(mission.coinReward)
                });

                // Mark mission as claimed
                transaction.set(missionRef, {
                    [missionId]: {
                        ...missionData,
                        claimed: true,
                        claimedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }
                }, { merge: true });

                return { oldXP, newXP };
            });

            // Check for level up
            const levelUpResult = await this.checkLevelUp(userId, result.oldXP, result.newXP);

            return {
                success: true,
                xpAwarded: mission.xpReward,
                coinsAwarded: mission.coinReward,
                levelUp: levelUpResult
            };
        } catch (error) {
            console.error('Error claiming mission reward:', error);
            return { success: false, error: error.message };
        }
    },

    // Track daily login
    async trackDailyLogin(userId) {
        return this.updateMissionProgress(userId, 'daily_login', 1);
    },

    // ============ BADGES ============

    // Get all badges with unlock status
    async getBadges(userId) {
        if (!userId) return Object.values(BADGES).map(b => ({ ...b, unlocked: false }));

        try {
            const badgesSnapshot = await db.collection('users').doc(userId)
                .collection('badges').get();

            const unlockedBadges = {};
            badgesSnapshot.docs.forEach(doc => {
                unlockedBadges[doc.id] = doc.data();
            });

            return Object.values(BADGES).map(badge => ({
                ...badge,
                unlocked: !!unlockedBadges[badge.id],
                unlockedAt: unlockedBadges[badge.id]?.unlockedAt || null
            }));
        } catch (error) {
            console.error('Error getting badges:', error);
            return Object.values(BADGES).map(b => ({ ...b, unlocked: false }));
        }
    },

    // Check and award badges based on user stats
    async checkAndAwardBadges(userId) {
        if (!userId) return [];

        try {
            const userDoc = await db.collection('users').doc(userId).get();
            if (!userDoc.exists) return [];

            const userData = userDoc.data();
            const stats = {
                itemsTraded: userData.itemsTraded || 0,
                itemsSold: userData.itemsSold || 0,
                co2Saved: userData.co2Saved || 0,
                messagesSent: userData.messagesSent || 0,
                itemsScanned: userData.itemsScanned || 0,
                level: this.calculateLevel(userData.xp || 0)
            };

            // Get already unlocked badges
            const badgesSnapshot = await db.collection('users').doc(userId)
                .collection('badges').get();
            const unlockedBadges = new Set(badgesSnapshot.docs.map(d => d.id));

            const newBadges = [];

            // Check each badge
            for (const badge of Object.values(BADGES)) {
                if (!unlockedBadges.has(badge.id) && badge.check(stats)) {
                    // Award badge
                    await db.collection('users').doc(userId)
                        .collection('badges').doc(badge.id).set({
                            unlockedAt: firebase.firestore.FieldValue.serverTimestamp()
                        });

                    // Award XP if badge has reward
                    if (badge.xpReward > 0) {
                        await db.collection('users').doc(userId).update({
                            xp: firebase.firestore.FieldValue.increment(badge.xpReward)
                        });
                    }

                    newBadges.push(badge);
                }
            }

            return newBadges;
        } catch (error) {
            console.error('Error checking badges:', error);
            return [];
        }
    },

    // ============ ECO-WRAPPED STATS ============

    // Get user's wrapped stats
    async getWrappedStats(userId) {
        if (!userId) return null;

        try {
            const userDoc = await db.collection('users').doc(userId).get();
            if (!userDoc.exists) return null;

            const userData = userDoc.data();
            const level = this.calculateLevel(userData.xp || 0);
            const badges = await this.getBadges(userId);
            const unlockedBadges = badges.filter(b => b.unlocked);

            // Calculate environmental impact equivalents
            const co2Saved = userData.co2Saved || 0;
            const treesSaved = Math.floor(co2Saved / 21); // ~21kg CO2 per tree per year
            const fishSaved = Math.floor(co2Saved / 7); // Rough estimate

            return {
                name: userData.name || 'Eco Hero',
                level,
                title: this.getLevelTitle(level),
                xp: userData.xp || 0,
                coins: userData.coins || 0,
                co2Saved,
                treesSaved,
                fishSaved,
                itemsTraded: userData.itemsTraded || 0,
                itemsScanned: userData.itemsScanned || 0,
                badgesEarned: unlockedBadges.length,
                topBadge: unlockedBadges[unlockedBadges.length - 1] || null,
                rank: await this.getUserRank(userId, 'xp')
            };
        } catch (error) {
            console.error('Error getting wrapped stats:', error);
            return null;
        }
    }
};

// Export for global access
window.GamificationService = GamificationService;
window.BADGES = BADGES;
window.DAILY_MISSIONS = DAILY_MISSIONS;
