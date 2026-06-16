import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import AppError from '../utils/AppError';

const formatZodError = (error: ZodError): string =>
  error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');

export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError(formatZodError(error), 400, 'VALIDATION_ERROR'));
      } else {
        next(error);
      }
    }
  };

export const validateQuery =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError(formatZodError(error), 400, 'VALIDATION_ERROR'));
      } else {
        next(error);
      }
    }
  };

export const validateParams =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError('Invalid parameter format', 400, 'VALIDATION_ERROR'));
      } else {
        next(error);
      }
    }
  };
