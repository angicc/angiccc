import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider, useAuth } from '@/features/auth/AuthContext';
import { SubscriptionProvider } from '@/features/subscription/SubscriptionContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LogoutScreen } from '@/components/shared/LogoutScreen';
import { BetaGate } from '@/components/BetaGate';
import { Suspense, lazy } from 'react';
import { HistoryLoadingScreen } from '@/components/shared/HistoryLoadingScreen';

// Entry routes stay eager: they are what a cold visitor paints first, so
// deferring them would only add a loading screen in front of the landing page.
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

// Everything behind them is split out. These pages carry the app's bulk — baked
// lesson/quiz translations, map geometry, Leaflet — and a visitor needs only the
// route they actually open, not all 24 at once.
const PricingPage = lazy(() => import('@/pages/PricingPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ErasPage = lazy(() => import('@/pages/ErasPage'));
const LessonPage = lazy(() => import('@/pages/LessonPage'));
const QuizPage = lazy(() => import('@/pages/QuizPage'));
const TimelinePage = lazy(() => import('@/pages/TimelinePage'));
const AiTutorPage = lazy(() => import('@/pages/AiTutorPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'));
const FlashcardsPage = lazy(() => import('@/pages/FlashcardsPage'));
const NotesPage = lazy(() => import('@/pages/NotesPage'));
const ProgressPage = lazy(() => import('@/pages/ProgressPage'));
const SmartQuizPage = lazy(() => import('@/pages/SmartQuizPage'));
const AppGuidePage = lazy(() => import('@/pages/AppGuidePage'));
const ReportPage = lazy(() => import('@/pages/ReportPage'));
const EssayPage = lazy(() => import('@/pages/EssayPage'));
const VideoReviewPage = lazy(() => import('@/pages/VideoReviewPage'));
const FriendsPage = lazy(() => import('@/pages/FriendsPage'));
const DebatePhilosopherPage = lazy(() => import('@/pages/DebatePhilosopherPage'));
const TimelineMapPage = lazy(() => import('@/pages/TimelineMapPage'));
const ChronosCrisisPage = lazy(() => import('@/pages/ChronosCrisisPage'));
const ImperiumPage = lazy(() => import('@/pages/ImperiumPage'));
const StudioPage = lazy(() => import('@/pages/StudioPage'));
const StudyPlanPage = lazy(() => import('@/pages/StudyPlanPage'));

function LogoutOverlay() {
  const { loggingOut } = useAuth();
  return <LogoutScreen show={loggingOut} />;
}

function AppRoutes() {
  return (
    <Suspense fallback={<HistoryLoadingScreen show />}>
    <Routes>
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
      <Route path="/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
      <Route path="/debate" element={<ProtectedRoute><DebatePhilosopherPage /></ProtectedRoute>} />
      <Route path="/timeline-map" element={<ProtectedRoute><TimelineMapPage /></ProtectedRoute>} />
      <Route path="/crisis" element={<ProtectedRoute><ChronosCrisisPage /></ProtectedRoute>} />
      <Route path="/imperium" element={<ProtectedRoute><ImperiumPage /></ProtectedRoute>} />
      <Route path="/studio" element={<ProtectedRoute><StudioPage /></ProtectedRoute>} />
      <Route path="/study-plan" element={<ProtectedRoute><StudyPlanPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BetaGate>
      <ThemeProvider defaultTheme="dark" storageKey="historify-theme">
        <AuthProvider>
          <SubscriptionProvider>
            <LanguageProvider>
              <BrowserRouter>
                <AppRoutes />
                <LogoutOverlay />
              </BrowserRouter>
              <Toaster />
            </LanguageProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>
      </BetaGate>
    </ErrorBoundary>
  );
}
export default App;
