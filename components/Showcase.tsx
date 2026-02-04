import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

const ShowcaseCard: React.FC<{ title: string; image: string }> = ({ title, image }) => {
    const cardRef = useRef(null);
    const [isClicked, setIsClicked] = useState(false);

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative group aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 bg-surfaceHighlight/20 shadow-2xl cursor-pointer"
            onClick={() => setIsClicked(!isClicked)}
        >
            <AnimatePresence mode="wait">
                <motion.img
                    key={isClicked ? 'after' : 'before'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={image}
                    alt={title}
                    className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${!isClicked ? 'grayscale blur-[2px]' : ''}`}
                />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

            <div className="absolute top-6 right-6">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isClicked ? 'bg-primary text-black' : 'bg-white/10 text-white'}`}>
                    {isClicked ? 'DEPTH FORGED' : 'RAW INPUT'}
                </div>
            </div>

            <div className="absolute bottom-10 left-10 right-10">
                <motion.h3 className="text-3xl font-display font-black text-white tracking-tighter">
                    {title}
                </motion.h3>
                <p className="text-primary text-[10px] font-bold uppercase tracking-widest mt-2">{isClicked ? 'Click to see original' : 'Click to see magic'}</p>
            </div>

            {/* Visual indicator of "depth" during before/after toggle */}
            {!isClicked && (
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
                    <span className="text-6xl font-display font-black text-white/10 select-none">FLAT</span>
                </div>
            )}
            {isClicked && (
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
                    <motion.span initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-6xl font-display font-black text-white mix-blend-overlay">DEPTH</motion.span>
                </div>
            )}
        </motion.div>
    );
};

export const Showcase: React.FC = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
    const rotate = useTransform(springScroll, [0, 1], [0, 360]);

    const showcaseItems = [
        { title: "Urban Neon", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop" },
        { title: "Mountain Peak", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop" },
        { title: "Cyberpunk City", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000&auto=format&fit=crop" },
        { title: "Forest Mist", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop" },
        { title: "Ocean Depth", image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1000&auto=format&fit=crop" },
        { title: "Desert Gold", image: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=1000&auto=format&fit=crop" }
    ];

    return (
        <div ref={containerRef} className="min-h-[300vh] bg-black text-white selection:bg-primary selection:text-white">
            {/* Floating Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    style={{ rotate }}
                    className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] border border-primary/10 rounded-[30%] opacity-20"
                />
                <motion.div
                    style={{ rotate: useTransform(springScroll, [0, 1], [360, 0]) }}
                    className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] border border-secondary/10 rounded-[40%] opacity-20"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full" />
            </div>

            {/* Hero Section */}
            <section className="h-screen flex flex-col items-center justify-center relative z-10 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                >
                    <h1 className="text-[15vw] font-display font-black tracking-tighter leading-none mb-4 mix-blend-difference">
                        SHOW<span className="text-primary italic">CASE</span>
                    </h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-xl md:text-3xl font-medium text-gray-400 tracking-widest uppercase"
                    >
                        The Art of Digital Depth
                    </motion.p>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-10 flex flex-col items-center gap-2"
                >
                    <div className="w-[1px] h-20 bg-gradient-to-b from-primary to-transparent" />
                    <span className="text-[10px] font-black tracking-[0.5em] uppercase text-primary">Scroll to Explore</span>
                </motion.div>
            </section>

            {/* Interactive Gallery */}
            <section className="container mx-auto px-6 py-32 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20">
                    {showcaseItems.map((item) => (
                        <ShowcaseCard
                            key={item.title}
                            title={item.title}
                            image={item.image}
                        />
                    ))}
                </div>
            </section>

            {/* The "Process" Visualization */}
            <section className="py-64 relative z-10 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mb-32">
                        <h2 className="text-4xl sm:text-6xl md:text-8xl font-display font-black tracking-tighter mb-8 text-center md:text-left">
                            THE <span className="text-secondary">ALCHEMY</span> <br />
                            OF PIXELS
                        </h2>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                            Witness the transition from flat imagery to immersive depth. Our AI engine deconstructs reality to rebuild it with your creative intent.
                        </p>
                    </div>

                    <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 group cursor-ew-resize">
                        <section className="absolute inset-0 flex items-center justify-center bg-zinc-900 pointer-events-none overflow-hidden z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="text-xs font-black tracking-[0.5em] text-white/20 uppercase">Drag the slider to see magic</div>
                        </section>

                        <div className="absolute inset-0 flex overflow-hidden">
                            {/* Before */}
                            <div className="absolute inset-0 z-0">
                                <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover blur-sm grayscale opacity-50" alt="Before" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-4xl md:text-8xl font-display font-black tracking-tighter text-white/5 uppercase">RAW INPUT</span>
                                </div>
                            </div>

                            {/* After (Clipped by mouse) */}
                            <div className="absolute inset-0 z-20 group-hover:bg-primary/5 transition-colors overflow-hidden"
                                style={{ clipPath: 'inset(0 0 0 calc(var(--slider-pos, 50) * 1%))' }}
                            >
                                <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover scale-105" alt="After" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.span
                                        animate={{ scale: [1, 1.1, 1], rotate: [-1, 1, -1] }}
                                        transition={{ duration: 5, repeat: Infinity }}
                                        className="text-8xl md:text-[15vw] font-display font-black text-white/80 mix-blend-overlay drop-shadow-[0_0_50px_rgba(34,211,238,0.5)]"
                                    >
                                        FORGED
                                    </motion.span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Slider Handle */}
                        <div
                            className="absolute top-0 bottom-0 z-30 w-[4px] bg-primary shadow-[0_0_30px_rgba(34,211,238,1)] pointer-events-none"
                            style={{ left: 'calc(var(--slider-pos, 50) * 1%)' }}
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-4 border-primary bg-black flex items-center justify-center shadow-2xl">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-primary"><path d="M18 8L22 12L18 16" /><path d="M6 8L2 12L6 16" /></svg>
                            </div>
                        </div>

                        {/* Actual Input for Sliding */}
                        <input
                            type="range"
                            min="0"
                            max="100"
                            defaultValue="50"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
                            onInput={(e) => {
                                const target = e.currentTarget.parentElement;
                                if (target) target.style.setProperty('--slider-pos', e.currentTarget.value);
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="h-screen flex flex-col items-center justify-center relative z-10">
                <motion.div
                    whileInView={{ scale: [0.9, 1.1, 1], opacity: [0, 1] }}
                    viewport={{ once: true }}
                    className="text-center space-y-12"
                >
                    <h2 className="text-5xl sm:text-7xl md:text-9xl font-display font-black tracking-tighter leading-none">
                        YOUR TURN TO <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">CREATE</span>
                    </h2>
                    <button className="px-16 py-8 bg-primary text-white font-bold text-lg uppercase tracking-[0.3em] rounded-full hover:bg-white hover:text-black transition-all hover:scale-110 active:scale-95 shadow-2xl shadow-primary/20">
                        Launch the Forge
                    </button>
                </motion.div>
            </section>
        </div>
    );
};
