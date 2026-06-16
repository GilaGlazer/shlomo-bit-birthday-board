import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@birthday.com' },
    update: {},
    create: {
      email: 'demo@birthday.com',
      password: hashedPassword,
    },
  });

  // Seed people with a mix of past/future birthdays and today
  const today = new Date();
  const m = today.getMonth();
  const d = today.getDate();

  // Use Date.UTC to avoid timezone shift when storing DATE in PostgreSQL
  const utcDate = (year: number, month: number, day: number) =>
    new Date(Date.UTC(year, month, day));

  const people = [
    { name: 'Alice Johnson', birthDate: utcDate(1990, m, d) },
    { name: 'Bob Smith',     birthDate: utcDate(1985, m, d) },
    { name: 'Carol White',   birthDate: utcDate(1992, 0, 15) },
    { name: 'David Brown',   birthDate: utcDate(1988, 2, 22) },
    { name: 'Emma Davis',    birthDate: utcDate(1995, 5, 10) },
    { name: 'Frank Wilson',  birthDate: utcDate(1980, 8, 5) },
    { name: 'Grace Lee',     birthDate: utcDate(1993, 11, 31) },
    { name: 'Henry Taylor',  birthDate: utcDate(1987, 3, 17) },
    { name: 'Isabella Martin', birthDate: utcDate(1991, 6, 28) },
    { name: 'Jack Anderson', birthDate: utcDate(1996, 9, 3) },
    { name: 'Karen Thomas',  birthDate: utcDate(1983, 1, 14) },
    { name: 'Liam Jackson',  birthDate: utcDate(1999, 7, 20) },
  ];

  const existing = await prisma.person.count({ where: { createdBy: user.id } });
  if (existing > 0) {
    console.log('Seed already applied — skipping people.');
    return;
  }

  for (const p of people) {
    await prisma.person.create({ data: { ...p, createdBy: user.id } });
  }

  console.log(`Seeded ${people.length} people for user ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
