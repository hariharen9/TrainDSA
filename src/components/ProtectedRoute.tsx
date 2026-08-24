import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { isSupabaseConfigured } from '../lib/supabase'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (!isSupabaseConfigured) return <Navigate to="/setup" replace />
  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted">
        Restoring session…
      </div>
    )
  }
  if (!session) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  }
  return children
}
