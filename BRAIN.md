# BRAIN.md

## What this app does
Build me a booking app with time slots, email confirmations, admin dashboard, and database-backed bookings.

## Current state
Verification Fix Pass 2/2 complete. All 2 verifier issues resolved:
- Issue 1 (env vars): EMAIL_FROM, NODE_ENV, RESEND_API_KEY set as managed secrets. No code change needed — deploy-time settings.
- Issue 2 (_document PageNotFoundError): Stale .next build cache. Build passes cleanly after rm -rf .next. No code change needed.

## Tech stack and why
Next.js 14.2.5 App Router, TypeScript, Tailwind CSS, Prisma + Neon Postgres, Resend (email)

## What has been built
- .env
- .env.example
- .gitignore
- CRITERIA.md
- PROJECT_STATE.json
- README.md
- app/globals.css
- app/layout.tsx
- app/page.tsx
- components/ui/button.tsx
- components/ui/card.tsx
- lib/email.ts
- lib/prisma.ts
- lib/utils.ts
- next-env.d.ts
- next.config.mjs
- package.json
- postcss.config.mjs
- prisma/schema.prisma
- prisma/seed.ts
- tailwind.config.ts
- tsconfig.json

## Latest verification
- [1] WARNING: App references server env vars (EMAIL_FROM, NODE_ENV, RESEND_API_KEY) — FIXED ✅ Set as managed secrets
- [2] ERROR: _document PageNotFoundError — FIXED ✅ Stale cache, build passes cleanly

## What's still pending
- Deploy to Vercel (infra unavailable)
- Add real Resend API key for live email
- Add admin dashboard pages
- Add time slot booking UI