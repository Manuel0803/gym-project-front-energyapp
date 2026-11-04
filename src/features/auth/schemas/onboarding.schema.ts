import { z } from 'zod';

export const onboardingSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, 'El nuevo correo electrónico es obligatorio')
      .email('Por favor ingresa un correo electrónico válido')
      .max(150, 'El correo electrónico es demasiado largo'),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .max(100, 'La contraseña es demasiado larga'),
    confirmPassword: z
      .string()
      .min(1, 'Por favor confirma tu nueva contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
