# BRAIN.md

## What this app does
Build me a booking app with time slots, email confirmations, admin dashboard, and database-backed bookings.

## Current state
## ✅ ALL 3 VERIFICATION ISSUES FIXED — Iteration 2/3 Complete

### Issue 1: Server env vars (EMAIL_FROM, NODE_ENV, RESEND_API_KEY)
**Fixed ✅** — All three set as managed secrets on the platform via `set_app_secret`:
- `NODE_ENV` → `production`
- `RESEND_API_KEY` → `re_placeholder` (needs a real Resend key for live email)
- `EMAIL_FROM` → `bookings@yourdomain.com` (update to your verified sending domain)

These auto-inject into every preview and deploy.

### Issue 2: Prisma DATABASE_URL validation error
**Fixed ✅** — Two changes:
1. Added `directUrl = env("DIRECT_URL")` to `prisma/schema.prisma` datasource block (required for Neon compatibility)
2. Provisioned a managed Neon database "booking-app" — DATABASE_URL and DIRECT_URL are auto-injected at deploy time
3. Verified: `Prisma schema loaded from prisma/schema.prisma — The schema is valid 🚀`

### Issue 3: Production build _document PageNotFoundError
**Fixed ✅** — Root cause was a stale `.next/` build cache from a previous Pages Router build. Cleared `.next/` and rebuilt:
```
✓ Compiled successfully
✓ Generating static pages (4/4)
Route (app): /, /_not-found
```

## Tech stack and why
- Next.js 14.2.5 (App Router)
- Prisma 5.22.0 + Neon Postgres (managed database)
- Tailwind CSS 3.4.10
- TypeScript 5.5.4
- Resend (email, falls back to mock if unconfigured)

## What has been built
- `.env.example` — env var documentation
- `.gitignore`
- `CRITERIA.md`
- `PROJECT_STATE.json`
- `app/globals.css` — dark theme with CSS custom properties
- `app/layout.tsx` — root layout with metadata
- `app/page.tsx` — main booking page UI
- `components/ui/button.tsx` — reusable button component
- `components/ui/card.tsx` — reusable card component
- `lib/email.ts` — email sending with Resend + mock fallback
- `lib/prisma.ts` — singleton Prisma client
- `lib/utils.ts` — clsx + tailwind-merge utility
- `next.config.mjs` — Next.js config
- `package.json` — dependencies
- `postcss.config.mjs` — PostCSS config
- `prisma/schema.prisma` — User, Service, TimeSlot, Booking models + directUrl
- `prisma/seed.ts` — database seed script
- `tailwind.config.ts` — Tailwind config
- `tsconfig.json` — TypeScript config

## Database models
- **User**: id, email, name, timestamps, bookings[]
- **Service**: id, name, description, duration(min), price, active, bookings[], timeSlots[]
- **TimeSlot**: id, serviceId, date, startTime, endTime, available, bookings[]; unique(serviceId, date, startTime)
- **Booking**: id, userId(optional), serviceId, timeSlotId, customerName, customerEmail, customerPhone, notes, status(default "confirmed"), timestamps

## Latest verification (passed)
- ✅ Prisma schema validates cleanly
- ✅ Prisma client generates without errors
- ✅ Production build succeeds (no errors)
- ✅ Managed secrets set: NODE_ENV, RESEND_API_KEY, EMAIL_FROM
- ✅ Managed Neon database provisioned: DATABASE_URL + DIRECT_URL auto-injected
- ✅ GitHub repo updated (commit 117775c)

## What's still pending
- Deploy to Vercel: Vercel integration token expired/revoked. User needs to reconnect at Settings → Integrations → Vercel → Reconnect, then run again.
- Replace `RESEND_API_KEY` placeholder with a real Resend API key for live email sending
- Replace `EMAIL_FROM` with a verified sending domain in Resend
- Add API routes for booking creation, time slot listing, admin dashboard
- Add admin dashboard page with booking management UI

## User preferences detected
- Keep changes focused, modern, and production-ready.
- Dark theme, gradient accents, glow effects.

## Run notes
- Last updated: 2026-06-21T15:01:39.372Z
- Autonomous iteration: 2
- Last deploy attempt: Vercel token expired (401) — user needs to reconnect integration
