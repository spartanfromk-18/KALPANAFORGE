import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MandalaPattern = ({ color, size, rotate, duration }: { color: string, size: string, rotate: number, duration: number }) => (
    <motion.div
        animate={{
            rotate: [0, rotate],
            scale: [0.95, 1.05, 0.95],
        }}
        transition={{
            rotate: { duration, repeat: Infinity, ease: "linear" },
            scale: { duration: duration / 2, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute opacity-[0.03] pointer-events-none"
        style={{ width: size, height: size }}
    >
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{ color }}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
            {[...Array(12)].map((_, i) => (
                <path
                    key={i}
                    d="M50 5 Q60 25 50 45 Q40 25 50 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    transform={`rotate(${i * 30} 50 50)`}
                />
            ))}
            {[...Array(24)].map((_, i) => (
                <circle
                    key={i}
                    cx={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
                    cy={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
                    r="1"
                    fill="currentColor"
                />
            ))}
        </svg>
    </motion.div>
);

export const About: React.FC = () => {
    const [view, setView] = useState<'ABOUT' | 'POLICY'>('ABOUT');

    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-primary/30">
            {/* LUXURY ROYAL BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Royal Ambient Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#FF9933]/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#138808]/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white/5 blur-[200px] rounded-full" />

                {/* Prestige Grid Line */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] mix-blend-overlay" />

                {/* Animated Mandala Masterpieces */}
                <div className="absolute top-0 left-0">
                    <MandalaPattern color="#FF9933" size="600px" rotate={360} duration={40} />
                </div>
                <div className="absolute bottom-0 right-0">
                    <MandalaPattern color="#138808" size="800px" rotate={-360} duration={60} />
                </div>

                {/* Central Ashoka Chakra - Royal Edition */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[1200px] max-h-[1200px] opacity-[0.04]"
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                        <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth="0.2" />
                        <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 1" />
                        {[...Array(24)].map((_, i) => (
                            <g key={i} transform={`rotate(${i * 15} 50 50)`}>
                                <line x1="50" y1="50" x2="50" y2="1" stroke="currentColor" strokeWidth="0.15" />
                                <circle cx="50" cy="1" r="0.4" fill="currentColor" />
                            </g>
                        ))}
                    </svg>
                </motion.div>

                {/* Golden Floating Dust */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: Math.random() * 1000 }}
                        animate={{
                            opacity: [0, 0.4, 0],
                            y: [null, Math.random() * -500],
                            x: [null, (Math.random() - 0.5) * 200]
                        }}
                        transition={{
                            duration: 10 + Math.random() * 20,
                            repeat: Infinity,
                            delay: Math.random() * 10
                        }}
                        className="absolute w-1 h-1 bg-yellow-400 rounded-full blur-[1px]"
                        style={{ left: `${Math.random() * 100}%` }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-6 pt-40 pb-32 relative z-10">
                {/* Navigation Toggle - Premium Design */}
                <div className="flex justify-center mb-24">
                    <div className="bg-white/5 backdrop-blur-xl p-1 rounded-full border border-white/10 flex gap-2 shadow-2xl">
                        <button
                            onClick={() => setView('ABOUT')}
                            className={`px-10 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all ${view === 'ABOUT' ? 'bg-white text-black shadow-white/20 shadow-xl' : 'text-zinc-500 hover:text-white'}`}
                        >
                            The Heritage
                        </button>
                        <button
                            onClick={() => setView('POLICY')}
                            className={`px-10 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all ${view === 'POLICY' ? 'bg-white text-black shadow-white/20 shadow-xl' : 'text-zinc-500 hover:text-white'}`}
                        >
                            The Protocol
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {view === 'ABOUT' ? (
                        <motion.div
                            key="about"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-5xl mx-auto"
                        >
                            <div className="flex flex-col items-center mb-16 space-y-6">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="px-6 py-1.5 rounded-full bg-gradient-to-r from-[#FF9933]/20 via-white/10 to-[#138808]/20 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3 backdrop-blur-md"
                                >
                                    <span className="w-1.5 h-1.5 bg-[#FF9933] rounded-full" />
                                    <span className="text-zinc-300">Proudly Conceived in India</span>
                                    <span className="w-1.5 h-1.5 bg-[#138808] rounded-full" />
                                </motion.div>

                                <h1 className="text-7xl md:text-9xl font-display font-black tracking-tighter text-center leading-[0.85]">
                                    CRAFTING THE <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">DIGITAL REIGN</span>
                                </h1>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                                <div className="lg:col-span-3 space-y-8">
                                    <p className="text-2xl text-zinc-300 font-medium leading-relaxed">
                                        KalpanaForge emerges from the vibrant heart of India's technological renaissance. We are not just a tool; we are a tribute to the timeless fusion of <span className="text-white border-b border-white/30">Vedic geometry</span> and <span className="text-white border-b border-white/30">Neural networks</span>.
                                    </p>
                                    <p className="text-lg text-zinc-500 leading-relaxed font-light">
                                        Our mission is to empower the global creative elite by removing every friction between intuition and pixels. Born in a land where art has no boundaries, we've built a sanctuary for those who dare to forge the future.
                                    </p>

                                    <div className="flex gap-4 pt-4">
                                        <div className="flex flex-col">
                                            <span className="text-4xl font-black text-white">100%</span>
                                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Sovereign Data</span>
                                        </div>
                                        <div className="w-[1px] h-12 bg-white/10 mx-4" />
                                        <div className="flex flex-col">
                                            <span className="text-4xl font-black text-white">2.5k</span>
                                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Royal Assets</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-2">
                                    <div className="bg-white/[0.03] backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 space-y-8 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
                                        <h3 className="text-3xl font-black text-white tracking-tight">The Arsenal</h3>
                                        <ul className="space-y-6">
                                            {[
                                                { t: "Deep Subject Isolation", d: "State-of-the-art neural occlusion" },
                                                { t: "Generative Precision", d: "Upscaling beyond human perception" },
                                                { t: "Tribute Layouts", d: "3D workflows for master creators" },
                                                { t: "Noble Typography", d: "Curated premium font sets" }
                                            ].map((item, i) => (
                                                <li key={i} className="flex flex-col gap-1">
                                                    <span className="text-white font-bold flex items-center gap-3">
                                                        <div className="w-1 h-1 bg-white rounded-full group-hover:scale-150 transition-transform" />
                                                        {item.t}
                                                    </span>
                                                    <span className="text-xs text-zinc-500 pl-4">{item.d}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="policy"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="text-center mb-16">
                                <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter text-white">THE PROTOCOL</h1>
                                <p className="text-zinc-500 uppercase tracking-[0.5em] text-[10px] mt-4 font-black">Zero Compromise Architecture</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { id: "01", t: "The Sovereign Principle", d: "Your creativity is yours alone. We implement a local-first processing paradigm where not a single byte of your visual content ever touches our servers. The 'Forge' is an private sanctuary on your device." },
                                    { id: "02", t: "Absolute Anonymity", d: "We do not track, we do not profile. KalpanaForge operates with total data hygiene. No cookies, no trackers, just pure creative flow governed by the Antigravity framework." },
                                    { id: "03", t: "The Vault Architecture", d: "All project data is stored in the browser's high-security sandbox. When you close the session, the memory is cleared unless you explicitly export your work to a secure ZIP archive." }
                                ].map((step) => (
                                    <div key={step.id} className="bg-white/5 p-12 rounded-[2rem] border border-white/10 hover:border-white/20 transition-colors group">
                                        <div className="flex items-start gap-8">
                                            <span className="text-6xl font-black text-white/10 group-hover:text-white/20 transition-colors">{step.id}</span>
                                            <div className="space-y-4">
                                                <h3 className="text-2xl font-black text-white tracking-tight">{step.t}</h3>
                                                <p className="text-zinc-400 leading-relaxed text-lg font-light">{step.d}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Global Footer Credits */}
                <div className="mt-32 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="flex items-center justify-center gap-8 mb-4"
                    >
                        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-white/20" />
                        <span className="text-white font-display font-bold text-lg tracking-[0.5em] uppercase opacity-40">Mritunshaya</span>
                        <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-white/20" />
                    </motion.div>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">
                        Precision Engineered in the Sovereign Republic of India
                    </p>
                </div>
            </div>
        </div>
    );
};
