import prisma from '../config/prisma';

export const createUser = (email: string, hashedPassword: string) =>
  prisma.user.create({ data: { email, password: hashedPassword } });

export const findByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email } });

export const findById = (id: string) =>
  prisma.user.findUnique({ where: { id } });
