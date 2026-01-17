const MockDataManager = {
    // Seed all test data
    async seedAll() {
        if (!confirm('This will add test users and listings to your database. Continue?')) return;

        try {
            showToast('Seeding data...', 'info');

            await this.seedUsers();
            await this.seedListings();

            showToast('Data seeded successfully!', 'success');
            // Refresh page to show new data
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            console.error('Error seeding data:', error);
            showToast('Error seeding data: ' + error.message, 'error');
        }
    },

    // Create bot users for leaderboard and marketplace
    async seedUsers() {
        const bots = [
            {
                id: 'bot_eco_beast',
                name: 'Eco_Beast',
                campus: 'Computer Science',
                coins: 4200,
                xp: 4200,
                level: 15,
                itemsTraded: 45,
                co2Saved: 120.5,
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKpUQ4iADzLq-ccOV1CPZoSFuDlTjC6me7On072Iu604MKDrc41FIze13cZoInG53M0oSRrSE1CAoSrq8HyQV1JbWWpqr7JsurQ6x7U7tvwByuZZXv2xNWV1lTXlhGEbcHXMuCD_g6j7mz42NtjjON0kXjQa-1bmaF4QLxvBoeKgC4oJJpn_o0LKGzDV84b3x_kORdU19P-KzHxHih9YN3myehOa4v0W6YOx0Un6th8GN223vCsjikY9glwStv5holxulY-zTl2uE'
            },
            {
                id: 'bot_green_machine',
                name: 'GreenMachine',
                campus: 'Biology Dept',
                coins: 3900,
                xp: 3900,
                level: 14,
                itemsTraded: 38,
                co2Saved: 98.2,
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaty_8pOqc7WeTqO76RukZ3Q9Cu4hm3fT0oobm0S3iSXOLkk7vU7OdBTR7rqtWTDxq7n3HWGvhJkArrC3wQ5E8WSSZAZG47KC9tVeSMqpf9-2ecnQN2fhwlMEDTgymlE_I2zeC46rTtdDlWTvOv_jH-wO5999W4Ymj7gGvLDIoG6_cwMxxntShFa630lbKpRUbn4tWrfvOi9Nt8L1XnHh157VZGMMcL4r7lSiHoCVetm6FO1GtAoVNRTDC-XDYPLFvjn6-DOSdz-4'
            },
            {
                id: 'bot_sustain_sara',
                name: 'SustainSara',
                campus: 'Arts Dept',
                coins: 3600,
                xp: 3600,
                level: 13,
                itemsTraded: 32,
                co2Saved: 85.4,
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApkHqu9en_dVgoUQ5TxuxRwSW6yU7PlEVw7qMyX8NYJDg5JUimrQSXFdhHGR7Ud2rtjzu9TqorwH8tqn4yq11F-adrhv8T3hnPTMvRdQ-v3SZWx1-8DrFuTzQST64A5ZZq8xq-yoUiNvp-gHkAnPzdsCJR_pOBj-7tSGs4IiPI9oXnbKHMS34Bt4v54Q6TNgD0u3_T1dsJPK3GntZKruZiOGgQeu27ZTXDWSkfiLbcEZphBARRLRjk3i0msDHXE1vMz2nlqIHfcWI'
            }
        ];

        const batch = db.batch();

        bots.forEach(bot => {
            const ref = db.collection('users').doc(bot.id);
            batch.set(ref, {
                ...bot,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        });

        await batch.commit();
        console.log('Seeded bots');
    },

    // Create random listings
    async seedListings() {
        const titles = [
            'Vintage Desk Lamp', 'Calculus Textbook', 'Graphing Calculator',
            'Lab Coat', 'Extension Cord', 'Portable Heater',
            'Bike Helmet', 'Yoga Mat', 'Plant Pot'
        ];

        const images = [
            '../../images/desk-lamp.png',
            '../../images/study-books.png',
            '../../images/electric-kettle.png'
        ];

        const botIds = ['bot_eco_beast', 'bot_green_machine', 'bot_sustain_sara'];

        const batch = db.batch();

        for (let i = 0; i < titles.length; i++) {
            const ref = db.collection('listings').doc(); // Auto-ID
            const sellerId = botIds[i % botIds.length];

            batch.set(ref, {
                title: titles[i],
                description: `A gently used ${titles[i]}. Great condition!`,
                price: Math.floor(Math.random() * 50) + 10,
                condition: ['New', 'Good', 'Fair'][Math.floor(Math.random() * 3)],
                category: ['Electronics', 'Books', 'Furniture', 'Sports'][Math.floor(Math.random() * 4)],
                sellerId: sellerId,
                status: 'available',
                images: [images[i % images.length]], // Cycle through logic or placeholder
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        await batch.commit();
        console.log('Seeded listings');
    },

    // Clear all data (Dangerous)
    async clearAll() {
        if (!confirm('WARNING: This will DELETE ALL DATA (users, listings, trades). Are you sure?')) return;

        // This would require recursive delete or admin SDK which we don't have here.
        // We can just delete the known collections for now manually or skip implementation
        // due to client-side limitations on large deletes.
        // For MVP, just clearing localStorage might be enough for "resetting user view".
        // But removing Firestore data is harder client-side efficiently. 
        showToast('Clearing database not fully supported in client-only mode.', 'warning');
    }
};

// Make global
window.MockDataManager = MockDataManager;
