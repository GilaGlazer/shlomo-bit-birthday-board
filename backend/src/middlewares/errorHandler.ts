import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import env from '../config/env';
import { sendError } from '../utils/response';
import AppError from '../utils/AppError';

const errorHandler = (
  err: Error & { statusCode?: number; code?: string; isOperational?: boolean },
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode ?? 500;
  let message = err.message ?? 'Internal Server Error';
  let code = err.code ?? null;

  // Prisma errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'A record with this value already exists';
    code = 'DUPLICATE_ENTRY';
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
    code = 'NOT_FOUND';
  } else if (err.code?.startsWith('P')) {
    statusCode = 500;
    message = 'Database operation failed';
    code = 'DATABASE_ERROR';
  }

  // Zod errors (if not caught by validate middleware)
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    code = 'VALIDATION_ERROR';
  }

  // Avoid leaking internals in production
  if (!err.isOperational && env.NODE_ENV === 'production') {
    message = 'Internal Server Error';
    code = 'INTERNAL_ERROR';
  }

  if (env.NODE_ENV === 'development') {
    console.error('[Error]', err);
  }

  sendError(res, statusCode, message, code);
};

export default errorHandler;
