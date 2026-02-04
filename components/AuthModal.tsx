import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { authService, User } from '../services/authService';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: ''
    });

    const [isSuccess, setIsSuccess] = useState(false);

    // Emotional Cursor Tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try { // Added try block
            let user: User;
            if (mode === 'LOGIN') {
                user = await authService.signIn(formData.email, formData.password);
            } else {
                user = await authService.signUp(formData.email, formData.password, formData.username);
            }

            // Log the entry for "First 3 Times" logic
            const loginCountKey = `kf_entry_count_${user.id}`;
            const currentCount = parseInt(localStorage.getItem(loginCountKey) || '0');
            localStorage.setItem(loginCountKey, (currentCount + 1).toString());

            setIsSuccess(true);
            setTimeout(() => {
                onSuccess(user);
                setIsSuccess(false);
                onClose();
            }, 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        onMouseMove={handleMouseMove}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-zinc-950/90 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] p-10 group"
                    >
                        {/* THE ARTISTIC GLOW (Emotional Interaction) */}
                        <motion.div
                            style={{ left: springX, top: springY }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                        />

                        {/* Success Mandala Overlay */}
                        <AnimatePresence>
                            {isSuccess && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
                                >
                                    <motion.div
                                        initial={{ scale: 0.5, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,211,238,0.4)]"
                                    >
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </motion.div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Authentified</h3>
                                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-relaxed">Preparing your royal creative forge...</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Glows */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/10 blur-[80px] rounded-full pointer-events-none" />

                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
                                {mode === 'LOGIN' ? 'Welcome Back' : 'Join the Forge'}
                            </h2>
                            <p className="text-xs text-zinc-500 font-bold tracking-widest uppercase">
                                {mode === 'LOGIN' ? 'Access your prestigious workspace' : 'Start your creative journey today'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {mode === 'SIGNUP' && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-4">Username</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Arjun_Creator"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:border-primary/50 outline-none transition-all"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-4">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="your@studio.com"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:border-primary/50 outline-none transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-4">Password</label>
                                <input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:border-primary/50 outline-none transition-all"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-red-500 text-[10px] font-black uppercase text-center mt-2 px-4"
                                >
                                    ⚠️ {error}
                                </motion.div>
                            )}

                            <button
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primaryDark text-black font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.2)] transition-all active:scale-95 disabled:opacity-50 mt-4 group"
                            >
                                {loading ? 'Processing...' : (mode === 'LOGIN' ? 'Sign In' : 'Create Account')}
                            </button>
                        </form>

                        <div className="mt-8 text-center pt-8 border-t border-white/5">
                            <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">
                                {mode === 'LOGIN' ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    onClick={() => setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
                                    className="ml-2 text-primary hover:text-white transition-colors"
                                >
                                    {mode === 'LOGIN' ? 'Sign Up' : 'Log In'}
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
