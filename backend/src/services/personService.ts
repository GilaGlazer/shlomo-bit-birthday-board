import * as personRepo from '../repositories/personRepository';
import AppError from '../utils/AppError';
import { CreatePersonInput, UpdatePersonInput } from '../schemas/personSchemas';

export const create = (userId: string, input: CreatePersonInput) =>
  personRepo.createPerson({
    name: input.name,
    birthDate: new Date(input.birthDate),
    createdBy: userId,
  });

export const list = async (userId: string, page: number, limit: number, search = '') => {
  const { data, total } = await personRepo.paginatePeople(userId, page, limit, search);
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const todayBirthdays = (userId: string) =>
  personRepo.findTodayBirthdays(userId);

export const update = async (userId: string, id: string, input: UpdatePersonInput) => {
  const existing = await personRepo.findById(id, userId);
  if (!existing) throw new AppError('Person not found', 404, 'NOT_FOUND');

  return personRepo.updatePerson(id, userId, {
    ...(input.name && { name: input.name }),
    ...(input.birthDate && { birthDate: new Date(input.birthDate) }),
  });
};

export const remove = async (userId: string, id: string) => {
  const existing = await personRepo.findById(id, userId);
  if (!existing) throw new AppError('Person not found', 404, 'NOT_FOUND');

  await personRepo.deletePerson(id);
};
