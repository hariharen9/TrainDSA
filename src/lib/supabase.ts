import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(
  url &&
    publishableKey &&
    !url.includes('your-project') &&
    !publishableKey.includes('your-publishable-key'),
)

export const supabase = createClient<Database>(
  url || 'https://placeholder.supabase.co',
  publishableKey || 'placeholder',
  {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
      autoRefreshToken: true,
    },
  },
)
