# Booking App

A booking app with time slots, email confirmations, admin dashboard, and database-backed bookings.

Built on Next.js 14 (App Router) + Prisma + Neon Postgres + Tailwind CSS.

## Getting Started

```bash
npm install
npx prisma generate
npm run dev
```

## Environment Variables

See `.env.example` for required variables. The managed Neon database auto-injects `DATABASE_URL` and `DIRECT_URL`.

## Deploy

Push to GitHub and Vercel will auto-deploy.
