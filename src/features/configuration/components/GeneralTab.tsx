'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRole } from '@/features/auth/hooks/useRole';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useGym, useUpdateGym } from '@/features/gyms/hooks/useGyms';
import {
  configGeneralSchema,
  GeneralFormValues,
} from '@/features/configuration/schemas/config.schema';
import { InputField } from '@/common/components/ui/InputField';
import { GeneralTabSkeleton } from './GeneralTabSkeleton';
import { ApiError } from '@/common/interfaces/api-error.interface';
import toast from 'react-hot-toast';
import { Save, Loader2 } from 'lucide-react';

export function GeneralTab() {
  const { isAdmin } = useRole();
  const gymUuid = useAuthStore((state) => state.user?.gymUuid);

  const { data: gymData, isLoading: isFetching } = useGym(gymUuid);
  const { mutate: updateGym, isPending: isUpdating } = useUpdateGym();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GeneralFormValues>({
    resolver: zodResolver(configGeneralSchema),
  });

  useEffect(() => {
    if (gymData) {
      reset({
        gymName: gymData.name,
        phoneNumber: gymData.phoneNumber || '',
        address: gymData.address || '',
      });
    }
  }, [gymData, reset]);

  const onSubmit = (data: GeneralFormValues) => {
    if (!gymUuid) return;

    const payload = {
      name: data.gymName,
      phoneNumber: data.phoneNumber,
      address: data.address,
    };

    updateGym(
      { id: gymUuid, payload },
      {
        onSuccess: () => {
          toast.success('Configuración actualizada con éxito');
        },
        onError: (error: unknown) => {
          const apiError = error as ApiError;
          console.error('[GeneralTab] Error al actualizar el gimnasio:', apiError);
          const message = apiError.response?.data?.message;
          toast.error(
            Array.isArray(message) ? message[0] : (message || 'Ocurrió un error al actualizar los datos.')
          );
        },
      }
    );
  };

  if (isFetching) {
    return <GeneralTabSkeleton isAdmin={isAdmin} />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="p-6 md:p-8 flex flex-col gap-8 animate-in fade-in duration-300"
    >
      <div className="relative">
        <h2 className="text-lg font-bold text-text-main mb-1">
          Información del Gimnasio
        </h2>
        <p className="text-sm text-text-muted mb-6">
          {isAdmin
            ? 'Actualiza los detalles básicos de tu establecimiento.'
            : 'Detalles de tu establecimiento.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Nombre del Gimnasio"
            type="text"
            disabled={!isAdmin || isUpdating}
            registration={register('gymName')}
            error={errors.gymName?.message}
          />

          <InputField
            label="Teléfono de Contacto"
            type="text"
            disabled={!isAdmin || isUpdating}
            registration={register('phoneNumber')}
            error={errors.phoneNumber?.message}
          />

          <InputField
            label="Dirección"
            type="text"
            disabled={!isAdmin || isUpdating}
            registration={register('address')}
            error={errors.address?.message}
            className="md:col-span-2"
          />
        </div>

        {isAdmin && (
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-main hover:bg-brand-hover text-white rounded-sm font-medium text-sm transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save size={16} aria-hidden="true" />
              )}
              <span>{isUpdating ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
