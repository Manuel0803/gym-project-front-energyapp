import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PlansService } from '../services/plans.service';
import {
  CreatePlanPayload,
  UpdatePlanPayload,
} from '../interfaces/plan.interface';
import { ApiError } from '@/common/interfaces/api-error.interface';
import toast from 'react-hot-toast';

interface PlanApiError extends ApiError {
  response?: {
    data?: {
      message?: string | string[];
      isInactive?: boolean;
      planId?: string;
    };
  };
}

export const usePlans = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['plans', { page, limit }],
    queryFn: () => PlansService.getAll(page, limit),
    staleTime: 1000 * 10,
  });
};

export const usePlan = (id: string) => {
  return useQuery({
    queryKey: ['plan', id],
    queryFn: () => PlansService.getById(id),
    enabled: !!id,
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePlanPayload) => PlansService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast.success('Plan creado con éxito');
    },
    onError: (error: unknown) => {
      const apiError = error as PlanApiError;
      
      const isInactive = apiError.response?.data?.isInactive;
      const message = apiError.response?.data?.message;
      
      if (!isInactive) {
        toast.error(
          Array.isArray(message)
            ? message[0]
            : (message || 'Ocurrió un error al crear el plan')
        );
      }
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePlanPayload }) =>
      PlansService.update(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['plan', variables.id] });
      toast.success('Plan actualizado con éxito');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;
      toast.error(
        Array.isArray(message)
          ? message[0]
          : (message || 'No se pudo actualizar el plan')
      );
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PlansService.remove(id),
    onSuccess: (_, id) => {
      queryClient.cancelQueries({ queryKey: ['plan', id] });
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast.success('Plan eliminado con éxito');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;
      toast.error(
        Array.isArray(message)
          ? message[0]
          : (message || 'Ocurrió un error al eliminar el plan')
      );
    },
  });
};
