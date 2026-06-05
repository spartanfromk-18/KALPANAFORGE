 /**
 * Production View Routing Tree Matrix
 * Prevents unnecessary re-renders and preserves inner UI state cache.
 */

import React, { useState, Suspense, lazy, useMemo, useCallback } from 'react';
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

// Dynamic lazy loads for splitting high-weight module builds
const Editor = lazy(() => import('./components/Editor').then(m => ({ default: m.Editor })));
const Gallery = lazy(() => import('./components/Gallery').then(m => ({ default: m.Gallery })));

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [selectedAssets, setSelectedAssets] = useState<{ image: string; mask?: string } | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Stable callback strategies to enforce pure performance metrics
  const handleOpenAuth = useCallback(() => setIsAuthOpen(true), []);
  const handleCloseWelcome = useCallback(() => setShowWelcome(false), []);
  
  const handleReturnToHub = useCallback(() => {
    setSelectedAssets(undefined);
    setAppState(AppState.WORKFLOW_SELECTION);
  }, []);

  const handleViewGallery = useCallback(() => setAppState(AppState.GALLERY), []);

  // Compute view layer state allocations systematically
  const activeViewLayer = useMemo(() => {
    switch (appState) {
      case AppState.LANDING:
        return <Landing onStartWorkflow={() => setAppState(AppState.WORKFLOW_SELECTION)} />;
      case AppState.WORKFLOW_SELECTION:
        return (
          <WorkflowSelection 
            onSelectWorkflow={(assets) => {
              setSelectedAssets(assets);
              setAppState(AppState.EDITOR);
            }} 
          />
        );
      case AppState.GALLERY:
        return <Gallery onOpenAuth={handleOpenAuth} />;
      case AppState.EDITOR:
        return (
          <Editor
            initialImage={selectedAssets?.image}
            initialMask={selectedAssets?.mask}
            onReturnToHub={handleReturnToHub}
            onViewGallery={handleViewGallery}
          />
        );
      case AppState.FEATURES: return <Features />;
      case AppState.ABOUT: return <About />;
      case AppState.PRIVACY: return <Privacy />;
      case AppState.TERMS: return <Terms />;
      case AppState.SHOWCASE: return <Showcase />;
      default:
        return <Landing onStartWorkflow={() => setAppState(AppState.WORKFLOW_SELECTION)} />;
    }
  }, [appState, selectedAssets, handleOpenAuth, handleReturnToHub, handleViewGallery]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-background text-text-primary transition-colors duration-300">
        <Navbar 
          currentUser={currentUser} 
          onOpenAuth={handleOpenAuth} 
          onNavigate={(state) => setAppState(state)}
          currentTransientState={appState}
        />

        <main className="flex-grow relative z-10">
          <Suspense fallback={
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-50">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-primary font-mono tracking-wider text-xs opacity-80">LOADING STRUCTURAL COMPONENT...</p>
            </div>
          }>
            {activeViewLayer}
          </Suspense>
        </main>

        {appState !== AppState.LANDING && <Footer />}

        {showWelcome && <WelcomeScreen onClose={handleCloseWelcome} />}
        {isAuthOpen && (
          <AuthModal 
            isOpen={isAuthOpen} 
            onClose={() => setIsAuthOpen(false)} 
            onAuthSuccess={(user) => setCurrentUser(user)} 
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
