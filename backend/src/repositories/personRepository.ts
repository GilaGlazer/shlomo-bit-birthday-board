import prisma from '../config/prisma';

export const createPerson = (data: { name: string; birthDate: Date; createdBy: string }) =>
  prisma.person.create({ data });

export const findById = (id: string, userId: string) =>
  prisma.person.findFirst({ where: { id, createdBy: userId } });

export const updatePerson = (id: string, userId: string, data: { name?: string; birthDate?: Date }) =>
  prisma.person.update({ where: { id }, data, include: { user: false } });

export const deletePerson = (id: string) =>
  prisma.person.delete({ where: { id } });

export const paginatePeople = async (userId: string, page: number, limit: number, search = '') => {
  const skip = (page - 1) * limit;
  const where = {
    createdBy: userId,
    ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
  };
  const [data, total] = await Promise.all([
    prisma.person.findMany({ where, orderBy: { name: 'asc' }, skip, take: limit }),
    prisma.person.count({ where }),
  ]);
  return { data, total };
};

export const findTodayBirthdays = (userId: string) =>
  prisma.$queryRaw<{ id: string; name: string; birthDate: Date; createdBy: string; createdAt: Date; updatedAt: Date }[]>`
    SELECT * FROM people
    WHERE "createdBy" = ${userId}
      AND EXTRACT(MONTH FROM "birthDate") = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(DAY FROM "birthDate") = EXTRACT(DAY FROM CURRENT_DATE)
    ORDER BY name ASC
  `;
