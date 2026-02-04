import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface WorkflowSelectionProps {
    onBack: () => void;
    onSelectImage: (image: string, mask?: string) => void;
}

const DEMO_ASSETS = [
    {
        id: 1,
        url: '/assets/demo_background.png',
        mask: '/assets/demo_subject.png',
        label: 'Mountain Hiker',
        desc: 'Classic depth effect example'
    },
    {
        id: 2,
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
        label: 'Urban Street',
        desc: 'Neon vibes & city lights'
    },
    {
        id: 3,
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
        label: 'Nature Landscape',
        desc: 'Scenic views with depth'
    }
];

export const WorkflowSelection: React.FC<WorkflowSelectionProps> = ({ onBack, onSelectImage }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const res = event.target?.result as string;
                onSelectImage(res);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 blur-[150px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 blur-[150px] rounded-full mix-blend-screen" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full max-w-4xl"
            >
                <button
                    onClick={onBack}
                    className="mb-8 text-gray-500 hover:text-white flex items-center gap-2 text-sm uppercase font-bold tracking-widest transition-colors"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                    Back to Home
                </button>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 text-center uppercase tracking-tighter leading-none px-4">
                    Choose your <span className="text-primary transparent-text-stroke">Canvas</span>
                </h2>
                <p className="text-gray-400 text-center mb-12 max-w-lg mx-auto">
                    Start with your own photo or explore the possibilities with our curated demo shots.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* OPTION 1: UPLOAD */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="group relative bg-surfaceHighlight/30 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-all overflow-hidden"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpload} />

                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-black transition-colors">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Upload Photo</h3>
                        <p className="text-sm text-gray-400">Use your own image. High resolution works best.</p>
                    </motion.div>

                    {/* OPTION 2: DEMOS */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Or Try a Demo</h3>
                        <div className="grid gap-3">
                            {DEMO_ASSETS.map((asset) => (
                                <motion.div
                                    key={asset.id}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center gap-4 p-3 rounded-xl bg-surfaceHighlight/30 border border-white/5 hover:border-white/20 cursor-pointer transition-colors"
                                    onClick={() => onSelectImage(asset.url, asset.mask)}
                                >
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                                        <img src={asset.url} alt={asset.label} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{asset.label}</h4>
                                        <p className="text-xs text-gray-500">{asset.desc}</p>
                                    </div>
                                    <div className="ml-auto text-primary opacity-0 group-hover:opacity-100">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};
