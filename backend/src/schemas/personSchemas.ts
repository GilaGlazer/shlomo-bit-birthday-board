import { z } from 'zod';

export const createPersonSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'birthDate must be in YYYY-MM-DD format')
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
});

export const updatePersonSchema = createPersonSchema.partial();

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .refine((n) => n > 0, 'page must be > 0'),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform(Number)
    .refine((n) => n > 0 && n <= 100, 'limit must be 1-100'),
  search: z.string().optional().default(''),
});

export const idParamSchema = z.object({
  id: z.string().uuid('id must be a valid UUID'),
});

export type CreatePersonInput = z.infer<typeof createPersonSchema>;
export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;
