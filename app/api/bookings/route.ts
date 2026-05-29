import { NextRequest, NextResponse } from 'next/server';
import prisma from '../lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        date: 'asc',
      },
    });
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}