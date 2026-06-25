import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create some sample bookings for today and upcoming days
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);
  const dayAfterStr = dayAfter.toISOString().split("T")[0];

  const sampleBookings = [
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+1-555-0101",
      date: todayStr,
      timeSlot: "10:00",
      service: "Strategy Session",
      notes: "Looking forward to discussing our Q3 plans.",
      status: "confirmed",
    },
    {
      name: "Bob Smith",
      email: "bob@example.com",
      phone: "+1-555-0102",
      date: todayStr,
      timeSlot: "14:00",
      service: "Technical Review",
      notes: "Need help with architecture review.",
      status: "confirmed",
    },
    {
      name: "Carol Davis",
      email: "carol@example.com",
      date: tomorrowStr,
      timeSlot: "11:00",
      service: "Product Demo",
      notes: null,
      status: "confirmed",
    },
    {
      name: "David Wilson",
      email: "david@example.com",
      phone: "+1-555-0104",
      date: dayAfterStr,
      timeSlot: "09:00",
      service: "General Consultation",
      notes: "First meeting.",
      status: "confirmed",
    },
    {
      name: "Eva Martinez",
      email: "eva@example.com",
      date: dayAfterStr,
      timeSlot: "15:30",
      service: "Onboarding Call",
      notes: null,
      status: "confirmed",
    },
  ];

  for (const booking of sampleBookings) {
    await prisma.booking.create({ data: booking });
  }

  console.log(`Seeded ${sampleBookings.length} bookings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
