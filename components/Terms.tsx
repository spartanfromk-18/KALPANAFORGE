import React from 'react';
import { motion } from 'framer-motion';

export const Terms: React.FC = () => {
    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-20 shadow-2xl relative overflow-hidden"
                >
                    {/* Royal Decoration */}
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full" />

                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-12 relative z-10">
                        Terms of <span className="text-primary italic">Forge</span>
                    </h1>

                    <div className="space-y-12 text-zinc-400 font-medium leading-relaxed relative z-10">
                        <section>
                            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-4">1. Creative License</h2>
                            <p>
                                By entering the Forge, you agree to use our design intelligence for creative excellence. You retain full ownership of any masterpiece you forge, while granting us the limited right to process your data to fulfill your design requests.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-4">2. Prohibited Exploits</h2>
                            <p>
                                The "our motto is to serve you" potential of the Forge must not be used for malicious intent, deceptive manipulation, or the creation of harmful content. We serve artists, and we expect our community to uphold the highest standards of professional conduct.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-4">3. AI Service Availability</h2>
                            <p>
                                Our AI features rely on high-performance cloud intelligence. While we aim for uptime as "our motto is to serve you", maintenance and external API limits (like Gemini) may occasionally impact speed. We strive to provide consistent, royal-grade service at all times.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-4">4. Liability Command</h2>
                            <p>
                                KalpanaForge is a studio tool. While we provide the "Magic," the ultimate creative decisions and legal rights of your outputs remain your responsibility. We provide the forge; you provide the vision.
                            </p>
                        </section>

                        <div className="pt-12 border-t border-white/5 flex items-center justify-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Unified Creative Decree v1.0.0 | KalpanaForge India</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
