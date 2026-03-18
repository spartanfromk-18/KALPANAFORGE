import React, { useState, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { authService, User } from './services/authService';
import { Landing } from './components/Landing';
import { WorkflowSelection } from './components/WorkflowSelection';
import { Features } from './components/Features';
import { About } from './components/About';
import { Privacy } from './components/Privacy';
import { Terms } from './components/Terms';
import { Showcase } from './components/Showcase';
import { AppState } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';

// Lazy load the heavy Editor component
const Editor = lazy(() => import('./components/Editor.tsx').then(module => ({ default: module.Editor })));
const Gallery = lazy(() => import('./components/Gallery.tsx').then(module => ({ default: module.Gallery }))) as React.FC<{ onOpenAuth: () => void }>;

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [selectedAssets, setSelectedAssets] = useState<{ image: string; mask?: string } | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleImageSelection = (image: string, mask?: string) => {
    setSelectedAssets({ image, mask });
    setAppState(AppState.EDITOR);
  };

  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-background text-textPrimary font-sans selection:bg-primary selection:text-white transition-colors duration-300`}>

        {/* STANDALONE FIXED BRANDING (TOP-LEFT) */}
        <div
          onClick={() => setAppState(AppState.LANDING)}
          className="fixed top-6 left-8 z-[70] flex items-center gap-3 cursor-pointer group pointer-events-auto"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-xl group-hover:shadow-primary/30 group-hover:-translate-y-0.5 transition-all duration-500 overflow-hidden">
            <img src="/assets/kf_logo_v2.jpg" className="w-full h-full object-cover" alt="KalpanaForge Logo" width="40" height="40" decoding="async" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-black uppercase tracking-tighter text-textPrimary group-hover:text-primary transition-colors">Kalpana<span className="italic">Forge</span></span>
            <span className="text-[7px] font-black text-textSecondary tracking-[0.4em] uppercase">Elite Studio</span>
          </div>
        </div>

        <Navbar
          setAppState={setAppState}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* STANDALONE FIXED AUTH GATEWAY (TOP-RIGHT) */}
        <div className="fixed top-6 right-6 z-[70] flex items-center gap-4">
          {!currentUser ? (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="bg-surface/60 backdrop-blur-xl border border-border px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-textPrimary hover:bg-primary hover:text-white transition-all hover:-translate-y-0.5 hover:shadow-primary/30 hover:shadow-xl shadow-lg"
            >
              Sign In
            </button>
          ) : (
            <div className="flex items-center gap-4 bg-zinc-950/80 backdrop-blur-2xl border border-white/10 px-5 py-2.5 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="text-right hidden md:block leading-none">
                <p className="text-[10px] font-black text-white uppercase tracking-tighter mb-1">{currentUser.username}</p>
                <button
                  onClick={() => {
                    authService.signOut();
                    setCurrentUser(null);
                  }}
                  className="text-[8px] font-bold text-zinc-500 hover:text-red-400 uppercase tracking-widest transition-colors"
                >
                  Logout
                </button>
              </div>
              <img
                src={currentUser.avatar}
                className="w-10 h-10 rounded-full border-2 border-primary/20 shadow-lg hover:ring-2 hover:ring-primary transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-primary/20"
                alt={currentUser.username || 'User Avatar'}
                width="40"
                height="40"
                decoding="async"
                onClick={() => {
                  authService.signOut();
                  setCurrentUser(null);
                }}
              />
            </div>
          )}
        </div>

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={(user) => {
            setCurrentUser(user);
            const count = parseInt(localStorage.getItem(`kf_entry_count_${user.id}`) || '0');
            if (count <= 3) setShowWelcome(true);
          }}
        />

        <AnimatePresence>
          {showWelcome && currentUser && (
            <WelcomeScreen
              username={currentUser.username}
              onComplete={() => setShowWelcome(false)}
            />
          )}
        </AnimatePresence>

        <main id="main-content">
          {appState === AppState.LANDING && <Landing setAppState={setAppState} />}

          {appState === AppState.WORKFLOW_SELECTION && (
            <WorkflowSelection
              onBack={() => setAppState(AppState.LANDING)}
              onSelectImage={handleImageSelection}
            />
          )}

          {appState === AppState.FEATURES && <Features />}
          {appState === AppState.ABOUT && <About />}
          {appState === AppState.SHOWCASE && <Showcase />}
          {appState === AppState.PRIVACY && <Privacy />}
          {appState === AppState.TERMS && <Terms />}

          {appState === AppState.GALLERY && (
            <Suspense fallback={
              <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-primary font-bold tracking-widest text-xs animate-pulse">SYNCING VAULT...</p>
              </div>
            }>
              <Gallery onOpenAuth={() => setIsAuthOpen(true)} />
            </Suspense>
          )}

          {appState === AppState.EDITOR && (
            <Suspense fallback={
              <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-primary font-bold tracking-widest text-xs animate-pulse">ENGAGING ENGINE...</p>
              </div>
            }>
              <Editor
                initialImage={selectedAssets?.image}
                initialMask={selectedAssets?.mask}
                onReturnToHub={() => {
                  setSelectedAssets(undefined);
                  setAppState(AppState.WORKFLOW_SELECTION);
                }}
                onViewGallery={() => setAppState(AppState.GALLERY)}
              />
            </Suspense>
          )}
        </main>

        {appState !== AppState.LANDING && <Footer />}
      </div>
    </ErrorBoundary>
  );
};

export default App;