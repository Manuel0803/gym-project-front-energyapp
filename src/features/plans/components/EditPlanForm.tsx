'use client';

import { useEffect } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePlan, useUpdatePlan } from '../hooks/usePlans';
import {
  planSchema,
  PlanFormValues,
  PlanFormInput,
} from '@/features/plans/schemas/plan.schema';
import { FormSkeleton } from '@/common/components/ui/skeletons/FormSkeleton';
import { InputField } from '@/common/components/ui/InputField';
import { TextareaField } from '@/common/components/ui/TextareaField';
import { DeletePlanButton } from './DeletePlanButton';
import { Loader2 } from 'lucide-react';

export function EditPlanForm({ id }: { id: string }) {
  const router = useRouter();

  const { data: currentPlan, isLoading: isFetchingPlan } = usePlan(id);
  const { mutate: updatePlan, isPending: isUpdating } = useUpdatePlan();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlanFormInput, unknown, PlanFormValues>({
    resolver: zodResolver(planSchema) as unknown as Resolver<PlanFormInput, unknown, PlanFormValues>,
  });

  useEffect(() => {
    if (currentPlan) {
      reset({
        name: currentPlan.name,
        price: new Intl.NumberFormat('es-AR').format(currentPlan.price),
        durationDays: currentPlan.durationDays,
        description: currentPlan.description || '',
      });
    }
  }, [currentPlan, reset]);

  const onSubmit = (data: PlanFormValues) => {
    updatePlan(
      { id, payload: data },
      {
        onSuccess: () => {
          router.push('/dashboard/planes');
        },
      }
    );
  };

  if (isFetchingPlan) return <FormSkeleton />;
  
  if (!currentPlan) {
    return (
      <div className="text-danger-main p-4 bg-danger-surface border border-danger-main/20 rounded-md" role="alert">
        No se pudo cargar la información del plan.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="border border-border-primary rounded-lg bg-surface flex flex-col p-6 gap-8 relative"
    >
      <fieldset className="flex flex-col gap-6">
        <legend className="text-[15px] font-bold text-text-main mb-4">
          Información general
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Nombre del Plan"
            type="text"
            placeholder="Ej: Pase Libre"
            disabled={isUpdating}
            registration={register('name')}
            error={errors.name?.message}
          />

          <InputField
            label="Precio (Sin decimales)"
            type="text"
            placeholder="15.000"
            disabled={isUpdating}
            registration={register('price', {
              onChange: (e) => {
                const rawValue = e.target.value.replace(/[^0-9]/g, '');
                e.target.value = rawValue
                  ? new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(Number(rawValue))
                  : '';
              },
            })}
            error={errors.price?.message}
            icon={<span aria-hidden="true" className="text-text-muted">$</span>}
          />
        </div>
      </fieldset>

      <hr className="border-border-primary" />

      <fieldset className="flex flex-col gap-6">
        <legend className="text-[15px] font-bold text-text-main mb-4">
          Especificaciones del plan
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Duración (Días)"
            type="number"
            placeholder="Ej: 30"
            disabled={isUpdating}
            registration={register('durationDays')}
            error={errors.durationDays?.message}
          />
        </div>

        <div className="flex flex-col gap-2">
          <TextareaField
            label="Beneficios del plan (Opcional)"
            placeholder="Acceso a sala de musculación&#10;Clases grupales incluidas"
            disabled={isUpdating}
            registration={register('description')}
            error={errors.description?.message}
            rows={4}
          />
          <p className="text-xs text-text-muted mt-1">
            Escribe un beneficio por línea para mostrarlos en la lista.
          </p>
        </div>
      </fieldset>

      <div className="flex flex-col md:flex-row gap-3 justify-between pt-4 border-t border-border-primary">
        <DeletePlanButton
          id={id}
          planName={currentPlan.name}
          disabled={isUpdating}
        />

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/planes"
            className="px-4 py-2 border border-border-primary bg-transparent text-text-muted hover:text-text-main hover:bg-surface-hover rounded-sm text-xs font-bold transition-colors"
          >
            Descartar
          </Link>
          <button
            type="submit"
            disabled={isUpdating}
            className="bg-brand-main hover:bg-brand-hover text-white flex items-center justify-center gap-2 px-6 py-2.5 rounded-sm font-medium text-sm transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Guardando...</span>
              </>
            ) : (
              <span>Guardar cambios</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
