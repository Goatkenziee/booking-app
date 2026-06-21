import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create services
  const consultation = await prisma.service.create({
    data: {
      name: "30-Min Consultation",
      description: "A quick 30-minute consultation to discuss your project needs and goals.",
      duration: 30,
      price: 0,
      active: true,
    },
  });

  const deepDive = await prisma.service.create({
    data: {
      name: "1-Hour Deep Dive",
      description: "An in-depth session to dive deep into strategy, planning, and execution.",
      duration: 60,
      price: 150,
      active: true,
    },
  });

  const workshop = await prisma.service.create({
    data: {
      name: "2-Hour Workshop",
      description: "Intensive hands-on workshop for teams. Includes materials and follow-up.",
      duration: 120,
      price: 350,
      active: true,
    },
  });

  // Generate time slots for the next 14 days
  const services = [consultation, deepDive, workshop];
  const now = new Date();
  const startHour = 9; // 9 AM
  const endHour = 17;  // 5 PM

  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);
    date.setHours(0, 0, 0, 0);

    // Skip weekends
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    for (const service of services) {
      const slotDuration = service.duration;
      for (let hour = startHour; hour < endHour; hour += slotDuration / 60) {
        const startTime = `${String(hour).padStart(2, "0")}:00`;
        const endH = hour + slotDuration / 60;
        const endTime = `${String(Math.floor(endH)).padStart(2, "0")}:${endH % 1 === 0.5 ? "30" : "00"}`;

        // Skip if end time exceeds endHour
        if (hour + slotDuration / 60 > endHour) continue;

        const existing = await prisma.timeSlot.findFirst({
          where: {
            serviceId: service.id,
            date,
            startTime,
          },
        });

        if (!existing) {
          await prisma.timeSlot.create({
            data: {
              serviceId: service.id,
              date,
              startTime,
              endTime,
              available: true,
            },
          });
        }
      }
    }
  }

  console.log("✅ Database seeded successfully!");
  console.log(`  - ${services.length} services created`);
  console.log(`  - Time slots generated for 14 days`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
