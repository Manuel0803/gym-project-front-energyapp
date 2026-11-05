import * as z from 'zod';

export const paymentSchema = z.object({
  amount: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === 'string') {
        return Number(val.replace(/\./g, '').replace(/,/g, ''));
      }
      return val;
    })
    .refine((val) => !isNaN(val) && val >= 0, {
      message: 'El monto debe ser positivo',
    })
    .refine((val) => val <= 10000000, { message: 'Monto excedido' }),
  method: z.enum(
    [
      'CASH',
      'BANK_TRANSFER',
      'MERCADO_PAGO',
      'DEBIT_CARD',
      'CREDIT_CARD',
      'OTHER',
    ],
    {
      errorMap: () => ({ message: 'Selecciona un método de pago válido' }),
    }
  ),
  date: z
    .string()
    .min(1, 'La fecha es obligatoria')
    .refine((val) => {
      const selected = new Date(val);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return selected <= today;
    }, 'La fecha no puede estar en el futuro')
    .optional(),
  notes: z
    .string()
    .max(500, 'Las notas no pueden superar los 500 caracteres')
    .optional(),
});

export type PaymentFormInput = z.input<typeof paymentSchema>;

export type PaymentFormValues = z.infer<typeof paymentSchema>;
