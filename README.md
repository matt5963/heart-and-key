# Heart & Key — Deployable Web App

This is a Vite + React + Tailwind app using Supabase as the free shared database.

## What is included

- `src/App.jsx` — the Heart & Key app
- `src/storage.js` — Supabase replacement for `window.storage`
- `src/main.jsx` — app entry point
- `src/index.css` — Tailwind CSS entry
- `supabase-schema.sql` — database table creation script
- `.env.example` — required environment variables

## Free hosting stack

- Vercel Free for the website
- Supabase Free for shared data

## Supabase setup

1. Create a free Supabase project.
2. Open SQL Editor.
3. Paste and run the contents of `supabase-schema.sql`.
4. Go to Project Settings > API.
5. Copy:
   - Project URL
   - anon public key

## Local setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:

```bash
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-SUPABASE-ANON-KEY
```

Run locally:

```bash
npm run dev
```

## Vercel deployment

1. Push this folder to a private GitHub repo.
2. Go to Vercel and import the repo.
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy.
5. Send the Vercel link to your wife.

## How you both use it

1. She opens the link.
2. She enters the shared pair code.
3. She chooses Keyholder.
4. She completes setup.
5. You open the same link later.
6. You enter the same pair code and choose Kept.
7. Both sides read/write the same shared data record.

## Privacy note

This simple version uses a shared pair code and a private/non-public URL. It is not designed for high-security storage. Do not put anything in it you would not want stored as plaintext in your Supabase database.
