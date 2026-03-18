import React from 'react';
import { AppState } from '../types';
import { TintedCard } from './TintedCard';
import { motion } from 'framer-motion';

interface LandingProps {
  setAppState: (state: AppState) => void;
}

export const Landing: React.FC<LandingProps> = ({ setAppState }) => {
  return (
    <div className="min-h-screen w-full relative bg-background overflow-x-hidden selection:bg-primary selection:text-white pb-32">

      {/* Rotating Circle Digital Transitions — White Mode */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Rotating Geometric Circles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] right-[-15%] w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] border border-primary/[0.07] rounded-[35%] opacity-40"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-25%] left-[-15%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] border border-accent/[0.06] rounded-[40%] opacity-30"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] border-[0.5px] border-secondary/[0.05] rounded-[30%] opacity-25"
        />

        {/* Subtle 3D Bubbles */}
        <div className="absolute top-[-5%] right-[-5%] w-[300px] h-[300px] bubble bubble-primary animate-float-slow opacity-25" />
        <div className="absolute top-[30%] left-[-10%] w-[250px] h-[250px] bubble bubble-secondary animate-float-medium opacity-20 animation-delay-2000" />
        <div className="absolute bottom-[-10%] right-[10%] w-[350px] h-[350px] bubble bubble-accent animate-float-fast opacity-15 animation-delay-4000" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-24 md:pt-32 lg:pt-48">

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-32 lg:mb-48">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <span className="px-4 py-2 rounded-full border border-border bg-surface/50 backdrop-blur text-xs font-bold uppercase tracking-widest text-primary shadow-sm">
              Design Intelligence Redefined
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[14vw] sm:text-7xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter text-textPrimary leading-[0.8] mb-8 md:mb-12"
          >
            KALPANA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">FORGE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-base md:text-xl text-textSecondary max-w-2xl font-medium leading-relaxed mb-10 md:mb-12"
          >
            The next generation of creative tools. Blend typography and imagery with
            AI-powered depth masking. Professional results, zero learning curve.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAppState(AppState.WORKFLOW_SELECTION)}
              className="w-full sm:w-auto px-10 py-5 bg-white text-black font-black uppercase tracking-[0.2em] rounded-full shadow-2xl hover:bg-primary hover:text-white transition-all duration-300"
            >
              Start New Project
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAppState(AppState.GALLERY)}
              className="w-full sm:w-auto px-10 py-5 bg-surface/60 backdrop-blur-xl border border-border text-textPrimary font-black uppercase tracking-[0.2em] rounded-full hover:bg-primary hover:text-white transition-all duration-300"
            >
              View Gallery
            </motion.button>
          </motion.div>

          {/* Floating Demo Preview */}
          <motion.div
            initial={{ opacity: 0, y: 100, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.8, duration: 1, type: "spring" }}
            className="mt-20 relative w-full max-w-4xl aspect-video rounded-3xl shadow-2xl overflow-hidden border border-white/50"
            style={{ perspective: '1000px' }}
          >
            <img
              src="/assets/hero_preview.png"
              className="w-full h-full object-cover"
              alt="KalpanaForge Interface Preview"
              loading="eager"
              width="1200"
              height="675"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-12">
              <h3 className="text-white text-3xl font-black tracking-tight drop-shadow-lg">Create Depth in Seconds</h3>
            </div>
          </motion.div>

        </div>

        {/* Features Grid */}
        <div className="mb-32">
          <div className="flex items-end justify-between mb-16 px-4">
            <div className="max-w-xl">
              <h3 className="text-primary font-bold uppercase tracking-widest mb-4">Why KalpanaForge</h3>
              <h2 className="text-4xl md:text-5xl font-black text-textPrimary tracking-tight leading-tight">
                Powerful Features. <br />
                <span className="text-textSecondary">Minimal Effort.</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <TintedCard backgroundImageUrl="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop">
              <h3 className="text-2xl font-black text-white mb-2">Hidden Words</h3>
              <p className="text-gray-200 text-sm font-medium leading-relaxed opacity-90">
                Put your text behind anything in your photo. It works like a 3D pop-out book!
              </p>
            </TintedCard>

            <TintedCard backgroundImageUrl="https://images.unsplash.com/photo-1633511090164-b43840ea1607?q=80&w=1000&auto=format&fit=crop">
              <h3 className="text-2xl font-black text-white mb-2">Magic Clear</h3>
              <p className="text-gray-200 text-sm font-medium leading-relaxed opacity-90">
                Make blurry pictures look super sharp and bright with our magic AI lens.
              </p>
            </TintedCard>

            <TintedCard backgroundImageUrl="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop">
              <h3 className="text-2xl font-black text-white mb-2">Fancy 3D Letters</h3>
              <p className="text-gray-200 text-sm font-medium leading-relaxed opacity-90">
                Pick from 2,500+ cool styles and watch your letters jump off the screen.
              </p>
            </TintedCard>
          </div>
        </div>

        {/* Smooth Transition into Footer */}
        <div className="mt-32 h-32 bg-gradient-to-b from-transparent via-zinc-900/30 to-zinc-950 rounded-t-[3rem]" />

        {/* Patriotic Indian Footer - High Visibility Upgrade */}
        <footer className="relative -mt-1 rounded-b-[3rem] overflow-hidden border border-white/20 bg-zinc-950 shadow-2xl group">
          {/* Tricolor Gradient Base - More Vibrant */}
          <div className="absolute inset-0 flex flex-col opacity-20">
            <div className="flex-1 bg-[#FF9933] blur-[100px]" />
            <div className="flex-1 bg-white blur-[100px]" />
            <div className="flex-1 bg-[#138808] blur-[100px]" />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

          {/* Background Chakra Decoration - The Living Heart of Bharat */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                x: ["100%", "0%", "-100%"],
                rotate: [0, 360],
                opacity: [0, 0.4, 0]
              }}
              transition={{
                x: { duration: 20, repeat: Infinity, ease: "linear" },
                rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                opacity: { duration: 20, repeat: Infinity, ease: "linear" }
              }}
              className="absolute top-1/2 -translate-y-1/2 right-0 w-[400px] h-[400px]"
            >
              <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="0.1" className="drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                <circle cx="12" cy="12" r="10" />
                {[...Array(24)].map((_, i) => (
                  <line
                    key={i}
                    x1="12" y1="12"
                    x2={12 + 10 * Math.cos((i * 15 * Math.PI) / 180)}
                    y2={12 + 10 * Math.sin((i * 15 * Math.PI) / 180)}
                  />
                ))}
              </svg>
            </motion.div>

            {/* THE VANDE MATARAM REVEAL (Emotional Core) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.8, 1, 1.1, 0.8],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                times: [0, 0.4, 0.6, 1],
                ease: "easeInOut"
              }}
              className="absolute inset-0 flex items-center justify-center pt-24"
            >
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black tracking-[1em] text-white/20 mb-4 uppercase">Sacred Tribute</span>
                <h4 className="text-6xl md:text-8xl font-black italic tracking-tighter opacity-10 select-none bg-gradient-to-r from-[#FF9933] via-white to-[#138808] bg-clip-text text-transparent">
                  VANDE MATARAM
                </h4>
              </div>
            </motion.div>
          </div>

          <div className="relative z-10 p-12 lg:p-16 flex flex-col md:flex-row justify-between items-center text-white">
            <div className="space-y-3 text-center md:text-left">
              <h3 className="font-black uppercase tracking-tighter text-3xl md:text-4xl text-white drop-shadow-md">
                Kalpana<span className="text-primary italic">Forge</span>
              </h3>
              <p className="font-bold text-sm tracking-tight text-white/90">
                © 2026 Developed with ❤️ in India.
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">Premium Design Intelligence</p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-8 mt-12 md:mt-0 font-black uppercase tracking-widest">
              <div className="flex gap-10 text-[10px]">
                <button
                  onClick={() => setAppState(AppState.PRIVACY)}
                  className="text-white hover:text-primary transition-all hover:scale-110"
                >
                  Privacy
                </button>
                <button
                  onClick={() => setAppState(AppState.TERMS)}
                  className="text-white hover:text-primary transition-all hover:scale-110"
                >
                  Terms
                </button>
                <a href="#" className="text-primary hover:text-white transition-all hover:scale-110 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Twitter / X
                </a>
              </div>
              <div className="flex items-center gap-4 py-2 px-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-[9px] text-zinc-400">BUILD VERSION</span>
                <span className="text-[9px] text-primary">v2.5.0-STAGE</span>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};
