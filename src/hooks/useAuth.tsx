import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

type AuthContextValue = {
  session: Session | null
  user: User | null
  loading: boolean
  signInWithPassword: (email: string, password: string) => Promise<string | null>
  signUpWithPassword: (email: string, password: string) => Promise<string | null>
  signInWithGitHub: () => Promise<string | null>
  signOut: () => Promise<void>
  deleteAccount: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error?.message ?? null
  }, [])

  const signUpWithPassword = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    })
    return error?.message ?? null
  }, [])

  const signInWithGitHub = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin,
      },
    })
    return error?.message ?? null
  }, [])

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return
    await supabase.auth.signOut()
  }, [])

  const deleteAccount = useCallback(async () => {
    if (!session?.user || !isSupabaseConfigured) {
      return 'Not authenticated'
    }

    try {
      // 1. Try calling the delete_user_account RPC function
      const { error: rpcError } = await supabase.rpc('delete_user_account')

      if (rpcError) {
        // Fallback: If RPC not yet installed in Supabase, delete own progress & streaks directly via RLS
        await supabase.from('progress_entries').delete().eq('user_id', session.user.id)
        await supabase.from('streak_logs').delete().eq('user_id', session.user.id)
      }

      // 2. Clear any local progress keys to ensure fresh slate
      try {
        localStorage.removeItem('traindsa_local_progress')
        localStorage.removeItem('traindsa_local_streaks')
      } catch {
        // ignore
      }

      // 3. Sign out the session
      await supabase.auth.signOut()
      return null
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete account'
      return msg
    }
  }, [session])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signInWithPassword,
      signUpWithPassword,
      signInWithGitHub,
      signOut,
      deleteAccount,
    }),
    [session, loading, signInWithPassword, signUpWithPassword, signInWithGitHub, signOut, deleteAccount],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

