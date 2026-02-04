import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SavedProject } from '../types';
import { authService, User } from '../services/authService';
import { getAllProjects, deleteProjectFromRepo } from '../services/storageService';

interface GalleryProps {
    onOpenAuth: () => void;
}

export const Gallery: React.FC<GalleryProps> = ({ onOpenAuth }) => {
    const [currentUser] = useState<User | null>(authService.getCurrentUser());
    const [projects, setProjects] = useState<SavedProject[]>([]);

    useEffect(() => {
        const load = async () => {
            if (currentUser) {
                const results = await getAllProjects();
                setProjects(results);
            }
        };
        load();
    }, [currentUser]);

    if (!currentUser) {
        return <PreLoginView onOpenAuth={onOpenAuth} />;
    }

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <p className="text-primary font-black uppercase tracking-[0.5em] text-[10px] mb-2">Creative Vault</p>
                    <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Your <span className="text-primary italic">Repository</span></h1>
                </div>
                <div className="text-right">
                    <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest">{projects.length} PROJECTS SECURED</span>
                </div>
            </header>

            {projects.length === 0 ? (
                <div className="h-[400px] rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center p-12 bg-surface/30">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-zinc-600">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" /><path d="M6 18h14" /></svg>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase">The Vault is Empty</h3>
                    <p className="text-zinc-500 max-w-sm mt-2 font-medium">Capture your creative vision in the Studio to see them archived here in elite quality.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group relative bg-surface/50 border border-white/10 rounded-[2rem] overflow-hidden hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/10"
                        >
                            <div className="aspect-[16/10] overflow-hidden">
                                <img src={project.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={project.name} />
                            </div>
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-black text-white uppercase truncate pr-4">{project.name}</h3>
                                    <button
                                        onClick={async () => {
                                            if (confirm("Delete project?")) {
                                                await deleteProjectFromRepo(project.id);
                                                setProjects(prev => prev.filter(p => p.id !== project.id));
                                            }
                                        }}
                                        className="text-zinc-600 hover:text-red-400 transition-colors"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                    </button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{new Date(project.lastModified).toLocaleDateString()}</span>
                                    <div className="h-1 w-1 rounded-full bg-zinc-700" />
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{project.layers.length} LAYERS</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

const PreLoginView: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
    return (
        <div className="fixed inset-0 bg-[#020617] overflow-hidden flex items-center justify-center">
            {/* BACKGROUND ANTARCTICA */}
            <div className="absolute inset-0 z-0">
                <img src="/assets/demo_mountains.png" className="w-full h-full object-cover opacity-40 blur-sm" alt="Antarctica" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-transparent to-[#020617]" />
            </div>

            {/* THE BIG MOUNTAIN IN FRONT */}
            <motion.div
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute bottom-[-10%] md:bottom-[-20%] left-1/2 -translate-x-1/2 w-full max-w-6xl z-20"
            >
                <div className="relative">
                    <svg viewBox="0 0 1000 600" className="w-full h-auto fill-zinc-900 filter drop-shadow-[0_0_100px_rgba(34,211,238,0.2)]">
                        <path d="M 0 600 L 200 400 L 400 500 L 600 200 L 800 450 L 1000 300 L 1000 600 Z" />
                    </svg>

                    {/* SO HIGH GOALS TEXT */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full">
                        <motion.h2
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1, duration: 2 }}
                            className="text-5xl md:text-[8rem] font-black text-white/80 uppercase tracking-tighter drop-shadow-[0_0_80px_rgba(34,211,238,0.6)] text-shadow-glow px-6"
                        >
                            So High <span className="text-primary italic drop-shadow-[0_0_40px_rgba(34,211,238,0.8)]">GOALS</span>
                        </motion.h2>
                    </div>
                </div>
            </motion.div>

            {/* THE SILLY FIGHT (Emotional & Clumsy) */}
            <div className="relative z-30 flex items-center justify-center gap-12 scale-75 md:scale-100">
                {/* ICE BEAR */}
                <motion.div
                    animate={{
                        x: [0, 40, -20, 10, 0],
                        y: [0, -30, 10, -10, 0],
                        rotate: [0, 10, -15, 5, 0],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative w-64 h-64"
                >
                    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        <motion.path
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                            d="M100 80 Q120 70 140 85 Q160 100 155 120 Q150 140 130 145 L70 145 Q50 140 45 120 Q40 100 60 85 Q80 70 100 80"
                            fill="white"
                        />
                        <circle cx="85" cy="100" r="3" fill="#1e293b" />
                        <circle cx="115" cy="100" r="3" fill="#1e293b" />
                        <motion.path
                            animate={{ rotate: [0, 45, 0] }}
                            d="M100 115 Q100 120 105 115"
                            stroke="#1e293b" strokeWidth="2" fill="none"
                        />
                        <circle cx="75" cy="85" r="8" fill="white" />
                        <circle cx="125" cy="85" r="8" fill="white" />
                    </svg>
                    <div className="absolute -top-4 -right-4 px-3 py-1 bg-white/10 backdrop-blur rounded-full border border-white/20">
                        <p className="text-[8px] font-black text-white">ICE TANK</p>
                    </div>
                </motion.div>

                <div className="text-4xl font-black text-primary italic drop-shadow-2xl animate-bounce">VS</div>

                {/* SILLY PANDA */}
                <motion.div
                    animate={{
                        x: [0, -50, 30, -10, 0],
                        y: [0, 20, -40, 10, 0],
                        rotate: [0, -20, 15, -5, 0],
                    }}
                    transition={{
                        duration: 4.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.2
                    }}
                    className="relative w-64 h-64"
                >
                    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_30px_rgba(0,0,0,0.4)]">
                        {/* Body */}
                        <motion.path
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                            d="M100 80 Q120 70 140 85 Q160 100 155 120 Q150 140 130 145 L70 145 Q50 140 45 120 Q40 100 60 85 Q80 70 100 80"
                            fill="#f8fafc"
                        />
                        {/* Panda Patterns */}
                        <circle cx="70" cy="110" r="15" fill="#020617" />
                        <circle cx="130" cy="110" r="15" fill="#020617" />
                        <circle cx="75" cy="85" r="10" fill="#020617" />
                        <circle cx="125" cy="85" r="10" fill="#020617" />
                        {/* Eyes */}
                        <circle cx="85" cy="100" r="4" fill="white" />
                        <circle cx="115" cy="100" r="4" fill="white" />
                        <circle cx="85" cy="100" r="2" fill="#020617" />
                        <circle cx="115" cy="100" r="2" fill="#020617" />
                        {/* Nose */}
                        <path d="M100 110 L95 115 L105 115 Z" fill="#020617" />
                    </svg>
                    <div className="absolute -top-4 -left-4 px-3 py-1 bg-primary/20 backdrop-blur rounded-full border border-primary/30">
                        <p className="text-[8px] font-black text-primary tracking-widest uppercase">Bamboo Warrior</p>
                    </div>
                </motion.div>
            </div>

            <div className="relative z-30 flex flex-col items-center -mt-12">

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    className="mt-12 text-center"
                >
                    <p className="text-zinc-500 font-bold uppercase tracking-[0.5em] text-[10px] mb-6">Restricted Access • Synchronize Identity</p>
                    <button
                        onClick={onOpenAuth}
                        className="bg-white hover:bg-primary hover:text-white text-black px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] transition-all hover:scale-110 active:scale-95 shadow-2xl shadow-primary/20"
                    >
                        Sign In To Open Vault
                    </button>
                </motion.div>
            </div>

            {/* Emotional Particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-20"
                    animate={{
                        y: [-20, 1000],
                        x: [Math.random() * 2000, Math.random() * 2000],
                        opacity: [0, 0.5, 0]
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        delay: Math.random() * 20
                    }}
                />
            ))}
        </div>
    );
};
