import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre del producto es obligatorio')
    .max(120, 'El nombre es demasiado largo'),
  price: z.coerce
    .number({ invalid_type_error: 'El precio debe ser un número válido' })
    .positive('El precio debe ser un número decimal mayor a 0'),
  stock: z.coerce
    .number({ invalid_type_error: 'El stock debe ser un número entero' })
    .int('El stock debe ser un número entero sin decimales')
    .min(0, 'El stock no puede ser un valor negativo'),
  categoryUuid: z
    .string()
    .trim()
    .min(1, 'Debe seleccionar una categoría para el producto'),
  description: z
    .string()
    .trim()
    .max(300, 'La descripción es demasiado larga')
    .optional()
    .or(z.literal('')),
  sku: z
    .string()
    .trim()
    .max(50, 'El código SKU es demasiado largo')
    .optional()
    .or(z.literal('')),
  barcode: z
    .string()
    .trim()
    .max(50, 'El código de barras es demasiado largo')
    .optional()
    .or(z.literal('')),
});

export type ProductFormValues = z.infer<typeof productSchema>;
