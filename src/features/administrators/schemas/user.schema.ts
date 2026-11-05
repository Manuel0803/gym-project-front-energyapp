import * as z from 'zod';

export const userSchema = z.object({
  dni: z
    .string()
    .trim()
    .min(7, 'El DNI debe tener al menos 7 caracteres')
    .max(8, 'El DNI no puede superar los 8 caracteres')
    .regex(/^\d+$/, 'El DNI solo debe contener números'),

  name: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es demasiado largo'),

  surname: z
    .string()
    .trim()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido es demasiado largo'),

  email: z
    .string()
    .trim()
    .email('Debe ser un email válido (ejemplo@correo.com)')
    .max(100, 'El email no puede superar los 100 caracteres'),
});

export type UserFormValues = z.infer<typeof userSchema>;
export type EditAdminFormValues = UserFormValues;
