import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Logo } from '../components/Logo'
import { useAuth } from '../hooks/useAuth'
import { isSupabaseConfigured } from '../lib/supabase'

type AuthKind = 'signin' | 'signup'

export function AuthPage() {
  const { session, signInWithPassword, signUpWithPassword, signInWithGitHub } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const [kind, setKind] = useState<AuthKind>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [githubBusy, setGithubBusy] = useState(false)

  if (session) return <Navigate to={from} replace />

  async function handleGitHubLogin() {
    if (!isSupabaseConfigured) {
      setMessage('Supabase is not configured yet. You can continue as Guest in local mode.')
      return
    }
    setGithubBusy(true)
    setMessage(null)
    const error = await signInWithGitHub()
    if (error) {
      setMessage(error)
      setGithubBusy(false)
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!isSupabaseConfigured) {
      setMessage('Supabase is not configured. You can continue as a Guest locally.')
      return
    }

    setBusy(true)
    setMessage(null)
    let error: string | null = null

    if (kind === 'signup') {
      error = await signUpWithPassword(email, password)
      if (!error) setMessage('Account created! Check your email if verification is required, then sign in.')
    } else {
      error = await signInWithPassword(email, password)
    }

    if (error) setMessage(error)
    setBusy(false)
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-4 py-8">
      <div className="flex items-center gap-3">
        <Logo className="size-10" />
        <div>
          <span className="font-serif text-2xl font-bold tracking-tight text-ink">TrainDSA</span>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">Interview Prep System</p>
        </div>
      </div>

      <h1 className="mt-6 font-serif text-3xl text-ink">
        {kind === 'signin' ? 'Welcome Back' : 'Create Account'}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Sign in to sync your progress across devices, or continue as a guest to store everything in your browser.
      </p>

      {/* GitHub OAuth Button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => void handleGitHubLogin()}
          disabled={githubBusy || busy}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-line bg-panel py-3 text-sm font-semibold text-ink shadow-xs transition hover:border-gold/40 hover:bg-panel-2 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          <svg className="size-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span>{githubBusy ? 'Redirecting to GitHub…' : 'Continue with GitHub'}</span>
        </button>
      </div>

      <div className="relative my-6 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-line" />
        </div>
        <span className="relative bg-canvas px-3 text-xs uppercase tracking-wider text-muted">
          Or with email
        </span>
      </div>

      {/* Auth Card */}
      <div className="space-y-4 rounded-2xl border border-line bg-panel p-5 shadow-xs">
        {/* Toggle Tabs */}
        <div className="flex gap-2 rounded-xl bg-canvas p-1 border border-line">
          <button
            type="button"
            onClick={() => setKind('signin')}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition cursor-pointer ${
              kind === 'signin' ? 'bg-panel text-ink shadow-xs' : 'text-muted hover:text-ink'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setKind('signup')}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition cursor-pointer ${
              kind === 'signup' ? 'bg-panel text-ink shadow-xs' : 'text-muted hover:text-ink'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={(event) => void onSubmit(event)} className="space-y-3.5">
          <label className="block space-y-1.5 text-sm">
            <span className="text-xs font-medium text-muted">Email address</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
            />
          </label>

          <label className="block space-y-1.5 text-sm">
            <span className="text-xs font-medium text-muted">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
            />
          </label>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-gold py-2.5 text-sm font-semibold text-canvas shadow-xs transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {busy ? 'Please wait…' : kind === 'signup' ? 'Create Account' : 'Sign In'}
          </button>

          {message && (
            <p className="rounded-xl border border-gold/40 bg-gold-dim px-3 py-2 text-xs text-gold">
              {message}
            </p>
          )}
        </form>
      </div>

      {/* Guest Mode Skip Link */}
      <div className="mt-6 text-center">
        <Link
          to={from}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-gold"
        >
          <Sparkles className="size-3.5 text-gold" />
          <span>Skip sign in and Continue as Guest (Offline)</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}

