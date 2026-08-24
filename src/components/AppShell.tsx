import { Flame, ListRestart, LogOut, Route } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { useAuth } from '../hooks/useAuth'
import { useTracker } from '../hooks/useTracker'
import { consecutiveStreak } from '../lib/progress'

const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
    isActive
      ? 'bg-gold-dim text-gold font-semibold'
      : 'text-muted hover:text-ink hover:bg-panel-2/60'
  }`

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition ${
    isActive ? 'text-gold font-semibold' : 'text-muted hover:text-ink'
  }`

export function AppShell() {
  const { user, signOut } = useAuth()
  const { streakDates, reviewEntries } = useTracker()
  const streak = consecutiveStreak(streakDates)
  const reviewCount = reviewEntries.length

  return (
    <div className="flex min-h-svh flex-col bg-canvas text-ink transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-line/80 bg-canvas/85 backdrop-blur-md safe-top">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3 sm:gap-4">
          <div className="flex items-center gap-4">
            <NavLink to="/" className="flex items-center gap-2.5 text-ink transition-opacity hover:opacity-90">
              <Logo className="size-8.5" />
              <div className="flex flex-col">
                <span className="font-serif text-lg font-semibold tracking-tight leading-tight">TrainDSA</span>
                <span className="text-[10px] uppercase tracking-wider text-muted hidden sm:inline">Interview Prep</span>
              </div>
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex items-center gap-1.5 ml-4">
              <NavLink to="/" end className={desktopLinkClass}>
                <Route className="size-4" />
                <span>Path</span>
              </NavLink>
              <NavLink to="/review" className={desktopLinkClass}>
                <ListRestart className="size-4" />
                <span>Review</span>
                {reviewCount > 0 && (
                  <span className="ml-1 inline-flex size-4.5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-canvas">
                    {reviewCount}
                  </span>
                )}
              </NavLink>
            </nav>
          </div>

          {/* Right utility actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-3 py-1 text-xs font-medium text-gold shadow-xs">
              <Flame className="size-3.5 fill-gold/20 text-gold animate-pulse" />
              <span>{streak} <span className="hidden sm:inline">day{streak === 1 ? '' : 's'}</span></span>
            </div>

            <ThemeToggle />

            {user?.email && (
              <span className="hidden max-w-32 truncate text-xs text-muted md:inline lg:max-w-48">
                {user.email}
              </span>
            )}

            <button
              type="button"
              onClick={() => void signOut()}
              className="inline-flex size-9 items-center justify-center rounded-full border border-line bg-panel p-2 text-muted transition hover:border-hard/40 hover:text-hard focus:outline-none focus:ring-2 focus:ring-hard/30 cursor-pointer"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-8 safe-pb-nav sm:safe-bottom">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar (<640px) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex sm:hidden border-t border-line/80 bg-panel/95 backdrop-blur-lg safe-bottom px-2 py-1 shadow-lg">
        <NavLink to="/" end className={mobileLinkClass}>
          {({ isActive }) => (
            <>
              <div className={`flex size-7 items-center justify-center rounded-full transition ${isActive ? 'bg-gold/20' : ''}`}>
                <Route className="size-4" />
              </div>
              <span>Path</span>
            </>
          )}
        </NavLink>

        <NavLink to="/review" className={mobileLinkClass}>
          {({ isActive }) => (
            <>
              <div className={`relative flex size-7 items-center justify-center rounded-full transition ${isActive ? 'bg-gold/20' : ''}`}>
                <ListRestart className="size-4" />
                {reviewCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 flex size-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-canvas">
                    {reviewCount}
                  </span>
                )}
              </div>
              <span>Review Queue</span>
            </>
          )}
        </NavLink>
      </nav>
    </div>
  )
}
