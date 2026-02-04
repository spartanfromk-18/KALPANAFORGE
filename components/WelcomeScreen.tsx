import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeScreenProps {
    username: string;
    onComplete: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ username, onComplete }) => {
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 5000); // Celebratory duration
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#001a4d] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Royal Background Orbitals */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -40, 0],
                            opacity: [0.1, 0.4, 0.1],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 10 + i * 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute rounded-full bg-primary/20 blur-[120px]"
                        style={{
                            width: `${400 + i * 100}px`,
                            height: `${400 + i * 100}px`,
                            left: `${(i * 20) % 100}%`,
                            top: `${(i * 30) % 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-2xl px-10 text-center space-y-12">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="flex justify-center mb-10">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="w-24 h-24 rounded-full border-2 border-primary/40 flex items-center justify-center bg-primary/5 shadow-[0_0_60px_rgba(34,211,238,0.3)] backdrop-blur-3xl"
                        >
                            <span className="text-5xl">👑</span>
                        </motion.div>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter leading-none mb-4">
                        WELCOME HOME <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary animate-gradient-x underline decoration-primary/20">
                            {username.toUpperCase()}
                        </span>
                    </h1>
                    <div className="h-0.5 w-32 bg-primary/30 mx-auto rounded-full" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1.5 }}
                    className="space-y-6"
                >
                    <p className="text-2xl md:text-3xl text-primary font-medium italic tracking-wide">
                        "Your vision is our command."
                    </p>

                    <p className="text-zinc-300 text-lg leading-relaxed font-medium max-w-lg mx-auto">
                        We are honored to serve your creative odyssey. The Forge is now primed with peak-performance AI to amplify your artistry by "our motto is to serve you".
                    </p>
                </motion.div>

                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.8, duration: 1 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(34,211,238,0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onComplete}
                    className="group relative px-16 py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-xs rounded-full overflow-hidden transition-all shadow-[0_20px_60px_rgba(34,211,238,0.2)]"
                >
                    <span className="relative z-10">Ascend to Workspace</span>
                    <div className="absolute inset-0 bg-primary translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.16, 1, 0.3, 1]" />
                </motion.button>
            </div>

            {/* ARTISTIC PARTY POP - Reworked Explosion Logic */}
            <AnimatePresence>
                {showConfetti && (
                    <div className="absolute inset-0 pointer-events-none z-[250]">
                        {[...Array(100)].map((_, i) => {
                            const angle = Math.random() * Math.PI * 2;
                            const distance = 200 + Math.random() * 600;
                            const targetX = Math.cos(angle) * distance;
                            const targetY = Math.sin(angle) * distance;

                            return (
                                <motion.div
                                    key={i}
                                    initial={{
                                        left: "50%",
                                        top: "40%", // Start from the crown area
                                        scale: 0,
                                        rotate: 0,
                                        opacity: 1
                                    }}
                                    animate={{
                                        x: [0, targetX, targetX * 1.1],
                                        y: [0, targetY, targetY + 600], // Gravity fall
                                        scale: [0, 1.5, 1, 0.5],
                                        rotate: [0, 360, 1080],
                                        opacity: [1, 1, 0.8, 0]
                                    }}
                                    transition={{
                                        duration: 3 + Math.random() * 2.5,
                                        ease: "easeOut",
                                        times: [0, 0.4, 0.7, 1]
                                    }}
                                    className={`absolute w-3 h-5 rounded-[2px] shadow-2xl ${['bg-primary', 'bg-secondary', 'bg-white', 'bg-amber-400', 'bg-cyan-400', 'bg-fuchsia-500'][i % 6]
                                        }`}
                                />
                            );
                        })}
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
