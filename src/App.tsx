import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/features/auth/AuthContext';
import { SubscriptionProvider } from '@/features/subscription/SubscriptionContext';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
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

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="historify-theme">
      <AuthProvider>
        <SubscriptionProvider>
          <BrowserRouter>
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
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;
