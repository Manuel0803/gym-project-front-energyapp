import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, 'El correo electrónico o DNI es obligatorio')
    .max(150, 'El identificador es demasiado largo'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña es demasiado larga'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
