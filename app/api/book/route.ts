import { NextRequest, NextResponse } from 'next/server';
import prisma from '../lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, date, timeSlot } = await req.json();

    if (!name || !email || !date || !timeSlot) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        date: new Date(date),
        timeSlot,
      },
    });

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Booking Confirmation',
      html: `<p>Hi ${name},</p><p>Your booking for ${timeSlot} on ${new Date(date).toDateString()} has been confirmed.</p><p>Thank you!</p>`,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Booking creation failed:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}