import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const FeatureSection: React.FC<{
    item: { title: string; subtitle: string; description: string; image: string; accent: string };
    index: number
}> = ({ item, index }) => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [150, -150]);
    const imageY = useTransform(scrollYProgress, [0, 1], [-100, 100]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [0.9, 1]);

    return (
        <motion.section
            ref={sectionRef}
            style={{ opacity }}
            className="min-h-screen flex items-center justify-center py-32 relative overflow-hidden"
        >
            <div className={`container mx-auto px-6 flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center z-10`}>
                {/* Text Content */}
                <motion.div
                    style={{ y }}
                    className="flex-1 space-y-8"
                >
                    <div className="space-y-4">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: 80 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-1 bg-gradient-to-r ${item.accent}`}
                        />
                        <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary/60">
                            {item.subtitle}
                        </h3>
                    </div>

                    <h2 className="text-4xl sm:text-6xl md:text-8xl font-display font-black tracking-tighter leading-none mix-blend-difference">
                        {item.title}
                    </h2>

                    <p className="text-xl text-textSecondary leading-relaxed max-w-lg font-medium">
                        {item.description}
                    </p>

                    <button className="group relative px-8 py-4 overflow-hidden rounded-full border border-primary/20 transition-all hover:border-primary">
                        <span className="relative z-10 text-sm font-bold uppercase tracking-widest group-hover:text-black transition-colors">Explore Technology</span>
                        <div className="absolute inset-0 bg-primary translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.16, 1, 0.3, 1]" />
                    </button>
                </motion.div>

                {/* Visual Content */}
                <motion.div
                    style={{ scale }}
                    className="flex-1 w-full relative"
                >
                    <motion.div
                        style={{ y: imageY }}
                        className="relative aspect-[4/5] md:aspect-square rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10"
                    >
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                        {/* Floating Accent Glow */}
                        <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br ${item.accent} opacity-10 blur-[100px] animate-pulse`} />
                    </motion.div>

                    {/* Decorative Number */}
                    <span className="absolute -bottom-10 -left-10 text-[15vw] font-display font-black text-white/5 pointer-events-none select-none">
                        0{index + 1}
                    </span>
                </motion.div>
            </div>
        </motion.section>
    );
};

export const Features: React.FC = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
    const rotate = useTransform(springScroll, [0, 1], [0, 180]);
    const bgOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    const featureItems = [
        {
            title: "Pop-Out Words",
            subtitle: "Like a Pop-Out Book!",
            description: "Our smart AI magic finds the person in your photo and puts your words behind them. It looks just like a 3D pop-out book!",
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
            accent: "from-cyan-500 to-blue-400"
        },
        {
            title: "Super Clear Magic",
            subtitle: "Make it Shine",
            description: "Do you have a blurry photo? Our AI is like a magic lens that fixes the details and makes everything look sharp and bright.",
            image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop",
            accent: "from-orange-500 to-amber-300"
        },
        {
            title: "Fancy 3D Letters",
            subtitle: "Letters with Style",
            description: "Choose from thousands of cool fonts! We have shiny, wobbly, and super-modern letters that make your designs jump off the screen.",
            image: "https://images.unsplash.com/photo-1558478551-1a378f63ad28?q=80&w=1000&auto=format&fit=crop",
            accent: "from-fuchsia-600 to-purple-400"
        }
    ];

    return (
        <div ref={containerRef} className="bg-black text-white selection:bg-primary selection:text-white">
            {/* Epic Sticky Background */}
            <motion.div
                style={{ opacity: bgOpacity }}
                className="fixed inset-0 pointer-events-none z-0"
            >
                <motion.div
                    style={{ rotate }}
                    className="absolute top-[-20%] left-[-10%] w-[120vw] h-[120vh] border-[0.5px] border-white/5 rounded-[40%] scale-150"
                />
                <motion.div
                    style={{ rotate: useTransform(springScroll, [0, 1], [180, 0]) }}
                    className="absolute bottom-[-20%] right-[-10%] w-[100vw] h-[100vh] border-[0.5px] border-primary/10 rounded-[30%] scale-125"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            </motion.div>

            {/* Hero Section */}
            <section className="h-screen flex flex-col items-center justify-center relative z-10 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center px-6"
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xs font-black tracking-[1em] uppercase text-primary mb-8 block"
                    >
                        Core Capabilities
                    </motion.span>
                    <h1 className="text-[12vw] font-display font-black tracking-tighter leading-[0.8] mb-12">
                        COOL <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient-x">MASTERPIECES</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        The easiest way to make amazing 3D designs. It's like magic for your photos.
                    </p>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-10 flex flex-col items-center gap-4"
                >
                    <span className="text-[10px] font-black tracking-[0.5em] uppercase text-primary/40">Scroll to Dive</span>
                    <div className="w-[1px] h-24 bg-gradient-to-b from-primary to-transparent" />
                </motion.div>
            </section>

            {/* 3-Step Quick Guide */}
            <section className="py-32 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        {[
                            { step: "1", title: "Upload", text: "Pick your favorite photo from your phone or computer.", icon: "📸" },
                            { step: "2", title: "Write", text: "Type your name or cool words and move them into the depth.", icon: "✍️" },
                            { step: "3", title: "Save", text: "Download your 3D picture and show it to your friends!", icon: "✨" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]"
                            >
                                <div className="text-4xl mb-6">{item.icon}</div>
                                <h4 className="text-2xl font-black mb-2 uppercase tracking-tight">{item.title}</h4>
                                <p className="text-gray-400 text-sm font-medium">{item.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Sections */}
            <div className="relative z-10">
                {featureItems.map((item, index) => (
                    <FeatureSection key={item.title} item={item} index={index} />
                ))}
            </div>

            {/* Final CTA - Epic Scale */}
            <section className="h-screen flex flex-col items-center justify-center relative z-10">
                <motion.div
                    whileInView={{ scale: [0.8, 1], opacity: [0, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center space-y-16 px-6"
                >
                    <h2 className="text-5xl sm:text-7xl md:text-[10vw] font-display font-black tracking-tighter leading-none">
                        START YOUR <br />
                        <span className="italic text-primary">JOURNEY</span>
                    </h2>
                    <button className="group relative px-16 py-8 overflow-hidden rounded-full bg-white text-black transition-all hover:scale-110 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                        <span className="relative z-10 text-lg font-black uppercase tracking-[0.3em]">Launch App</span>
                        <div className="absolute inset-0 bg-primary translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.16, 1, 0.3, 1]" />
                    </button>
                </motion.div>
            </section>
        </div>
    );
};
