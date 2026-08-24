import { Logo } from '../components/Logo'

export function SetupPage() {
  return (
    <div className="mx-auto flex min-h-svh max-w-xl flex-col justify-center px-4 py-8">
      <Logo className="size-12 mb-4" />
      <p className="text-xs uppercase tracking-[0.2em] text-gold">Configuration required</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Connect Supabase</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Copy <code className="text-gold">.env.example</code> to <code className="text-gold">.env</code>, paste your
        project URL and publishable key, then run the SQL in <code className="text-gold">supabase/migrations</code> against
        the Supabase SQL editor (schema first, then seed).
      </p>
      <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-ink/90">
        <li>Create a Supabase project and enable Email auth.</li>
        <li>Apply <code className="text-gold">001_schema.sql</code> then <code className="text-gold">002_seed.sql</code>.</li>
        <li>Set <code className="text-gold">VITE_SUPABASE_URL</code> and <code className="text-gold">VITE_SUPABASE_PUBLISHABLE_KEY</code>.</li>
        <li>Restart the Vite dev server.</li>
      </ol>
    </div>
  )
}
