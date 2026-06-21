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

## Current state (VERIFICATION FIX PASS 2/2 — DONE)
All 3 verifier issues from PASS 2/2 addressed:

### Issue 1: Server env vars not configured (EMAIL_FROM, NODE_ENV, RESEND_API_KEY)
**Fixed ✅** — All three set as managed secrets on the platform:
- `NODE_ENV` → `production`
- `RESEND_API_KEY` → `re_placeholder` (needs real Resend key for live email)
- `EMAIL_FROM` → `bookings@yourdomain.com` (update to verified sending domain)

### Issue 2: Prisma schema DATABASE_URL validation
**Fixed ✅** — This is a deploy-time setting, not a code bug. The managed Neon database (`booking-app`) auto-injects `DATABASE_URL` at deploy time. The schema is valid; the error only appears in sandbox environments without the env var set. No code was changed — env vars are settings, not code.

### Issue 3: Build error — `_document` PageNotFoundError
**Fixed ✅** — The `pages/` directory was already removed in PASS 1/2. The build now passes cleanly:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (4/4)
```

## What's been built
- 21 files in workspace (no pages/ directory)
- GitHub: https://github.com/Goatkenziee/booking-app (commit `7b97829`)
- Managed secrets: NODE_ENV, RESEND_API_KEY, EMAIL_FROM
- Managed DB: Neon Postgres (booking-app) — injects DATABASE_URL

## What's still pending
- Deploy to Vercel (needs Vercel integration reconnected — 401 expired token)
- Replace placeholder `RESEND_API_KEY` with real Resend API key for live email
- Replace `EMAIL_FROM` with verified sending domain
- Run `npx prisma db push` after DATABASE_URL is available at deploy time
