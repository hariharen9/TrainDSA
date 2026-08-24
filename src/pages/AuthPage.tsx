import { useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { useAuth } from '../hooks/useAuth'
import { isSupabaseConfigured } from '../lib/supabase'

type Mode = 'password' | 'magic'
type AuthKind = 'signin' | 'signup'

export function AuthPage() {
  const { session, signInWithPassword, signUpWithPassword, signInWithMagicLink } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const [mode, setMode] = useState<Mode>('password')
  const [kind, setKind] = useState<AuthKind>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!isSupabaseConfigured) return <Navigate to="/setup" replace />
  if (session) return <Navigate to={from} replace />

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setMessage(null)
    let error: string | null = null
    if (mode === 'magic') {
      error = await signInWithMagicLink(email)
      if (!error) setMessage('Check your email for the magic link.')
    } else if (kind === 'signup') {
      error = await signUpWithPassword(email, password)
      if (!error) setMessage('Account created. Confirm your email if prompted, then sign in.')
    } else {
      error = await signInWithPassword(email, password)
    }
    if (error) setMessage(error)
    setBusy(false)
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-4 py-8">
      <Logo className="size-12 mb-4" />
      <p className="text-xs uppercase tracking-[0.2em] text-gold">Linear interview prep</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">TrainDSA</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        One current topic. Concept first. Confidence over checklists. Sign in to log progress against the 17-topic path.
      </p>

      <div className="mt-8 flex gap-2">
        <Tab active={mode === 'password'} onClick={() => setMode('password')}>
          Password
        </Tab>
        <Tab active={mode === 'magic'} onClick={() => setMode('magic')}>
          Magic link
        </Tab>
      </div>

      <form onSubmit={(event) => void onSubmit(event)} className="mt-6 space-y-4 rounded-2xl border border-line bg-panel p-5">
        {mode === 'password' ? (
          <div className="flex gap-2">
            <Tab active={kind === 'signin'} onClick={() => setKind('signin')}>
              Sign in
            </Tab>
            <Tab active={kind === 'signup'} onClick={() => setKind('signup')}>
              Sign up
            </Tab>
          </div>
        ) : null}

        <label className="block space-y-1.5 text-sm">
          <span className="text-muted">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-gold/40"
          />
        </label>

        {mode === 'password' ? (
          <label className="block space-y-1.5 text-sm">
            <span className="text-muted">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-gold/40"
            />
          </label>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-gold py-2.5 text-sm font-medium text-canvas disabled:opacity-60"
        >
          {busy ? 'Working…' : mode === 'magic' ? 'Send magic link' : kind === 'signup' ? 'Create account' : 'Continue'}
        </button>
        {message ? <p className="text-sm text-gold">{message}</p> : null}
      </form>
    </div>
  )
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        active ? 'bg-gold text-canvas' : 'border border-line text-muted'
      }`}
    >
      {children}
    </button>
  )
}
