import { z } from 'zod';

export const exerciseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  muscleGroup: z
    .string()
    .trim()
    .min(1, 'Debe seleccionar un grupo muscular'),
  description: z
    .string()
    .trim()
    .max(300, 'La descripción es demasiado larga')
    .optional()
    .or(z.literal('')),
  equipment: z
    .string()
    .trim()
    .max(80, 'El equipamiento es demasiado largo')
    .optional()
    .or(z.literal('')),
});

export type ExerciseFormValues = z.infer<typeof exerciseSchema>;
