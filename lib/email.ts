const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || "bookings@youme.place";

export async function sendBookingConfirmation({
  to,
  name,
  serviceName,
  date,
  startTime,
  endTime,
  bookingId,
}: {
  to: string;
  name: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  bookingId: string;
}) {
  // If no Resend key, log and return gracefully
  if (!RESEND_API_KEY) {
    console.log(`[EMAIL] Would send to ${to}: Booking ${bookingId} confirmed for ${serviceName} on ${date} ${startTime}-${endTime}`);
    return { success: true, mock: true };
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0f; color: #f0f0f8; padding: 40px;">
      <div style="max-width: 480px; margin: 0 auto; background: #12121a; border-radius: 16px; padding: 32px; border: 1px solid #2a2a3a;">
        <h1 style="font-size: 24px; margin: 0 0 8px; background: linear-gradient(90deg, #8b7cf7, #d47bf6); -webkit-background-clip: text; background-clip: text; color: transparent;">
          Booking Confirmed ✓
        </h1>
        <p style="color: #a0a0b8; margin: 0 0 24px;">Hey ${name}, your booking is all set.</p>

        <div style="background: #1a1a28; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 12px; color: #c0c0d0;"><strong style="color: #f0f0f8;">Service:</strong> ${serviceName}</p>
          <p style="margin: 0 0 12px; color: #c0c0d0;"><strong style="color: #f0f0f8;">Date:</strong> ${date}</p>
          <p style="margin: 0 0 12px; color: #c0c0d0;"><strong style="color: #f0f0f8;">Time:</strong> ${startTime} - ${endTime}</p>
          <p style="margin: 0; color: #c0c0d0;"><strong style="color: #f0f0f8;">Booking ID:</strong> ${bookingId.slice(0, 8)}</p>
        </div>

        <p style="color: #707088; font-size: 13px; margin: 0;">
          Need to reschedule? Reply to this email or visit your dashboard.
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject: `Booking Confirmed — ${serviceName}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[EMAIL] Resend error:", err);
      return { success: false, error: err };
    }

    return { success: true };
  } catch (err) {
    console.error("[EMAIL] Failed to send:", err);
    return { success: false, error: String(err) };
  }
}
