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
        <div className="relative w-full h-screen bg-[#020202] overflow-hidden font-display flex flex-col items-center justify-center selection:bg-white selection:text-black">
            
            {/* 3D Perspective Tunnel Layer */}
            <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ perspective: '800px' }}>
                <motion.div 
                    animate={{ rotateZ: [-1, 1, -1], scale: [1, 1.05, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-full h-full relative" 
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Top Ceiling: KALPANA */}
                    <div 
                        className="absolute top-0 left-1/2 -translate-x-1/2 flex items-end justify-center w-[250vw] h-[100vh] origin-bottom text-[#6d28d9]"
                        style={{ transform: 'rotateX(-75deg) translateZ(10vh)' }}
                    >
                        <span className="text-[40vw] font-black tracking-tighter leading-[0.7] opacity-80 mix-blend-screen drop-shadow-2xl">KALPANA</span>
                    </div>

                    {/* Bottom Floor: FORGE */}
                    <div 
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-start justify-center w-[250vw] h-[100vh] origin-top text-[#5b21b6]"
                        style={{ transform: 'rotateX(75deg) translateZ(10vh)' }}
                    >
                        <span className="text-[40vw] font-black tracking-tighter leading-[0.7] opacity-80 mix-blend-screen drop-shadow-2xl">FORGE</span>
                    </div>

                    {/* Left Wall: YOUR VISION */}
                    <div 
                        className="absolute top-1/2 left-0 -translate-y-1/2 flex flex-col items-end justify-center w-[100vw] h-[300vh] origin-right text-[#7c3aed]"
                        style={{ transform: 'rotateY(80deg) translateZ(20vw)' }}
                    >
                        <span className="text-[50vh] font-black tracking-widest leading-[0.75]">YOUR</span>
                        <span className="text-[50vh] font-black tracking-widest leading-[0.75]">VISION</span>
                    </div>

                    {/* Right Wall: ELITE STUDIO */}
                    <div 
                        className="absolute top-1/2 right-0 -translate-y-1/2 flex flex-col items-start justify-center w-[100vw] h-[300vh] origin-left text-[#7c3aed]"
                        style={{ transform: 'rotateY(-80deg) translateZ(20vw)' }}
                    >
                        <span className="text-[50vh] font-black tracking-widest leading-[0.75]">ELITE</span>
                        <span className="text-[50vh] font-black tracking-widest leading-[0.75]">STUDIO</span>
                    </div>
                </motion.div>
            </div>

            {/* Dark Fuses / Gradients for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none opacity-70" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] pointer-events-none opacity-80" />

            {/* Stage / Center Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl pt-12">
                <motion.h2 
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-white text-3xl md:text-5xl lg:text-[4rem] font-black uppercase tracking-tighter leading-[0.9] drop-shadow-2xl mb-12"
                >
                    THE CREATOR-FIRST <br/> 3D TYPOGRAPHY PLATFORM
                </motion.h2>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto mt-4"
                >
                    <button 
                        onClick={onOpenAuth} 
                        className="px-12 py-5 bg-white text-black text-xs font-black uppercase tracking-[0.2em] rounded-full hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-500"
                    >
                        Sign in to Vault
                    </button>
                    <button 
                        className="px-12 py-5 bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs font-black uppercase tracking-[0.2em] rounded-full hover:bg-white/10 hover:border-white/50 hover:-translate-y-1 shadow-lg transition-all duration-500"
                    >
                        Developer API
                    </button>
                </motion.div>
            </div>
            
            {/* Texture */}
            <div className="absolute inset-0 canvas-grid opacity-20 pointer-events-none mix-blend-overlay" />
        </div>
    );
};
