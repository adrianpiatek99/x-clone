import { z } from 'zod';

export type NextCursor = { id: string; createdAt: string } | null;
export type CursorParams = z.infer<typeof cursorSchema>;

export const cursorSchema = z.object({
  cursor: z
    .object({
      id: z.string(),
      createdAt: z.coerce.date(),
    })
    .optional(),
  limit: z.number().default(20),
});
