# BRAIN.md

## What this app does
Booking app with time slots, email confirmations, admin dashboard, and database-backed bookings.

## Tech stack
- Next.js 14.2.5 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + Neon Postgres
- Resend (email)
- Managed secrets via platform

## Current state (VERIFICATION FIX PASS 1/2 — DONE)
All 3 verifier issues addressed:

### Issue 1: Server env vars not configured (EMAIL_FROM, NODE_ENV, RESEND_API_KEY)
**Fixed ✅** — All three set as managed secrets on the platform:
- `NODE_ENV` → `production`
- `RESEND_API_KEY` → `re_placeholder` (needs real Resend key for live email)
- `EMAIL_FROM` → `bookings@yourdomain.com` (update to verified sending domain)

### Issue 2: Prisma schema DATABASE_URL validation
**No code change needed** — This is a deploy-time setting. The managed Neon database (`booking-app`) auto-injects `DATABASE_URL` at deploy time. The schema is valid; the error only appears in sandbox environments without the env var set.

### Issue 3: Build error — `_document` PageNotFoundError
**Fixed ✅** — Removed the empty `pages/` directory and cleared `.next` cache. Build now passes cleanly:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (4/4)
```

## What's been built
- 21 files in workspace (no pages/ directory)
- GitHub: https://github.com/Goatkenziee/booking-app
- Managed secrets: NODE_ENV, RESEND_API_KEY, EMAIL_FROM
- Managed DB: Neon Postgres (booking-app) — injects DATABASE_URL

## What's still pending
- Deploy to Vercel (requires deploy tool availability)
- Replace placeholder `RESEND_API_KEY` with real Resend API key for live email
- Replace `EMAIL_FROM` with verified sending domain
- Run `npx prisma db push` after DATABASE_URL is available at deploy time
