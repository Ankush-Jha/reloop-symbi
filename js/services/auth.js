// Auth Service for ReLoop
// Handles user authentication with Firebase

const AuthService = {
    // Sign up with email and password
    async signUp(email, password, name, campus = 'Default Campus') {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Create user profile in Firestore
            await db.collection('users').doc(user.uid).set({
                name: name,
                email: email,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
                campus: campus,
                coins: 100, // Starting coins
                level: 1,
                xp: 0,
                itemsTraded: 0,
                co2Saved: 0,
                joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
                badges: ['newcomer']
            });

            return { success: true, user: user };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign in with email and password
    async signIn(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign out
    async signOut() {
        try {
            await auth.signOut();
            localStorage.removeItem('reloop_userId');
            localStorage.removeItem('reloop_coins');
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get current user profile from Firestore
    async getCurrentUserProfile() {
        const userId = getCurrentUserId();
        if (!userId) return null;

        try {
            const doc = await db.collection('users').doc(userId).get();
            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error getting user profile:', error);
            return null;
        }
    },

    // Update user profile
    async updateProfile(data) {
        const userId = getCurrentUserId();
        if (!userId) return { success: false, error: 'Not authenticated' };

        try {
            await db.collection('users').doc(userId).update(data);
            return { success: true };
        } catch (error) {
            console.error('Error updating profile:', error);
            return { success: false, error: error.message };
        }
    },

    // Check if user is logged in
    isLoggedIn() {
        return auth.currentUser !== null;
    },

    // Get auth state
    onAuthStateChanged(callback) {
        return auth.onAuthStateChanged(callback);
    }
};
