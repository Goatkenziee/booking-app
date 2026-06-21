import { prisma } from "./prisma";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email using Resend if configured, otherwise log to console.
 * Falls back gracefully so the app works without email setup.
 */
export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === "re_placeholder") {
    console.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
    console.log(`[EMAIL MOCK] Body: ${html.slice(0, 200)}...`);
    return { id: "mock-" + Date.now() };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "bookings@yourdomain.com",
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[EMAIL ERROR]", err);
    throw new Error(`Failed to send email: ${err}`);
  }

  return res.json();
}

/**
 * Send a booking confirmation email.
 */
export async function sendBookingConfirmation({
  customerEmail,
  customerName,
  serviceName,
  date,
  time,
}: {
  customerEmail: string;
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
}) {
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #6c5ce7;">Booking Confirmed! 🎉</h1>
      <p>Hi <strong>${customerName}</strong>,</p>
      <p>Your booking has been confirmed.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr><td style="padding: 8px; color: #888;">Service</td><td style="padding: 8px;"><strong>${serviceName}</strong></td></tr>
        <tr><td style="padding: 8px; color: #888;">Date</td><td style="padding: 8px;"><strong>${date}</strong></td></tr>
        <tr><td style="padding: 8px; color: #888;">Time</td><td style="padding: 8px;"><strong>${time}</strong></td></tr>
      </table>
      <p style="color: #888; font-size: 14px;">Need to reschedule? Contact us.</p>
    </div>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `Booking Confirmed — ${serviceName}`,
    html,
  });
}

/**
 * Send an admin notification for a new booking.
 */
export async function sendAdminNotification({
  customerName,
  customerEmail,
  serviceName,
  date,
  time,
}: {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  date: string;
  time: string;
}) {
  const adminEmail = process.env.EMAIL_FROM || "admin@yourdomain.com";

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #6c5ce7;">New Booking! 📅</h1>
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr><td style="padding: 8px; color: #888;">Customer</td><td style="padding: 8px;"><strong>${customerName}</strong></td></tr>
        <tr><td style="padding: 8px; color: #888;">Email</td><td style="padding: 8px;"><strong>${customerEmail}</strong></td></tr>
        <tr><td style="padding: 8px; color: #888;">Service</td><td style="padding: 8px;"><strong>${serviceName}</strong></td></tr>
        <tr><td style="padding: 8px; color: #888;">Date</td><td style="padding: 8px;"><strong>${date}</strong></td></tr>
        <tr><td style="padding: 8px; color: #888;">Time</td><td style="padding: 8px;"><strong>${time}</strong></td></tr>
      </table>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `New Booking: ${customerName} — ${serviceName}`,
    html,
  });
}
