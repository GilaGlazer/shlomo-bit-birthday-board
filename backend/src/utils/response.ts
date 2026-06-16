import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  statusCode: number,
  data: unknown,
  message?: string
) => {
  const body: Record<string, unknown> = { success: true, data };
  if (message) body.message = message;
  return res.status(statusCode).json(body);
};

export const sendPaginated = (
  res: Response,
  statusCode: number,
  data: unknown[],
  pagination: { page: number; limit: number; total: number; totalPages: number }
) => {
  return res.status(statusCode).json({ success: true, data, pagination });
};

export const sendError = (
  res: Response,
  statusCode: number,
  error: string,
  code?: string | null
) => {
  const body: Record<string, unknown> = { success: false, error };
  if (code) body.code = code;
  return res.status(statusCode).json(body);
};
