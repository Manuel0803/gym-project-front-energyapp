import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PaymentsService } from '../services/payments.service';
import {
  CreatePaymentPayload,
  UpdatePaymentPayload,
} from '../interfaces/payments.interface';
import { ApiError } from '@/common/interfaces/api-error.interface';
import toast from 'react-hot-toast';

export const usePayments = (
  page: number = 1,
  limit: number = 10,
  memberUuid?: string,
  status?: string
) => {
  return useQuery({
    queryKey: ['payments', { page, limit, memberUuid, status }],
    queryFn: () => PaymentsService.getAll(page, limit, memberUuid, status),
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePaymentPayload) =>
      PaymentsService.create(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({
        queryKey: ['member', variables.memberUuid],
      });
      toast.success('Pago registrado con éxito');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;
      
      toast.error(
        Array.isArray(message)
          ? message[0]
          : (message || 'Ocurrió un error al registrar el pago')
      );
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePaymentPayload;
    }) => PaymentsService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['member'] });
      toast.success('Pago actualizado con éxito');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;
      
      toast.error(
        Array.isArray(message)
          ? message[0]
          : (message || 'Ocurrió un error al actualizar el pago')
      );
    },
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PaymentsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['member'] });
      toast.success('Pago anulado con éxito');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;
      
      toast.error(
        Array.isArray(message)
          ? message[0]
          : (message || 'Ocurrió un error al anular el pago')
      );
    },
  });
};
