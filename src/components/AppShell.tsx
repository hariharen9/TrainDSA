import { Flame, LogOut, Route } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTracker } from '../hooks/useTracker'
import { consecutiveStreak } from '../lib/progress'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-3 py-1.5 text-sm transition ${
    isActive ? 'bg-gold-dim text-gold' : 'text-muted hover:text-ink'
  }`

export function AppShell() {
  const { user, signOut } = useAuth()
  const { streakDates } = useTracker()
  const streak = consecutiveStreak(streakDates)

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-20 border-b border-line/80 bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 text-ink">
            <Route className="size-5 text-gold" />
            <span className="font-serif text-lg tracking-tight">TrainDSA</span>
          </NavLink>
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={linkClass}>
              Path
            </NavLink>
            <NavLink to="/review" className={linkClass}>
              Review
            </NavLink>
          </nav>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-line bg-panel px-2.5 py-1 text-xs text-gold">
              <Flame className="size-3.5" />
              {streak} day{streak === 1 ? '' : 's'}
            </span>
            <span className="hidden max-w-40 truncate text-xs text-muted sm:inline">
              {user?.email}
            </span>
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-full border border-line p-1.5 text-muted hover:text-ink"
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
