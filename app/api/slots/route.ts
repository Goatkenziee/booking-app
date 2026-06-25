import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TIME_SLOTS } from "@/lib/time-slots";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "date parameter is required" }, { status: 400 });
  }

  try {
    const bookedSlots = await prisma.booking.findMany({
      where: { date, status: { not: "cancelled" } },
      select: { timeSlot: true },
    });

    const bookedSet = new Set(bookedSlots.map((b) => b.timeSlot));

    const slots = TIME_SLOTS.map((time) => ({
      time,
      available: !bookedSet.has(time),
      formatted: `${parseInt(time.split(":")[0]) > 12 ? parseInt(time.split(":")[0]) - 12 : parseInt(time.split(":")[0])}:${time.split(":")[1]} ${parseInt(time.split(":")[0]) >= 12 ? "PM" : "AM"}`,
    }));

    return NextResponse.json({ date, slots });
  } catch (error) {
    console.error("GET /api/slots error:", error);
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
  }
}
