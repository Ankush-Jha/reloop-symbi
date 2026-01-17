// QR Code Service for Trade Authentication
// Uses qrcode.js library for generation

const QRCodeService = {
    // Generate a unique trade verification code
    generateVerificationCode(tradeId, buyerId) {
        const timestamp = Date.now();
        const data = `${tradeId}:${buyerId}:${timestamp}`;
        // Simple hash for verification
        const hash = this.simpleHash(data);
        return {
            tradeId,
            buyerId,
            timestamp,
            hash,
            code: `RELOOP:${tradeId}:${buyerId}:${timestamp}:${hash}`
        };
    },

    // Simple hash function for verification
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16).substring(0, 8);
    },

    // Generate QR code and display in a container
    async generateQRCode(containerId, tradeId, buyerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('[QRCode] Container not found:', containerId);
            return null;
        }

        const verification = this.generateVerificationCode(tradeId, buyerId);

        // Clear existing content
        container.innerHTML = '';

        // Create QR code
        try {
            new QRCode(container, {
                text: verification.code,
                width: options.width || 200,
                height: options.height || 200,
                colorDark: options.colorDark || '#000000',
                colorLight: options.colorLight || '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });

            // Store verification data for later validation
            this.storeVerification(tradeId, verification);

            console.log('[QRCode] Generated for trade:', tradeId);
            return verification;
        } catch (error) {
            console.error('[QRCode] Error generating:', error);
            return null;
        }
    },

    // Store verification in Firestore for validation
    async storeVerification(tradeId, verification) {
        try {
            await db.collection('tradeVerifications').doc(tradeId).set({
                ...verification,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                expiresAt: new Date(verification.timestamp + 30 * 60 * 1000), // 30 min expiry
                verified: false
            });
            console.log('[QRCode] Verification stored for trade:', tradeId);
        } catch (error) {
            console.error('[QRCode] Error storing verification:', error);
        }
    },

    // Verify a scanned QR code
    async verifyCode(scannedCode, sellerId) {
        try {
            // Parse the code
            const parts = scannedCode.split(':');
            if (parts.length !== 5 || parts[0] !== 'RELOOP') {
                return { valid: false, error: 'Invalid QR code format' };
            }

            const [prefix, tradeId, buyerId, timestamp, hash] = parts;

            // Verify hash
            const expectedHash = this.simpleHash(`${tradeId}:${buyerId}:${timestamp}`);
            if (hash !== expectedHash) {
                return { valid: false, error: 'Invalid QR code - hash mismatch' };
            }

            // Check expiration (30 minutes)
            const codeTime = parseInt(timestamp);
            const now = Date.now();
            if (now - codeTime > 30 * 60 * 1000) {
                return { valid: false, error: 'QR code has expired' };
            }

            // Get trade from Firestore
            const tradeDoc = await db.collection('trades').doc(tradeId).get();
            if (!tradeDoc.exists) {
                return { valid: false, error: 'Trade not found' };
            }

            const trade = tradeDoc.data();

            // Verify seller is correct
            if (trade.sellerId !== sellerId) {
                return { valid: false, error: 'You are not the seller of this trade' };
            }

            // Verify buyer matches
            if (trade.buyerId !== buyerId) {
                return { valid: false, error: 'Buyer ID mismatch' };
            }

            // Mark as verified
            await db.collection('tradeVerifications').doc(tradeId).update({
                verified: true,
                verifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
                verifiedBy: sellerId
            });

            return {
                valid: true,
                trade,
                tradeId,
                message: 'QR code verified successfully!'
            };
        } catch (error) {
            console.error('[QRCode] Verification error:', error);
            return { valid: false, error: 'Verification failed: ' + error.message };
        }
    },

    // Create QR modal HTML
    createQRModal() {
        return `
            <div id="qr-modal" class="modal-overlay" style="display: none;">
                <div class="modal-content qr-modal">
                    <div class="modal-header">
                        <h3>🔐 Trade Verification QR</h3>
                        <button class="close-btn" onclick="QRCodeService.closeQRModal()">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p class="qr-instruction">Show this QR code to the seller to verify your identity and complete the trade.</p>
                        <div id="qr-container" class="qr-container"></div>
                        <div class="qr-info">
                            <p class="qr-expires">⏱️ Expires in <span id="qr-countdown">30:00</span></p>
                            <p class="qr-warning">Do not share this code with anyone else</p>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="QRCodeService.closeQRModal()">Close</button>
                        <button class="btn-primary" onclick="QRCodeService.regenerateQR()">Regenerate</button>
                    </div>
                </div>
            </div>
        `;
    },

    // Show QR modal
    async showQRModal(tradeId, buyerId) {
        // Add modal if not exists
        if (!document.getElementById('qr-modal')) {
            document.body.insertAdjacentHTML('beforeend', this.createQRModal());
            this.addModalStyles();
        }

        const modal = document.getElementById('qr-modal');
        modal.style.display = 'flex';

        // Store current trade info
        this.currentTradeId = tradeId;
        this.currentBuyerId = buyerId;

        // Generate QR
        const verification = await this.generateQRCode('qr-container', tradeId, buyerId);

        // Start countdown
        if (verification) {
            this.startCountdown(verification.timestamp);
        }
    },

    // Close QR modal
    closeQRModal() {
        const modal = document.getElementById('qr-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    },

    // Regenerate QR code
    async regenerateQR() {
        if (this.currentTradeId && this.currentBuyerId) {
            const verification = await this.generateQRCode('qr-container', this.currentTradeId, this.currentBuyerId);
            if (verification) {
                this.startCountdown(verification.timestamp);
            }
        }
    },

    // Start countdown timer
    startCountdown(startTime) {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        const countdownEl = document.getElementById('qr-countdown');
        const expiryTime = startTime + 30 * 60 * 1000; // 30 minutes

        this.countdownInterval = setInterval(() => {
            const now = Date.now();
            const remaining = expiryTime - now;

            if (remaining <= 0) {
                countdownEl.textContent = 'EXPIRED';
                clearInterval(this.countdownInterval);
                return;
            }

            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            countdownEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    },

    // Add modal styles
    addModalStyles() {
        if (document.getElementById('qr-modal-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'qr-modal-styles';
        styles.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 20px;
            }

            .modal-content.qr-modal {
                background: #1a1a1a;
                border: 1px solid #333;
                border-radius: 20px;
                max-width: 360px;
                width: 100%;
                animation: modalSlideIn 0.3s ease;
            }

            @keyframes modalSlideIn {
                from {
                    transform: translateY(20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            .modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px;
                border-bottom: 1px solid #333;
            }

            .modal-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 700;
                color: #22c358;
            }

            .close-btn {
                background: none;
                border: none;
                color: #888;
                cursor: pointer;
                padding: 4px;
            }

            .close-btn:hover {
                color: #fff;
            }

            .modal-body {
                padding: 24px;
                text-align: center;
            }

            .qr-instruction {
                color: #aaa;
                font-size: 14px;
                margin-bottom: 20px;
                line-height: 1.5;
            }

            .qr-container {
                display: flex;
                justify-content: center;
                padding: 20px;
                background: white;
                border-radius: 12px;
                margin-bottom: 16px;
            }

            .qr-info {
                text-align: center;
            }

            .qr-expires {
                color: #22c358;
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 8px;
            }

            .qr-warning {
                color: #ff6b6b;
                font-size: 12px;
                margin: 0;
            }

            .modal-actions {
                display: flex;
                gap: 12px;
                padding: 20px;
                border-top: 1px solid #333;
            }

            .modal-actions button {
                flex: 1;
                padding: 12px;
                border-radius: 10px;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                border: none;
            }

            .btn-secondary {
                background: #333;
                color: #fff;
            }

            .btn-primary {
                background: #22c358;
                color: #000;
            }

            .btn-primary:hover {
                filter: brightness(1.1);
            }
        `;
        document.head.appendChild(styles);
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QRCodeService;
}
