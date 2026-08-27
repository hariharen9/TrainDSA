import { useState, useEffect } from 'react'
import { Compass, Flame, ListRestart, LogOut, Route, Search, Zap } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { Logo } from './Logo'
import { SearchModal } from './SearchModal'
import { ThemeToggle } from './ThemeToggle'
import { WhyCurriculumModal } from './WhyCurriculumModal'
import { useAuth } from '../hooks/useAuth'
import { useTracker } from '../hooks/useTracker'
import { consecutiveStreak } from '../lib/progress'

const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs lg:text-sm font-medium whitespace-nowrap shrink-0 transition ${
    isActive
      ? 'bg-gold-dim text-gold font-semibold shadow-xs'
      : 'text-muted hover:text-ink hover:bg-panel-2/60'
  }`

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium whitespace-nowrap transition ${
    isActive ? 'text-gold font-semibold' : 'text-muted hover:text-ink'
  }`

export function AppShell() {
  const { user, signOut } = useAuth()
  const { streakDates, reviewEntries } = useTracker()
  const [searchOpen, setSearchOpen] = useState(false)
  const [whyModalOpen, setWhyModalOpen] = useState(false)
  const streak = consecutiveStreak(streakDates)
  const reviewCount = reviewEntries.length

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="flex min-h-svh flex-col bg-canvas text-ink transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-line/80 bg-canvas/90 backdrop-blur-md safe-top">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 shrink-0">
            <NavLink to="/" className="flex items-center gap-3 text-ink transition-opacity hover:opacity-90 shrink-0">
              <Logo className="size-8 sm:size-9 shrink-0" />
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight leading-none whitespace-nowrap">TrainDSA</span>
                <span className="text-[10px] uppercase tracking-widest text-muted hidden sm:inline whitespace-nowrap mt-0.5">Interview Prep</span>
              </div>
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 shrink-0">
              <NavLink to="/" end className={desktopLinkClass}>
                <Route className="size-4 shrink-0" />
                <span>Path</span>
              </NavLink>
              <NavLink to="/blind75" className={desktopLinkClass}>
                <Zap className="size-4 shrink-0" />
                <span>Blind 75</span>
              </NavLink>
              <NavLink to="/review" className={desktopLinkClass}>
                <ListRestart className="size-4 shrink-0" />
                <span>Review</span>
                {reviewCount > 0 && (
                  <span className="ml-1 inline-flex size-4.5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-canvas">
                    {reviewCount}
                  </span>
                )}
              </NavLink>
              <button
                type="button"
                onClick={() => setWhyModalOpen(true)}
                className="relative flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs lg:text-sm font-medium whitespace-nowrap shrink-0 transition text-muted hover:text-ink hover:bg-panel-2/60 cursor-pointer"
                title="Why 17 Topics & 119 Problems Cover 99% of DSA Rounds"
              >
                <Compass className="size-4 text-gold shrink-0" />
                <span>Why 17?</span>
              </button>
            </nav>
          </div>

          {/* Right Actions: Search, Streak, Theme, Sign Out */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Quick Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-full border border-line bg-panel px-3 sm:px-3.5 py-1.5 text-xs text-muted hover:border-gold/40 hover:text-ink transition cursor-pointer shadow-xs whitespace-nowrap shrink-0"
              title="Search problems & topics (Ctrl+K / ⌘K)"
            >
              <Search className="size-3.5 text-gold shrink-0" />
              <span className="hidden md:inline whitespace-nowrap">Search…</span>
              <kbd className="hidden sm:inline-block rounded border border-line bg-panel-2 px-1.5 py-0.5 text-[10px] font-mono text-muted whitespace-nowrap">
                ⌘K
              </kbd>
            </button>

            {/* Streak Counter */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-3 sm:px-3.5 py-1.5 text-xs font-medium text-gold shadow-xs whitespace-nowrap shrink-0">
              <Flame className="size-3.5 fill-gold/20 text-gold animate-pulse shrink-0" />
              <span className="whitespace-nowrap">{streak} <span className="hidden sm:inline">day{streak === 1 ? '' : 's'}</span></span>
            </div>

            <ThemeToggle />

            {user?.email && (
              <span className="hidden xl:inline max-w-36 truncate text-xs text-muted">
                {user.email}
              </span>
            )}

            <button
              type="button"
              onClick={() => void signOut()}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-panel p-2 text-muted transition hover:border-hard/40 hover:text-hard focus:outline-none focus:ring-2 focus:ring-hard/30 cursor-pointer"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-10 safe-pb-nav md:safe-bottom">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar (<640px) */}
      <nav className="fixed inset-x-0 bottom-0 z-50 pointer-events-auto flex sm:hidden border-t border-line/80 bg-panel/95 backdrop-blur-lg safe-bottom px-2 py-1 shadow-2xl">
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

        <NavLink to="/blind75" className={mobileLinkClass}>
          {({ isActive }) => (
            <>
              <div className={`flex size-7 items-center justify-center rounded-full transition ${isActive ? 'bg-gold/20' : ''}`}>
                <Zap className="size-4" />
              </div>
              <span>Blind 75</span>
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
              <span>Review</span>
            </>
          )}
        </NavLink>

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className={mobileLinkClass({ isActive: false })}
        >
          <div className="flex size-7 items-center justify-center rounded-full">
            <Search className="size-4 text-muted" />
          </div>
          <span>Search</span>
        </button>
      </nav>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Why 17 Topics Modal */}
      <WhyCurriculumModal isOpen={whyModalOpen} onClose={() => setWhyModalOpen(false)} />
    </div>
  )
}
