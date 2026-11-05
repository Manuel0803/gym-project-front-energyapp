import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RoutinesService } from '../services/routines.service';
import { CreateRoutinePayload } from '../interfaces/routine.interface';
import { ApiError } from '@/common/interfaces/api-error.interface';
import toast from 'react-hot-toast';

export const useCreateRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRoutinePayload) =>
      RoutinesService.createRoutine(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      queryClient.invalidateQueries({
        queryKey: ['routine-member', variables.memberUuid],
      });
      queryClient.invalidateQueries({ queryKey: ['my-students'] });
      toast.success('¡Rutina semanal guardada y asignada con éxito!');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;

      toast.error(
        Array.isArray(message)
          ? message[0]
          : message || 'Error al guardar la rutina del alumno'
      );
    },
  });
};

export const useMemberRoutine = (memberUuid?: string) => {
  return useQuery({
    queryKey: ['routine-member', memberUuid],
    queryFn: () => (memberUuid ? RoutinesService.getRoutineByMember(memberUuid) : null),
    enabled: Boolean(memberUuid),
  });
};
