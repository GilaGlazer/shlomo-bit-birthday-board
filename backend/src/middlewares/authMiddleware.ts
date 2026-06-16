import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import AppError from '../utils/AppError';
import prisma from '../config/prisma';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; email: string };
    }
  }
}

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const token: string | undefined = req.cookies?.token;

  if (!token) {
    return next(new AppError('No token provided', 401, 'NO_TOKEN'));
  }

  try {
    const payload = verifyToken(token);
    const exists = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true },
    });
    if (!exists) {
      return next(new AppError('Session expired', 401, 'INVALID_TOKEN'));
    }
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};
