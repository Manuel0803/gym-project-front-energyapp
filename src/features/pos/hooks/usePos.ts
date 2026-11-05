import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PosService } from '../services/pos.service';
import { CreateSalePayload } from '../interfaces/pos.interface';
import { ApiError } from '@/common/interfaces/api-error.interface';
import toast from 'react-hot-toast';

export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSalePayload) => PosService.createSale(payload),
    onSuccess: () => {
      // Invalidate both products (stock updated) and payment/sales history
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('¡Venta registrada con éxito!');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;

      toast.error(
        Array.isArray(message)
          ? message[0]
          : message || 'Error al procesar la venta. Verifique el stock disponible.'
      );
    },
  });
};

export const useVoidSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => PosService.voidSale(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
      toast.success('Venta anulada correctamente');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;

      toast.error(
        Array.isArray(message)
          ? message[0]
          : message || 'No se pudo anular la venta'
      );
    },
  });
};

export const useSales = (
  page: number = 1,
  limit: number = 10,
  customerUuid?: string
) => {
  return useQuery({
    queryKey: ['sales', { page, limit, customerUuid }],
    queryFn: () => PosService.getSales(page, limit, customerUuid),
    staleTime: 1000 * 20,
  });
};
