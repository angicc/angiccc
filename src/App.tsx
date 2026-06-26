import { useState, useCallback } from 'react';
import { AuthProvider } from './context/AuthContext';
import AnimatedAuthLoader from './components/auth/AnimatedAuthLoader';
import AuthModal from './components/auth/AuthModal';
import DashboardShell from './components/layout/DashboardShell';
import LandingPage from './components/views/LandingPage';
import GlobalAiSupportBot from './components/chat/GlobalAiSupportBot';

type AppPhase = 'landing' | 'auth_in' | 'dashboard' | 'auth_out';

function AppInner() {
  const [phase, setPhase] = useState<AppPhase>('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleEnterApp = useCallback(() => {
    setShowAuthModal(true);
  }, []);

  const handleAuthSuccess = useCallback(() => {
    setShowAuthModal(false);
    setPhase('auth_in');
  }, []);

  const handleLoginComplete = useCallback(() => {
    setPhase('dashboard');
  }, []);

  const handleLogout = useCallback(() => {
    setPhase('auth_out');
  }, []);

  const handleLogoutComplete = useCallback(() => {
    setPhase('landing');
  }, []);

  return (
    <>
      {/* Animated transitions */}
      {phase === 'auth_in' && (
        <AnimatedAuthLoader mode="login" onComplete={handleLoginComplete} />
      )}
      {phase === 'auth_out' && (
        <AnimatedAuthLoader mode="logout" onComplete={handleLogoutComplete} />
      )}

      {/* Auth modal (on landing page) */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />
      )}

      {/* Main views */}
      {(phase === 'landing' || phase === 'auth_in') && (
        <LandingPage onEnterApp={handleEnterApp} />
      )}
      {phase === 'dashboard' && (
        <DashboardShell onLogout={handleLogout} />
      )}

      {/* Global AI chatbot — always visible */}
      <GlobalAiSupportBot />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
