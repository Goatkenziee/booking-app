import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { getAvailableTimeSlots } from '@/lib/utils';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, date, timeSlot } = await request.json();

    if (!name || !email || !date || !timeSlot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check for existing booking at the same time slot
    const existingBooking = await prisma.booking.findFirst({
      where: {
        date: new Date(date),
        timeSlot,
      },
    });

    if (existingBooking) {
      return NextResponse.json({ error: 'Time slot already booked' }, { status: 409 });
    }

    const newBooking = await prisma.booking.create({
      data: {
        name,
        email,
        date: new Date(date),
        timeSlot,
      },
    });

    // Send email confirmation
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Booking Confirmation',
      html: `<p>Hi ${name}, your booking for ${timeSlot} on ${new Date(date).toDateString()} is confirmed!</p>`,
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    if (!dateParam) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    const date = new Date(dateParam);
    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
    });

    const bookedTimeSlots = bookings.map((booking) => booking.timeSlot);
    const allTimeSlots = getAvailableTimeSlots(date);

    const availableTimeSlots = allTimeSlots.filter(
      (slot) => !bookedTimeSlots.includes(slot)
    );

    return NextResponse.json({ availableTimeSlots }, { status: 200 });
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available time slots' },
      { status: 500 }
    );
  }
}