import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.booking.upsert({
    where: { id: 'test-booking-1' },
    update: {},
    create: {
      id: 'test-booking-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      date: new Date('2024-06-01T10:00:00Z'),
      timeSlot: '10:00 - 11:00',
    },
  })

  await prisma.booking.upsert({
    where: { id: 'test-booking-2' },
    update: {},
    create: {
      id: 'test-booking-2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      date: new Date('2024-06-01T14:00:00Z'),
      timeSlot: '14:00 - 15:00',
    },
  })

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
