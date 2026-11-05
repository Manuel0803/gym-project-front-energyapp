'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../hooks/useAuth';
import { LoginFormValues, loginSchema } from '../schemas/login.schema';
import { InputField } from '@/common/components/ui/InputField';
import { getSubdomain } from '@/common/utils/extract-subdomain';
import { Lock, EyeOff, Eye, Loader2, UserCheck, AlertCircle } from 'lucide-react';
import { ApiError } from '@/common/interfaces/api-error.interface';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error, isError } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    const domain = getSubdomain();

    login({
      identifier: data.identifier,
      password: data.password,
      domain,
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
      'Credenciales inválidas. Por favor verifique sus datos e intente nuevamente.'
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
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-danger-main" aria-hidden="true" />
          <div className="flex-1">
            <span className="font-semibold block mb-0.5">Error de autenticación</span>
            <span>{getBackendErrorMessage(error)}</span>
          </div>
        </div>
      )}

      <InputField
        label="CORREO ELECTRÓNICO O DNI"
        type="text"
        placeholder="ejemplo@correo.com o 12345678"
        disabled={isPending}
        registration={register('identifier')}
        error={errors.identifier?.message}
        icon={
          <UserCheck
            aria-hidden="true"
            className="text-text-muted transition-colors"
            size={16}
          />
        }
        className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_input]:bg-sidebar"
      />

      <InputField
        label="CONTRASEÑA"
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
        labelRightElement={
          <Link
            href="/recuperar-contrasenia"
            aria-disabled={isPending}
            tabIndex={isPending ? -1 : 0}
            className={`text-[12px] font-bold transition-colors ${
              isPending
                ? 'text-text-muted/50 pointer-events-none'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            ¿Has olvidado la contraseña?
          </Link>
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

      <button
        type="submit"
        disabled={isPending}
        aria-disabled={isPending}
        className="w-full bg-brand-main hover:bg-brand-hover disabled:bg-brand-main/50 text-white font-medium text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 shadow-md cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" size={16} aria-hidden="true" />
            <span>Iniciando...</span>
          </>
        ) : (
          <>
            <span>Iniciar Sesión</span>
            <span className="text-lg leading-none" aria-hidden="true">
              →
            </span>
          </>
        )}
      </button>
    </form>
  );
}
