import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre de la categoría es obligatorio')
    .max(100, 'El nombre es demasiado largo'),
  description: z
    .string()
    .trim()
    .max(255, 'La descripción es demasiado larga')
    .optional()
    .or(z.literal('')),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
