import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import {
  AuthResponse,
  OnboardingResponse,
} from '../interfaces/auth.interface';
import { ApiError } from '@/common/interfaces/api-error.interface';
import toast from 'react-hot-toast';
import { AuthService } from '../services/auth.service';
import { decodeJwt } from '@/common/utils/jwt.utils';

export const useLogin = () => {
  const setLogin = useAuthStore((state) => state.setLogin);
  const router = useRouter();

  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data: AuthResponse, variables) => {
      setLogin(data, variables.domain);

      const decoded = decodeJwt(data.access_token);
      const requiresOnboarding =
        typeof decoded?.requiresOnboarding === 'boolean'
          ? decoded.requiresOnboarding
          : (data.user?.requiresOnboarding ?? false);

      const role = (decoded?.role || data.user?.role || '').toString().toUpperCase();

      toast.success(`¡Bienvenido, ${data.user?.name || 'Usuario'}!`);

      if (requiresOnboarding) {
        router.push('/onboarding');
      } else if (role === 'CUSTOMER') {
        router.push('/alumno');
      } else if (role === 'SUPER_ADMIN') {
        router.push('/super-admin/gimnasios');
      } else if (role === 'TRAINER' || role === 'PROFESSOR' || role === 'PROFESOR') {
        router.push('/profesor');
      } else {
        router.push('/dashboard');
      }
    },
    onError: (error: ApiError) => {
      console.error('[useAuth] Login failed:', error);
      const message = error?.response?.data?.message;
      const errorText = Array.isArray(message)
        ? message.join(', ')
        : message || error?.response?.data?.error || 'Credenciales inválidas. Por favor verifique sus datos.';
      toast.error(errorText);
    },
  });
};

export const useOnboarding = () => {
  const setOnboardingComplete = useAuthStore(
    (state) => state.setOnboardingComplete
  );
  const router = useRouter();

  return useMutation({
    mutationFn: AuthService.onboarding,
    onSuccess: (data: OnboardingResponse) => {
      setOnboardingComplete({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
      toast.success('¡Perfil configurado con éxito! Bienvenido.');
      router.replace('/alumno');
    },
    onError: (error: ApiError) => {
      console.error('[useAuth] Onboarding failed:', error);
      const message = error?.response?.data?.message;
      const errorText = Array.isArray(message)
        ? message.join(', ')
        : message ||
          error?.response?.data?.error ||
          'Error al completar la configuración inicial. Inténtalo nuevamente.';
      toast.error(errorText);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: AuthService.forgotPassword,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: AuthService.resetPassword,
  });
};
