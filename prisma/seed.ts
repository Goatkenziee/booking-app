import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create some sample bookings
  const bookings = [
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+1-555-0101",
      date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // tomorrow
      timeSlot: "10:00",
      service: "Strategy Session",
      notes: "Interested in AI integration for our e-commerce platform.",
      status: "confirmed",
    },
    {
      name: "Bob Smith",
      email: "bob@example.com",
      phone: "+1-555-0102",
      date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0], // day after tomorrow
      timeSlot: "14:30",
      service: "Technical Review",
      notes: "Need help with our cloud infrastructure.",
      status: "confirmed",
    },
  ];

  for (const booking of bookings) {
    const existing = await prisma.booking.findFirst({
      where: { date: booking.date, timeSlot: booking.timeSlot },
    });

    if (!existing) {
      await prisma.booking.create({ data: booking });
      console.log(`Created booking for ${booking.name} on ${booking.date} at ${booking.timeSlot}`);
    } else {
      console.log(`Skipped ${booking.name} — slot already booked`);
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
