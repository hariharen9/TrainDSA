import { useState, useEffect, useRef } from 'react'
import {
  Brain,
  ChevronDown,
  Flame,
  ListRestart,
  LogIn,
  LogOut,
  Route,
  Search,
  Server,
  Settings,
  User,
  Zap,
} from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Logo } from './Logo'
import { SearchModal } from './SearchModal'
import { ThemeToggle } from './ThemeToggle'
import { useAuth } from '../hooks/useAuth'
import { useTracker } from '../hooks/useTracker'
import { consecutiveStreak } from '../lib/progress'

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium whitespace-nowrap transition ${
    isActive ? 'text-gold font-semibold' : 'text-muted hover:text-ink'
  }`

const desktopNavClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
    isActive
      ? 'bg-gold text-canvas font-semibold shadow-xs'
      : 'text-muted hover:text-ink hover:bg-panel/50'
  }`

export function AppShell() {
  const { user, signOut } = useAuth()
  const { streakDates, reviewEntries } = useTracker()
  const [searchOpen, setSearchOpen] = useState(false)
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
      <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/80 backdrop-blur-md backdrop-saturate-125 shadow-xs safe-top transition-colors">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Left: Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <NavLink to="/" className="flex items-center gap-2.5 text-ink transition-opacity hover:opacity-90">
              <Logo className="size-8 shrink-0" />
              <span className="font-serif text-xl font-bold tracking-tight">TrainDSA</span>
            </NavLink>
          </div>

          {/* Center: Segmented Pill Navigation */}
          <nav className="hidden md:flex items-center rounded-full border border-line/70 bg-panel/60 backdrop-blur-md p-1 shadow-xs gap-0.5">
            <NavLink to="/" end className={desktopNavClass}>
              <Route className="size-3.5 shrink-0" />
              <span>Path</span>
            </NavLink>

            <NavLink to="/blind75" className={desktopNavClass}>
              <Zap className="size-3.5 shrink-0" />
              <span>Blind 75</span>
            </NavLink>

            <NavLink to="/behavioral" className={desktopNavClass}>
              <Brain className="size-3.5 shrink-0" />
              <span>Behavioral</span>
            </NavLink>

            <NavLink to="/system-design" className={desktopNavClass}>
              <Server className="size-3.5 shrink-0" />
              <span className="hidden lg:inline">System Design</span>
              <span className="lg:hidden">SD</span>
            </NavLink>

            <NavLink to="/review" className={desktopNavClass}>
              {({ isActive }) => (
                <>
                  <ListRestart className="size-3.5 shrink-0" />
                  <span>Review</span>
                  {reviewCount > 0 && (
                    <span
                      className={`inline-flex size-4 items-center justify-center rounded-full text-[9px] font-bold ${
                        isActive ? 'bg-canvas text-gold' : 'bg-gold text-canvas'
                      }`}
                    >
                      {reviewCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          </nav>

          {/* Right: Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-9 items-center gap-2 rounded-full border border-line/70 bg-panel/60 backdrop-blur-sm px-3 text-xs text-muted hover:border-gold/40 hover:text-ink transition cursor-pointer shadow-xs"
              title="Search problems & topics (Ctrl+K / ⌘K)"
            >
              <Search className="size-3.5 text-gold shrink-0" />
              <span className="hidden lg:inline">Search</span>
              <kbd className="hidden sm:inline-block rounded border border-line bg-panel-2 px-1 text-[10px] font-mono text-muted">
                ⌘K
              </kbd>
            </button>

            {/* Streak Counter */}
            <div className="flex h-9 items-center gap-1.5 rounded-full border border-line/70 bg-panel/60 backdrop-blur-sm px-3 text-xs font-medium text-gold shadow-xs">
              <Flame className="size-3.5 fill-gold/20 text-gold animate-pulse shrink-0" />
              <span>
                {streak} <span className="hidden sm:inline">day{streak === 1 ? '' : 's'}</span>
              </span>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Account / Profile Dropdown */}
            {user ? (
              <UserMenu email={user.email ?? ''} onSignOut={signOut} />
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/auth"
                  className="flex h-9 items-center gap-1.5 rounded-full bg-gold px-3.5 text-xs font-semibold text-canvas shadow-xs transition hover:opacity-90 active:scale-95"
                >
                  <LogIn className="size-3.5" />
                  <span>Sign In</span>
                </Link>

                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `inline-flex size-9 shrink-0 items-center justify-center rounded-full border transition cursor-pointer ${
                      isActive
                        ? 'border-gold text-gold bg-gold-dim shadow-xs'
                        : 'border-line/70 bg-panel/60 text-muted hover:border-gold/40 hover:text-ink'
                    }`
                  }
                  title="Settings & Data Management"
                  aria-label="Settings"
                >
                  <Settings className="size-4" />
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 lg:px-8 pt-6 pb-36 sm:py-10 sm:pb-16 safe-pb-nav md:safe-bottom">
        <Outlet />
      </main>

      {/* Mobile Floating Bottom Navigation Bar (<640px) — 5 items */}
      <nav className="fixed inset-x-2 bottom-3 z-50 pointer-events-auto flex sm:hidden rounded-2xl border border-line/80 bg-panel/85 backdrop-blur-lg backdrop-saturate-150 shadow-xl px-1 py-1 safe-bottom">
        <NavLink to="/" end className={mobileLinkClass}>
          {({ isActive }) => (
            <>
              <div className={`flex size-6 items-center justify-center rounded-full transition ${isActive ? 'bg-gold/20 text-gold' : ''}`}>
                <Route className="size-3.5" />
              </div>
              <span>Path</span>
            </>
          )}
        </NavLink>

        <NavLink to="/behavioral" className={mobileLinkClass}>
          {({ isActive }) => (
            <>
              <div className={`flex size-6 items-center justify-center rounded-full transition ${isActive ? 'bg-gold/20 text-gold' : ''}`}>
                <Brain className="size-3.5" />
              </div>
              <span>Behavioral</span>
            </>
          )}
        </NavLink>

        <NavLink to="/review" className={mobileLinkClass}>
          {({ isActive }) => (
            <>
              <div className={`relative flex size-6 items-center justify-center rounded-full transition ${isActive ? 'bg-gold/20 text-gold' : ''}`}>
                <ListRestart className="size-3.5" />
                {reviewCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 flex size-3.5 items-center justify-center rounded-full bg-gold text-[8px] font-bold text-canvas shadow-xs">
                    {reviewCount}
                  </span>
                )}
              </div>
              <span>Review</span>
            </>
          )}
        </NavLink>

        <NavLink to="/system-design" className={mobileLinkClass}>
          {({ isActive }) => (
            <>
              <div className={`flex size-6 items-center justify-center rounded-full transition ${isActive ? 'bg-gold/20 text-gold' : ''}`}>
                <Server className="size-3.5" />
              </div>
              <span>Design</span>
            </>
          )}
        </NavLink>

        <NavLink to="/settings" className={mobileLinkClass}>
          {({ isActive }) => (
            <>
              <div className={`flex size-6 items-center justify-center rounded-full transition ${isActive ? 'bg-gold/20 text-gold' : ''}`}>
                <Settings className="size-3.5" />
              </div>
              <span>Settings</span>
            </>
          )}
        </NavLink>
      </nav>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}

function UserMenu({ email, onSignOut }: { email: string; onSignOut: () => Promise<void> }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const username = email.split('@')[0] || 'Account'

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 items-center gap-2 rounded-full border border-line/70 bg-panel/60 backdrop-blur-sm pl-2 pr-3 text-xs font-medium text-ink transition hover:border-gold/40 shadow-xs cursor-pointer"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div className="flex size-6 items-center justify-center rounded-full bg-gold-dim border border-gold/30 text-gold">
          <User className="size-3.5" />
        </div>
        <span className="hidden sm:inline max-w-28 truncate">{username}</span>
        <ChevronDown
          className={`size-3.5 text-muted transition-transform duration-200 ${
            open ? 'rotate-180 text-gold' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-line/80 bg-panel/90 backdrop-blur-md p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 border-b border-line/60">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Signed In As</p>
            <p className="text-xs font-medium text-ink truncate mt-0.5" title={email}>
              {email}
            </p>
          </div>

          <div className="py-1 space-y-0.5">
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-ink hover:bg-panel-2 hover:text-gold transition"
            >
              <Settings className="size-3.5 text-muted" />
              <span>Settings & Backups</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setOpen(false)
                void onSignOut()
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-hard hover:bg-hard/10 transition cursor-pointer"
            >
              <LogOut className="size-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}




