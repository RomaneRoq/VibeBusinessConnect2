import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { useAuthStore } from '@/store/authStore'

// Layouts
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'

// Pages publiques
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import OnboardingPage from '@/pages/OnboardingPage'

// Pages connectées
import Dashboard from '@/pages/Dashboard'
import Participants from '@/pages/Participants'
import ParticipantDetail from '@/pages/ParticipantDetail'
import Preferences from '@/pages/Preferences'
import Agenda from '@/pages/Agenda'
import Programme from '@/pages/Programme'
import Messages from '@/pages/Messages'
import Settings from '@/pages/Settings'
import InfosPratiques from '@/pages/InfosPratiques'

// Route protégée
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// Route publique (redirige si déjà connecté)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated) {
    if (user && !user.onboardingCompleted) {
      return <Navigate to="/onboarding" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<LandingPage />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } />
        </Route>

        {/* Onboarding */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        } />

        {/* Pages connectées avec Dashboard Layout */}
        <Route element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/participants" element={<Participants />} />
          <Route path="/participants/:id" element={<ParticipantDetail />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/programme" element={<Programme />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:id" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/infos" element={<InfosPratiques />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
