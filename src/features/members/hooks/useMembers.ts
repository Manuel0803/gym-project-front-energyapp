import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MembersService } from '../services/members.service';
import {
  CreateMemberPayload,
  GetMembersParams,
  UpdateMemberPayload,
} from '../interfaces/members.interface';
import { ApiError } from '@/common/interfaces/api-error.interface';
import toast from 'react-hot-toast';

export const useMembers = (params: GetMembersParams = {}) => {
  return useQuery({
    queryKey: ['members', params],
    queryFn: () => MembersService.getAll(params),
    staleTime: 1000 * 10,
  });
};

export const useMember = (id: string) => {
  return useQuery({
    queryKey: ['member', id],
    queryFn: () => MembersService.getById(id),
    enabled: !!id,
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMemberPayload) =>
      MembersService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Miembro creado con éxito');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;
      
      toast.error(
        Array.isArray(message)
          ? message[0]
          : (message || 'Ocurrió un error al crear el miembro')
      );
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateMemberPayload;
    }) => MembersService.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['member', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Miembro actualizado con éxito');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;
      
      toast.error(
        Array.isArray(message)
          ? message[0]
          : (message || 'No se pudo actualizar el miembro')
      );
    },
  });
};

export const useDeactivateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => MembersService.deactivate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['member', id] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Socio desactivado correctamente');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;
      
      toast.error(
        Array.isArray(message) 
          ? message[0] 
          : (message || 'Error al desactivar el socio')
      );
    },
  });
};

export const useRenewPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { planUuid: string; paymentMethod: string; customStartDate?: string; registerPayment?: boolean };
    }) => MembersService.renewPlan(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['member', variables.id] });
      toast.success('¡Plan renovado con éxito!');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;
      
      toast.error(
        Array.isArray(message) 
          ? message[0] 
          : (message || 'Hubo un error al renovar el plan')
      );
    },
  });
};

export const useChangePlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        newPlanUuid: string;
        paymentMethod: string;
        activationType: 'IMMEDIATE' | 'SCHEDULED';
        customStartDate?: string;
        registerPayment?: boolean;
      };
    }) => MembersService.changePlan(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['member', variables.id] });
      toast.success('¡Plan modificado con éxito!');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;
      
      toast.error(
        Array.isArray(message) 
          ? message[0] 
          : (message || 'Hubo un error al cambiar el plan')
      );
    },
  });
};

export const useImportMembers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => MembersService.importCsv(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;

      toast.error(
        Array.isArray(message)
          ? message[0]
          : message || 'Error al procesar la importación masiva'
      );
    },
  });
};
