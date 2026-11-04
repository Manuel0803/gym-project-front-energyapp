import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExercisesService } from '../services/exercises.service';
import {
  CreateExercisePayload,
  ExerciseCatalogParams,
} from '../interfaces/exercise.interface';
import { ApiError } from '@/common/interfaces/api-error.interface';
import toast from 'react-hot-toast';

export const useExercisesCatalog = (params: ExerciseCatalogParams = {}) => {
  return useQuery({
    queryKey: ['exercises-catalog', params],
    queryFn: () => ExercisesService.getCatalog(params),
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useCreateExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExercisePayload) =>
      ExercisesService.createExercise(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises-catalog'] });
      toast.success('Ejercicio agregado al catálogo correctamente');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;

      toast.error(
        Array.isArray(message)
          ? message[0]
          : message || 'Error al crear el ejercicio'
      );
    },
  });
};
