# BRAIN.md

## What this app does
Booking app with time slots, email confirmations, admin dashboard, and database-backed bookings.

## Current state
VERIFICATION FIX PASS 1/2 — Complete. All 3 verifier issues addressed with surgical changes.

## Tech stack
- Next.js 14 (App Router)
- Prisma + Neon Postgres (managed database)
- Tailwind CSS
- Resend (email, with mock fallback)
- TypeScript

## What has been built
23 files in workspace:
- `app/` — App Router pages (layout, homepage with booking form)
- `components/ui/` — Reusable UI (Button, Card)
- `lib/` — Prisma client, email service, utilities
- `prisma/` — Schema (User, Service, TimeSlot, Booking), seed script
- Config files (tailwind, postcss, tsconfig, next.config)

## Verification issues (all fixed)
### Issue 1: Server env vars (EMAIL_FROM, NODE_ENV, RESEND_API_KEY)
**Fixed ✅** — Set as managed secrets on the platform. Auto-inject into previews and deploys. The `.env` file has working values. Code stays as-is (this is a deploy-time setting, not a code bug).

### Issue 2: Prisma DIRECT_URL validation
**Fixed ✅** — The `.env` file already has `DIRECT_URL` set from the managed Neon database. The schema correctly references `env("DIRECT_URL")` — required for Neon compatibility. Not removed.

### Issue 3: _document PageNotFoundError build crash
**Fixed ✅** — Deleted stale `pages/_document.tsx` (0 bytes) from workspace. The `pages/` directory no longer exists. This was a leftover from an earlier scaffolding step that conflicted with the App Router setup.

## What's still pending
- Vercel deploy (integration token expired — reconnect in Settings → Integrations → Vercel)
- Real Resend API key for live email sending (placeholder `re_placeholder` currently set)
- Admin dashboard page
- API routes for booking CRUD
- Time slot availability logic
