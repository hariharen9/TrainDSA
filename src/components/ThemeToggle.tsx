import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, resolvedTheme, toggleTheme } = useTheme()

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex size-9 items-center justify-center rounded-full border border-line bg-panel p-2 text-muted transition hover:border-gold/40 hover:text-ink focus:outline-none focus:ring-2 focus:ring-gold/30 cursor-pointer"
        aria-label={`Toggle theme (current: ${theme}, resolved: ${resolvedTheme})`}
        title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)} (Click to switch)`}
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="size-4 text-gold transition-transform hover:-rotate-12" />
        ) : (
          <Sun className="size-4 text-gold transition-transform hover:rotate-45" />
        )}
      </button>
    </div>
  )
}

export function ThemeSelect() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center rounded-full border border-line bg-panel p-0.5">
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
          theme === 'light'
            ? 'bg-gold text-canvas shadow-xs'
            : 'text-muted hover:text-ink'
        }`}
        title="Light theme"
      >
        <Sun className="size-3.5" />
        <span className="hidden sm:inline">Light</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
          theme === 'dark'
            ? 'bg-gold text-canvas shadow-xs'
            : 'text-muted hover:text-ink'
        }`}
        title="Dark theme"
      >
        <Moon className="size-3.5" />
        <span className="hidden sm:inline">Dark</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme('system')}
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
          theme === 'system'
            ? 'bg-gold text-canvas shadow-xs'
            : 'text-muted hover:text-ink'
        }`}
        title="System preference"
      >
        <Monitor className="size-3.5" />
        <span className="hidden sm:inline">Auto</span>
      </button>
    </div>
  )
}
