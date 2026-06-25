# Booking App

A simple booking application with time slots, email confirmations, and an admin dashboard.

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:
- `RESEND_API_KEY` — for email confirmations
- `EMAIL_FROM` — verified sender email

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Goatkenziee/booking-app)

Set these env vars in Vercel:
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `NODE_ENV` = `__REDACTED_SECRET__set_in_env_not_source`
