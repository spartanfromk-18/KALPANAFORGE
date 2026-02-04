import React from 'react';
import { AppState } from '../types';
import { motion, AnimatePresence } from 'framer-motion';


interface NavbarProps {
  setAppState: (state: AppState) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setAppState, isDarkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center w-full pointer-events-none">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto glass-nav px-2 py-2 rounded-full flex items-center shadow-sm border border-white/40"
      >

        {/* Divider */}
        <div className="h-6 w-[1px] bg-border hidden sm:block"></div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center px-2">
          <button
            onClick={() => setAppState(AppState.FEATURES)}
            className="px-6 py-2 text-xs font-black uppercase tracking-widest text-textSecondary hover:text-primary transition-all rounded-full hover:bg-white/5"
          >
            Features
          </button>

          <div className="h-4 w-[1px] bg-white/10 mx-2" />

          <button
            onClick={() => setAppState(AppState.SHOWCASE)}
            className="px-6 py-2 text-xs font-black uppercase tracking-widest text-textSecondary hover:text-primary transition-all rounded-full hover:bg-white/5"
          >
            Showcase
          </button>

          <div className="h-4 w-[1px] bg-white/10 mx-2" />

          <button
            onClick={() => setAppState(AppState.ABOUT)}
            className="px-6 py-2 text-xs font-black uppercase tracking-widest text-textSecondary hover:text-primary transition-all rounded-full hover:bg-white/5"
          >
            About
          </button>

          <div className="h-4 w-[1px] bg-white/10 mx-2" />

          <button
            className="px-6 py-2 text-xs font-black uppercase tracking-widest text-textSecondary hover:text-primary transition-all rounded-full hover:bg-white/5"
          >
            Price
          </button>
        </div>

        {/* Action Buttons & Utilities */}
        <div className="flex items-center gap-2 pr-2">
          <div className="h-6 w-[1px] bg-white/20 mx-2" />

          <button
            onClick={toggleDarkMode}
            className="p-3 text-textSecondary hover:text-primary hover:bg-surfaceHighlight rounded-full transition-all"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            )}
          </button>

          <div className="h-6 w-[1px] bg-white/20 mx-2" />

          <button
            onClick={() => setAppState(AppState.WORKFLOW_SELECTION)}
            className="hidden sm:block px-8 py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-full transition-all hover:bg-primary hover:text-white shadow-xl hover:shadow-primary/30 active:scale-95 whitespace-nowrap"
          >
            Launch Studio
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 text-textSecondary hover:text-primary hover:bg-surfaceHighlight rounded-full transition-all"
            aria-label="Toggle Mobile Menu"
          >
            <div className="w-5 h-5 flex flex-col justify-center gap-1">
              <span className={`h-0.5 bg-current transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : 'w-5'}`} />
              <span className={`h-0.5 bg-current transition-all ${isMenuOpen ? 'opacity-0' : 'w-3'}`} />
              <span className={`h-0.5 bg-current transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : 'w-5'}`} />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="absolute top-24 left-6 right-6 p-8 bg-surface/90 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] shadow-2xl flex flex-col gap-6 md:hidden z-50 pointer-events-auto"
          >
            <div className="space-y-2">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 ml-4">Architecture</p>
              {[
                { label: 'About', state: AppState.ABOUT },
                { label: 'Features', state: AppState.FEATURES },
                { label: 'Showcase', state: AppState.SHOWCASE },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => { setAppState(item.state); setIsMenuOpen(false); }}
                  className="w-full text-left px-6 py-4 rounded-2xl text-lg font-black text-textPrimary hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="h-[1px] bg-border mx-4" />

            <button
              onClick={() => { setAppState(AppState.WORKFLOW_SELECTION); setIsMenuOpen(false); }}
              className="w-full px-8 py-5 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20"
            >
              Launch Studio
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};