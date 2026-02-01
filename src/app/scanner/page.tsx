'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Webcam from 'react-webcam';
import ScannerService from '@/lib/scanner-service';
import { useNavStore } from '@/lib/store/nav-store';
import { ScanningOverlay } from '@/components/scanner/ScanningOverlay';

export default function ScannerPage() {
    const router = useRouter();
    const webcamRef = useRef<Webcam>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cameraReady, setCameraReady] = useState(false);
    const { setActions, reset } = useNavStore();

    const capture = useCallback(async () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (!imageSrc) {
            setError('Failed to capture image. Please try again.');
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            const result = await ScannerService.analyzeImage(imageSrc);

            if (result.success) {
                router.push('/scanner/result');
            } else {
                setError('Unable to analyze item. Please try again.');
            }
        } catch (err) {
            console.error('Scan error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    }, [router]);

    // Register nav action for capture
    useEffect(() => {
        setActions({
            label: 'Capture',
            onClick: capture,
            icon: 'camera', // Ensure this icon exists or use 'photo_camera'
            disabled: isAnalyzing || !cameraReady,
            loading: isAnalyzing,
            variant: 'primary'
        });

        // Cleanup on unmount
        return () => reset();
    }, [capture, isAnalyzing, cameraReady]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        setError(null);

        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const imageSrc = reader.result as string;
                const result = await ScannerService.analyzeImage(imageSrc);

                if (result.success) {
                    router.push('/scanner/result');
                } else {
                    setError('Unable to analyze item. Please try again.');
                }
            } catch (err) {
                console.error('Scan error:', err);
                setError('An error occurred. Please try again.');
            } finally {
                setIsAnalyzing(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen bg-dark flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between p-4 bg-dark text-white z-10">
                <Link
                    href="/"
                    className="w-10 h-10 flex items-center justify-center bg-dark-surface rounded-xl border border-white/10"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                </Link>
                <h1 className="font-black uppercase tracking-wider text-white">Scan Item</h1>
                <div className="w-10 h-10 flex items-center justify-center bg-dark-surface rounded-xl border border-white/10">
                    <span className="material-symbols-outlined text-xl">flash_on</span>
                </div>
            </header>

            {/* Camera View */}
            <div className="flex-1 relative overflow-hidden mx-4 my-2 rounded-3xl border-2 border-white/20">
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                        facingMode: 'environment',
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    }}
                    onUserMedia={() => setCameraReady(true)}
                    onUserMediaError={() => setError('Camera access denied. Please allow camera permissions.')}
                    className="absolute inset-0 w-full h-full object-cover"
                />


                {/* Scan Frame */}
                {cameraReady && !isAnalyzing && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-56 h-56 border-4 border-primary rounded-3xl relative">
                            <div className="absolute -top-1 -left-1 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
                            <div className="absolute -top-1 -right-1 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
                            <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
                            <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-2xl" />
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="absolute bottom-4 left-4 right-4 bg-card-coral text-dark dark:text-white p-4 rounded-2xl text-center font-bold border-2 border-dark dark:border-gray-600 z-30">
                        {error}
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            <div className="bg-dark p-6 space-y-4">

                {/* Tips */}
                <p className="text-white/60 text-sm text-center">
                    Point camera at an item and tap to scan
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 bg-dark-surface text-white py-3 rounded-2xl font-bold border border-white/10 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-lg">photo_library</span>
                        Gallery
                    </button>
                    <button
                        onClick={() => router.push('/scanner/history')}
                        className="flex-1 bg-orange text-dark dark:text-white py-3 rounded-2xl font-bold border-2 border-dark dark:border-gray-600 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-lg">history</span>
                        History
                    </button>
                </div>
            </div>

            {/* Scanning Overlay (Full Screen) */}
            {isAnalyzing && (
                <ScanningOverlay />
            )}
        </div>
    );
}
