import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canSendEmail, resend } from "@/lib/resend";
import { formatDate, formatTimeSlot } from "@/lib/time-slots";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const status = searchParams.get("status");

  try {
    const where: Record<string, unknown> = {};
    if (date) where.date = date;
    if (status) where.status = status;

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
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
      return NextResponse.json(
        { error: "Missing required fields: name, email, date, timeSlot" },
        { status: 400 }
      );
    }

    // Check if slot is already booked
    const existing = await prisma.booking.findFirst({
      where: { date, timeSlot, status: { not: "cancelled" } },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This time slot is already booked. Please choose another." },
        { status: 409 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        phone: phone || null,
        date,
        timeSlot,
        service: service || "General Consultation",
        notes: notes || null,
        status: "confirmed",
      },
    });

    // Send confirmation email if Resend is configured
    if (canSendEmail() && resend) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "onboarding@resend.dev",
          to: email,
          subject: `Booking Confirmed — ${formatDate(date)} at ${formatTimeSlot(timeSlot)}`,
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #0a0a0f; color: #f0f0f5; border-radius: 12px;">
              <div style="font-size: 28px; font-weight: 700; margin-bottom: 8px; background: linear-gradient(90deg, #8b5cf6, #d946ef); -webkit-background-clip: text; background-clip: text; color: transparent;">Booking Confirmed</div>
              <p style="color: #a1a1aa; margin-bottom: 24px;">Your booking has been confirmed. Here are the details:</p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #a1a1aa;">Name</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${name}</td></tr>
                <tr><td style="padding: 8px 0; color: #a1a1aa;">Date</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${formatDate(date)}</td></tr>
                <tr><td style="padding: 8px 0; color: #a1a1aa;">Time</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${formatTimeSlot(timeSlot)}</td></tr>
                <tr><td style="padding: 8px 0; color: #a1a1aa;">Service</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${service || "General Consultation"}</td></tr>
              </table>
              <hr style="border: none; border-top: 1px solid #27272a; margin: 24px 0;" />
              <p style="color: #a1a1aa; font-size: 14px;">Need to reschedule? <a href="${appUrl}" style="color: #8b5cf6;">Visit our booking page</a>.</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Failed to send confirmation email:", emailErr);
        // Don't fail the booking if email fails
      }
    }

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
