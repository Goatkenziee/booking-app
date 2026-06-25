import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, canSendEmail } from "@/lib/resend";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, date, timeSlot, service, notes } = body;

    if (!name || !email || !date || !timeSlot) {
      return NextResponse.json({ error: "Missing required fields: name, email, date, timeSlot" }, { status: 400 });
    }

    // Check if slot is already booked
    const existing = await prisma.booking.findFirst({
      where: { date, timeSlot, status: { not: "cancelled" } },
    });

    if (existing) {
      return NextResponse.json({ error: "This time slot is already booked" }, { status: 409 });
    }

    const booking = await prisma.booking.create({
      data: { name, email, phone, date, timeSlot, service: service || "General Consultation", notes, status: "confirmed" },
    });

    // Send confirmation email if Resend is configured
    if (canSendEmail() && resend) {
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "onboarding@resend.dev",
          to: email,
          subject: `Booking Confirmed — ${formatDate(date)} at ${formatTime(timeSlot)}`,
          html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
            <h2>Booking Confirmed</h2>
            <p>Hi ${name},</p>
            <p>Your booking has been confirmed.</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Date</td><td style="padding:8px;border-bottom:1px solid #eee"><strong>${formatDate(date)}</strong></td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Time</td><td style="padding:8px;border-bottom:1px solid #eee"><strong>${formatTime(timeSlot)}</strong></td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Service</td><td style="padding:8px;border-bottom:1px solid #eee"><strong>${service || "General Consultation"}</strong></td></tr>
            </table>
            <p style="color:#666;font-size:14px">Need to reschedule? Contact us.</p>
          </div>`,
        });
      } catch (emailErr) {
        console.error("Failed to send confirmation email:", emailErr);
      }
    }

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function formatTime(time: string) {
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12}:${m} ${ampm}`;
}
