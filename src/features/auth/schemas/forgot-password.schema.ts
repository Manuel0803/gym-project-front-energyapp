import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es obligatorio')
    .email('Por favor, ingresa un correo electrónico válido')
    .max(150, 'El correo electrónico es demasiado largo'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
