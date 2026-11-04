'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOnboarding } from '../hooks/useAuth';
import {
  OnboardingFormValues,
  onboardingSchema,
} from '../schemas/onboarding.schema';
import { InputField } from '@/common/components/ui/InputField';
import { Mail, Lock, EyeOff, Eye, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { ApiError } from '@/common/interfaces/api-error.interface';

export function OnboardingForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: completeOnboarding, isPending, error, isError } = useOnboarding();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: OnboardingFormValues) => {
    completeOnboarding({
      email: data.email,
      password: data.password,
    });
  };

  const getBackendErrorMessage = (err: unknown): string => {
    const apiError = err as ApiError;
    const message = apiError?.response?.data?.message;
    if (Array.isArray(message)) {
      return message.join('. ');
    }
    return (
      message ||
      apiError?.response?.data?.error ||
      'No se pudo completar la configuración inicial. Verifica los datos e inténtalo nuevamente.'
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {isError && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-3.5 rounded-lg bg-danger-surface border border-danger-main/30 text-danger-main text-xs flex items-start gap-2.5 animate-fadeIn"
        >
          <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <span className="font-semibold block mb-0.5">Error en la configuración</span>
            <span>{getBackendErrorMessage(error)}</span>
          </div>
        </div>
      )}

      {/* Field: Nuevo Correo Electrónico */}
      <InputField
        label="NUEVO CORREO ELECTRÓNICO"
        type="email"
        placeholder="tu-correo@ejemplo.com"
        disabled={isPending}
        registration={register('email')}
        error={errors.email?.message}
        icon={
          <Mail
            aria-hidden="true"
            className="text-text-muted transition-colors"
            size={16}
          />
        }
        className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_input]:bg-sidebar"
      />

      {/* Field: Nueva Contraseña */}
      <InputField
        label="NUEVA CONTRASEÑA"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        disabled={isPending}
        registration={register('password')}
        error={errors.password?.message}
        icon={
          <Lock
            aria-hidden="true"
            className="text-text-muted transition-colors"
            size={16}
          />
        }
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isPending}
            aria-label={
              showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
            }
            className="text-text-muted hover:text-text-main transition-colors focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showPassword ? (
              <Eye size={16} aria-hidden="true" />
            ) : (
              <EyeOff size={16} aria-hidden="true" />
            )}
          </button>
        }
        className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_input]:bg-sidebar"
      />

      {/* Field: Confirmar Nueva Contraseña */}
      <InputField
        label="CONFIRMAR NUEVA CONTRASEÑA"
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="••••••••"
        disabled={isPending}
        registration={register('confirmPassword')}
        error={errors.confirmPassword?.message}
        icon={
          <Lock
            aria-hidden="true"
            className="text-text-muted transition-colors"
            size={16}
          />
        }
        rightElement={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isPending}
            aria-label={
              showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
            }
            className="text-text-muted hover:text-text-main transition-colors focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showConfirmPassword ? (
              <Eye size={16} aria-hidden="true" />
            ) : (
              <EyeOff size={16} aria-hidden="true" />
            )}
          </button>
        }
        className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_input]:bg-sidebar"
      />

      {/* Submit Button - Note: Strictly NO skip button */}
      <button
        type="submit"
        disabled={isPending}
        aria-disabled={isPending}
        className="w-full bg-brand-main hover:bg-brand-hover disabled:bg-brand-main/50 text-white font-semibold text-sm py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 shadow-md cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" size={16} aria-hidden="true" />
            <span>Actualizando credenciales...</span>
          </>
        ) : (
          <>
            <span>Completar Configuración</span>
            <ArrowRight size={16} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
