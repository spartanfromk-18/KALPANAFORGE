import React from 'react';
import { motion } from 'framer-motion';

export const Privacy: React.FC = () => {
    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-20 shadow-2xl relative overflow-hidden"
                >
                    {/* Royal Decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />

                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-12 relative z-10">
                        Privacy <span className="text-primary italic">Protocol</span>
                    </h1>

                    <div className="space-y-12 text-zinc-400 font-medium leading-relaxed relative z-10">
                        <section>
                            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-4">I. Our Commitment</h2>
                            <p>
                                At KalpanaForge, we treat your creative data with the same prestige as a royal artifact. Your privacy isn't just a policy—it's a core directive of the Forge. We ensure that your designs, images, and data remain under your absolute command.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-4">II. Data Sovereignty</h2>
                            <p>
                                Currently, for our local studio users, all project data is stored <strong>locally on your machine</strong>. We do not upload your masterpiece-level photos to any central server without your explicit AI-processing request. Even then, your data is processed and purged with high-end efficiency.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-4">III. AI Intelligence</h2>
                            <p>
                                When using our "Magic Clear" or "Pop-Out" AI features, your image is securely transmitted to our high-performance AI engines for processing. This data is encrypted and used only to serve your artistic goals by "our motto is to serve you" potential of the Forge.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-4">IV. Your Rights</h2>
                            <p>
                                You hold the "Royal Command" over your data. You can delete your local projects, manage your account, and rest assured that KalpanaForge never sells your artistic metadata to third-party entities.
                            </p>
                        </section>

                        <div className="pt-12 border-t border-white/5 flex items-center justify-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Secure Service Protocol v1.0.0 | KalpanaForge India</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
