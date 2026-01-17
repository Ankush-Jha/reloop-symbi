// Storage Service for ReLoop
// Uses Cloudinary (FREE) instead of Firebase Storage
// No credit card required!

// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = 'dqzejw6vd';
const CLOUDINARY_UPLOAD_PRESET = 'reloop_uploads'; // You need to create this in Cloudinary settings

const StorageService = {
    // Upload a single image to Cloudinary
    async uploadImage(file, folder = 'listings') {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            formData.append('folder', `reloop/${folder}`);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            return { success: true, url: data.secure_url };
        } catch (error) {
            console.error('Error uploading image:', error);
            return { success: false, error: error.message };
        }
    },

    // Upload multiple images
    async uploadImages(files, folder = 'listings') {
        const urls = [];

        for (const file of files) {
            const result = await this.uploadImage(file, folder);
            if (result.success) {
                urls.push(result.url);
            }
        }

        return urls;
    },

    // Upload base64 image (for camera capture)
    async uploadBase64Image(base64Data, folder = 'listings') {
        try {
            const formData = new FormData();
            formData.append('file', base64Data);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            formData.append('folder', `reloop/${folder}`);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            return { success: true, url: data.secure_url };
        } catch (error) {
            console.error('Error uploading base64 image:', error);
            return { success: false, error: error.message };
        }
    },

    // Upload avatar
    async uploadAvatar(file) {
        const result = await this.uploadImage(file, 'avatars');

        if (result.success && typeof db !== 'undefined') {
            const userId = getCurrentUserId();
            if (userId) {
                await db.collection('users').doc(userId).update({ avatar: result.url });
            }
        }

        return result;
    },

    // Get optimized image URL (Cloudinary transformations)
    getOptimizedUrl(url, width = 400, quality = 'auto') {
        if (!url || !url.includes('cloudinary')) return url;

        // Insert transformation before /upload/
        return url.replace('/upload/', `/upload/w_${width},q_${quality},f_auto/`);
    },

    // Get thumbnail URL
    getThumbnailUrl(url) {
        return this.getOptimizedUrl(url, 150, 'auto');
    }
};
