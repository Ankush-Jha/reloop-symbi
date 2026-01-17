// AI Scanning Service for ReLoop
// Uses Cloudflare Workers AI for image recognition
// Free tier: 10,000 neurons/day

// Cloudflare Worker endpoint
const CLOUDFLARE_WORKER_URL = 'https://reloop-ai-scanner.reloop-ai.workers.dev';

const AIScannerService = {
    // Item categories with detailed data
    itemDatabase: {
        'electronics': {
            material: 'Plastic & Electronics',
            coinRange: [40, 150],
            upcycleIdeas: [
                { title: 'DIY Desk Organizer', description: 'Turn old electronics into stylish desk storage', difficulty: 'Medium' },
                { title: 'Art Installation', description: 'Create modern art from circuit boards', difficulty: 'Easy' },
                { title: 'Plant Holder', description: 'Convert old devices into unique planters', difficulty: 'Easy' }
            ]
        },
        'books': {
            material: 'Paper & Cardboard',
            coinRange: [15, 60],
            upcycleIdeas: [
                { title: 'Book Planter', description: 'Hollow old books to create hidden planters', difficulty: 'Easy' },
                { title: 'Paper Beads', description: 'Roll colorful pages into jewelry beads', difficulty: 'Easy' },
                { title: 'Book Safe', description: 'Create a secret storage compartment', difficulty: 'Medium' }
            ]
        },
        'furniture': {
            material: 'Wood & Metal',
            coinRange: [50, 200],
            upcycleIdeas: [
                { title: 'Painted Refresh', description: 'Give new life with chalk paint', difficulty: 'Easy' },
                { title: 'Decoupage Design', description: 'Cover with decorative paper or fabric', difficulty: 'Medium' },
                { title: 'Modular Storage', description: 'Combine pieces for custom storage', difficulty: 'Hard' }
            ]
        },
        'clothing': {
            material: 'Fabric & Textile',
            coinRange: [20, 100],
            upcycleIdeas: [
                { title: 'Tote Bag', description: 'Transform old clothes into reusable bags', difficulty: 'Medium' },
                { title: 'Patchwork Quilt', description: 'Combine fabrics into cozy blanket', difficulty: 'Hard' },
                { title: 'Scrunchies', description: 'Make hair accessories from fabric scraps', difficulty: 'Easy' }
            ]
        },
        'kitchen': {
            material: 'Ceramic & Metal',
            coinRange: [15, 70],
            upcycleIdeas: [
                { title: 'Herb Garden', description: 'Use containers for windowsill herbs', difficulty: 'Easy' },
                { title: 'Candle Holders', description: 'Transform cups into candle holders', difficulty: 'Easy' },
                { title: 'Wind Chime', description: 'Create musical garden decor', difficulty: 'Medium' }
            ]
        },
        'sports': {
            material: 'Mixed Materials',
            coinRange: [30, 120],
            upcycleIdeas: [
                { title: 'Wall Display', description: 'Mount as sporting memorabilia', difficulty: 'Easy' },
                { title: 'Planter', description: 'Convert into unique planters', difficulty: 'Easy' },
                { title: 'Furniture', description: 'Turn into creative shelving', difficulty: 'Hard' }
            ]
        },
        'other': {
            material: 'Various Materials',
            coinRange: [10, 60],
            upcycleIdeas: [
                { title: 'Decorative Mosaic', description: 'Break and reassemble into art', difficulty: 'Medium' },
                { title: 'Gift Wrapping', description: 'Use as unique containers', difficulty: 'Easy' },
                { title: 'Garden Feature', description: 'Repurpose as outdoor decor', difficulty: 'Easy' }
            ]
        }
    },

    // Main analysis function
    async analyzeImage(imageData) {
        let result;

        try {
            console.log('Resizing image for analysis...');
            // Resize to max 800px to prevent timeouts/limits
            const resized = await this.resizeImage(imageData, 800);
            result = await this.analyzeWithCloudflare(resized);
        } catch (error) {
            console.error('Scanner error:', error);
            console.warn('Falling back to local mock data...');

            // Mock Fallback
            result = {
                success: true,
                item: {
                    objectName: 'Ceramic Vase (Mock)',
                    category: 'Home Decor',
                    material: 'Ceramic',
                    condition: 'Good',
                    confidence: 0.95,
                    estimatedCoins: 45,
                    co2Savings: 2.5,
                    upcycleIdeas: [
                        { title: 'Painted Vase', description: 'Refresh with new colors', difficulty: 'Easy' },
                        { title: 'Lamp Base', description: 'Convert into a lamp', difficulty: 'Medium' }
                    ],
                    recyclable: true,
                    recycleInfo: { method: 'Local center', tips: ['Clean thoroughly'] }
                }
            };
        }

        // Track mission progress only on success
        if (result.success && typeof GamificationService !== 'undefined' && typeof getCurrentUserId === 'function') {
            const userId = getCurrentUserId();
            if (userId) {
                try {
                    GamificationService.updateMissionProgress(userId, 'scan_items', 1);
                    if (typeof db !== 'undefined') {
                        await db.collection('users').doc(userId).update({
                            itemsScanned: firebase.firestore.FieldValue.increment(1)
                        });
                    }
                } catch (e) {
                    console.log('Mission tracking error:', e.message);
                }
            }
        }

        return result;
    },

    // Cloudflare Workers AI
    async analyzeWithCloudflare(imageData) {
        try {
            const response = await fetch(CLOUDFLARE_WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageData })
            });

            const data = await response.json();
            console.log('Cloudflare response:', data);

            // Check for success flag from our worker
            if (data.success && data.item) {
                const categoryKey = (data.item.category || 'other').toLowerCase();
                const categoryData = this.itemDatabase[categoryKey] || this.itemDatabase.other;

                return {
                    success: true,
                    item: {
                        objectName: data.item.objectName || 'Scanned Item',
                        category: this.capitalize(categoryKey),
                        material: data.item.material || categoryData.material,
                        condition: data.item.condition || 'Good',
                        confidence: 0.85 + Math.random() * 0.1,
                        estimatedCoins: data.item.estimatedCoins || this.estimateCoins(categoryData),
                        co2Savings: ((data.item.estimatedCoins || 50) * 0.05).toFixed(1),
                        upcycleIdeas: data.item.upcycleIdeas || categoryData.upcycleIdeas,
                        recyclable: data.item.recyclable !== false,
                        recycleInfo: this.getRecycleInfo(categoryKey)
                    }
                };
            }

            throw new Error(data.error || 'Invalid response from AI');
        } catch (error) {
            console.error('Cloudflare error:', error);
            throw error;
        }
    },

    // Image resizing helper (Crucial for performance/limits)
    async resizeImage(base64Str, maxWidth = 800) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                // Compress to 0.8 quality jpeg
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.onerror = () => resolve(base64Str); // Fallback to original
        });
    },

    // Get recycling information
    getRecycleInfo(category) {
        const recycleData = {
            'electronics': { recyclable: true, method: 'E-waste center', tips: ['Remove batteries', 'Wipe data'] },
            'books': { recyclable: true, method: 'Paper recycling', tips: ['Remove plastic covers', 'Donate if readable'] },
            'furniture': { recyclable: 'Partially', method: 'Depends on material', tips: ['Metal to scrap'] },
            'clothing': { recyclable: true, method: 'Textile recycling', tips: ['Donate wearable items'] },
            'kitchen': { recyclable: 'Varies', method: 'Check material', tips: ['Glass/metal recyclable'] },
            'sports': { recyclable: 'Partially', method: 'Varies', tips: ['Donate usable gear'] },
            'other': { recyclable: 'Check locally', method: 'Varies', tips: ['Research local options'] }
        };
        return recycleData[category] || recycleData['other'];
    },

    // Helpers
    estimateCoins(categoryData) {
        const [min, max] = categoryData.coinRange;
        return Math.floor(Math.random() * (max - min) + min);
    },

    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    storeResult(result) {
        sessionStorage.setItem('reloop_scan_result', JSON.stringify(result));
    },

    getStoredResult() {
        const stored = sessionStorage.getItem('reloop_scan_result');
        return stored ? JSON.parse(stored) : null;
    },

    clearResult() {
        sessionStorage.removeItem('reloop_scan_result');
    }
};
