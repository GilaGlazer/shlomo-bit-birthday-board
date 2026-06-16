import bcrypt from 'bcryptjs';
import * as userRepo from '../repositories/userRepository';
import { generateToken } from '../utils/jwt';
import AppError from '../utils/AppError';
import env from '../config/env';
import { RegisterInput, LoginInput } from '../schemas/authSchemas';

const sanitize = (user: { id: string; email: string; password: string; createdAt: Date; updatedAt: Date }) => {
  const { password: _, ...safe } = user;
  return safe;
};

export const register = async ({ email, password }: RegisterInput) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) {
    throw new AppError('Email already in use', 409, 'EMAIL_EXISTS');
  }

  const hashed = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
  const user = await userRepo.createUser(email, hashed);
  const token = generateToken({ userId: user.id, email: user.email });

  return { user: sanitize(user), token };
};

export const login = async ({ email, password }: LoginInput) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const token = generateToken({ userId: user.id, email: user.email });
  return { user: sanitize(user), token };
};

export const getMe = async (userId: string) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, 'NOT_FOUND');
  }
  return sanitize(user);
};
