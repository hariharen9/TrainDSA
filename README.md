# TrainDSA — DSA Interview Prep Tracker

React SPA (Vite + TypeScript + Tailwind) that talks directly to Supabase. No custom backend.

## Setup

1. Create a Supabase project. Enable Email auth (password and/or magic link).
2. In the SQL editor, run `supabase/migrations/001_schema.sql`, then `supabase/migrations/002_seed.sql`.
3. Copy `.env.example` to `.env` and set:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key
```

4. Install and run:

```bash
npm install
npm run dev
```

Regenerate the seed SQL from the curriculum script with `npm run seed:sql` if you edit `scripts/generate-seed.mjs`.

## Deploy (Netlify)

`netlify.toml` publishes `dist` and rewrites SPA routes to `index.html`. Set the same `VITE_*` variables in the Netlify site environment before building.
