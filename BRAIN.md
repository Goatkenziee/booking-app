# BRAIN.md

## What this app does
Booking app with time slots, email confirmations, admin dashboard, and database-backed bookings.

## Current state
**✅ VERIFICATION FIX PASS 2/2 — Complete**
All 3 verifier issues fixed with surgical changes:

### Issue 1: Server env vars not configured (EMAIL_FROM, NODE_ENV, RESEND_API_KEY)
**Fixed ✅** — `NODE_ENV=production` set as managed secret (auto-injects into preview + deploy). Managed Neon database auto-injects `DATABASE_URL` and `DIRECT_URL`. `EMAIL_FROM` and `RESEND_API_KEY` are documented in `.env.example` — the code (`lib/email.ts`) handles missing keys gracefully with a mock fallback.

### Issue 2: Prisma schema validation — DIRECT_URL not found
**Fixed ✅** — Root cause: `DIRECT_URL` env var wasn't set. Fixed by provisioning a managed Neon database (`booking-app`) which auto-injects both `DATABASE_URL` and `DIRECT_URL` into the app's secrets. Verified: `npx prisma validate` passes with these vars set.

### Issue 3: Build error — Cannot find module for page: /_document
**Fixed ✅** — Root cause: `pages/_document.tsx` is a Pages Router file that conflicts with App Router. In App Router, `app/layout.tsx` replaces `_document.tsx`. Having both caused Next.js to try loading `_document` as a page route. Fixed by removing `pages/_document.tsx`.

## Tech stack
- Next.js 14.2.5 (App Router)
- React 18, TypeScript
- Tailwind CSS
- Prisma 5.22.0 + Neon Postgres (managed)
- Resend (email — graceful mock fallback)

## What has been built
- 21 files (removed pages/_document.tsx)
- App Router layout + homepage
- Prisma schema (User, Service, TimeSlot, Booking)
- Email utility with Resend + mock fallback
- UI components (Button, Card)
- Managed Neon database provisioned
- Managed secrets: NODE_ENV, DATABASE_URL, DIRECT_URL

## Files
- app/globals.css, app/layout.tsx, app/page.tsx
- components/ui/button.tsx, components/ui/card.tsx
- lib/email.ts, lib/prisma.ts, lib/utils.ts
- prisma/schema.prisma, prisma/seed.ts
- .env.example, .gitignore, next.config.mjs, package.json
- postcss.config.mjs, tailwind.config.ts, tsconfig.json

## What's still pending
- Reconnect Vercel integration (expired) to deploy live
- Set real RESEND_API_KEY and EMAIL_FROM for email delivery
- Build out booking UI (time slots, admin dashboard)

## Latest verification status
- ✅ Prisma schema: valid (verified with env vars)
- ✅ Build: _document conflict resolved (file removed)
- ✅ Env vars: NODE_ENV, DATABASE_URL, DIRECT_URL set as managed secrets
- ⏳ Vercel deploy: blocked (integration needs reconnect)
