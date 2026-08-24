import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './hooks/useAuth'
import { ThemeProvider } from './hooks/useTheme'
import { TrackerProvider } from './hooks/useTracker'
import { AuthPage } from './pages/AuthPage'
import { CheatSheetPage } from './pages/CheatSheetPage'
import { DashboardPage } from './pages/DashboardPage'
import { ReviewPage } from './pages/ReviewPage'
import { SetupPage } from './pages/SetupPage'
import { TopicPage } from './pages/TopicPage'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              element={
                <TrackerProvider>
                  <AppShell />
                </TrackerProvider>
              }
            >
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/topic/:topicId"
                element={
                  <ProtectedRoute>
                    <TopicPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/review"
                element={
                  <ProtectedRoute>
                    <ReviewPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/cheatsheet" element={<CheatSheetPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
