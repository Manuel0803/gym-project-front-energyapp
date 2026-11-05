import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { StudentService } from '../services/student.service';
import { UpdateStudentProfilePayload } from '../interfaces/student.interface';
import { ApiError } from '@/common/interfaces/api-error.interface';
import toast from 'react-hot-toast';

const shouldRetry = (failureCount: number, error: unknown) => {
  const status = (error as { response?: { status?: number } })?.response?.status;
  if (status === 401 || status === 403 || status === 404) return false;
  return failureCount < 2;
};

export const useMyStatus = () => {
  return useQuery({
    queryKey: ['my-status'],
    queryFn: () => StudentService.getMyStatus(),
    staleTime: 1000 * 30, // 30 seconds
    retry: shouldRetry,
  });
};

export const useMyRoutine = () => {
  return useQuery({
    queryKey: ['my-routine'],
    queryFn: () => StudentService.getMyRoutine(),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: shouldRetry,
  });
};

export const usePublicPaymentMethods = () => {
  return useQuery({
    queryKey: ['public-payment-methods'],
    queryFn: () => StudentService.getPublicPaymentMethods(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: shouldRetry,
  });
};

export const useMyProfile = () => {
  return useQuery({
    queryKey: ['my-profile'],
    queryFn: () => StudentService.getMyProfile(),
    staleTime: 1000 * 60, // 1 minute
    retry: shouldRetry,
  });
};

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateStudentProfilePayload) =>
      StudentService.updateMyProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      toast.success('¡Perfil actualizado con éxito!');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;

      toast.error(
        Array.isArray(message)
          ? message[0]
          : message || 'Error al actualizar los datos de perfil'
      );
    },
  });
};
