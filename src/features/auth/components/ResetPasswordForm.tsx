'use client';

import { useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResetPassword } from '../hooks/useAuth';
import { InputField } from '@/common/components/ui/InputField';
import { ApiError } from '@/common/interfaces/api-error.interface';
import { toast } from 'react-hot-toast';
import { Lock, Save, Loader2 } from 'lucide-react';
import {
  resetPasswordSchema,
  ResetPasswordValues,
} from '../schemas/reset-password.schema';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const { mutate: resetPassword, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ResetPasswordValues) => {
    if (!token) {
      toast.error('Token de seguridad no válido');
      return;
    }

    resetPassword(
      { token, newPassword: data.newPassword },
      {
        onSuccess: (response) => {
          toast.success(response.message || 'Contraseña actualizada con éxito');
          router.push('/login');
        },
        onError: (error: unknown) => {
          const apiError = error as ApiError;
          console.error('[ResetPasswordForm] Failed to reset password:', apiError);
          const message = apiError.response?.data?.message;
          toast.error(
            Array.isArray(message)
              ? message[0]
              : (message || 'El enlace es inválido o ha expirado')
          );
        },
      }
    );
  };

  if (!token) {
    return (
      <div 
        className="bg-danger-main/10 border border-danger-main/20 text-danger-main p-4 rounded-lg text-center text-sm"
        role="alert"
      >
        Enlace inválido o expirado. Por favor, solicita uno nuevo desde la
        pantalla de inicio de sesión.
      </div>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-5"
      noValidate
    >
      <InputField
        label="NUEVA CONTRASEÑA"
        type="password"
        placeholder="••••••••"
        disabled={isPending}
        registration={register('newPassword')}
        error={errors.newPassword?.message}
        icon={<Lock aria-hidden="true" className="text-text-muted transition-colors" size={16} />}
        className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_input]:bg-sidebar"
      />

      <InputField
        label="CONFIRMAR CONTRASEÑA"
        type="password"
        placeholder="••••••••"
        disabled={isPending}
        registration={register('confirmPassword')}
        error={errors.confirmPassword?.message}
        icon={<Lock aria-hidden="true" className="text-text-muted transition-colors" size={16} />}
        className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_input]:bg-sidebar"
      />

      <button
        type="submit"
        disabled={isPending}
        aria-disabled={isPending}
        className="w-full bg-brand-main hover:bg-brand-hover text-white font-medium text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 shadow-md disabled:opacity-50 cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 size={16} aria-hidden="true" className="animate-spin" />
            <span>Guardando...</span>
          </>
        ) : (
          <>
            <Save size={16} aria-hidden="true" /> 
            <span>Guardar e iniciar sesión</span>
          </>
        )}
      </button>
    </form>
  );
}
