import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/features/auth/AuthContext';
import { SubscriptionProvider } from '@/features/subscription/SubscriptionContext';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageTransition } from '@/components/shared/PageTransition';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import PricingPage from '@/pages/PricingPage';
import DashboardPage from '@/pages/DashboardPage';
import ErasPage from '@/pages/ErasPage';
import LessonPage from '@/pages/LessonPage';
import QuizPage from '@/pages/QuizPage';
import TimelinePage from '@/pages/TimelinePage';
import AiTutorPage from '@/pages/AiTutorPage';
import ProfilePage from '@/pages/ProfilePage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import FlashcardsPage from '@/pages/FlashcardsPage';
import NotesPage from '@/pages/NotesPage';
import ProgressPage from '@/pages/ProgressPage';
import SmartQuizPage from '@/pages/SmartQuizPage';
import AppGuidePage from '@/pages/AppGuidePage';
import ReportPage from '@/pages/ReportPage';
import EssayPage from '@/pages/EssayPage';
import VideoReviewPage from '@/pages/VideoReviewPage';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/eras" element={<ProtectedRoute><ErasPage /></ProtectedRoute>} />
          <Route path="/eras/:eraId/lessons/:lessonId" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
          <Route path="/eras/:eraId/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
          <Route path="/timeline" element={<ProtectedRoute><TimelinePage /></ProtectedRoute>} />
          <Route path="/tutor" element={<ProtectedRoute><AiTutorPage /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
          <Route path="/flashcards" element={<ProtectedRoute><FlashcardsPage /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
          <Route path="/smart-quiz" element={<ProtectedRoute><SmartQuizPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/guide" element={<ProtectedRoute><AppGuidePage /></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
          <Route path="/essay" element={<ProtectedRoute><EssayPage /></ProtectedRoute>} />
          <Route path="/video-review" element={<ProtectedRoute><VideoReviewPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="historify-theme">
        <AuthProvider>
          <SubscriptionProvider>
            <BrowserRouter>
              <AnimatedRoutes />
            </BrowserRouter>
            <Toaster />
          </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
export default App;
