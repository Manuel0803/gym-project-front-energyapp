'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthSession } from '../hooks/useAuthSession';
import { useAuthStore } from '../store/auth.store';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isHydrated, isAuthenticated, user } = useAuthSession();
  const requiresOnboarding = useAuthStore((state) => state.requiresOnboarding);
  const storeRole = useAuthStore((state) => state.role);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    const currentRole = (storeRole || user?.role || '').toString().toUpperCase();
    const isTrainer = currentRole === 'TRAINER' || currentRole === 'PROFESSOR' || currentRole === 'PROFESOR';
    const needsOnboarding = Boolean(requiresOnboarding || user?.requiresOnboarding);

    // Rule: Forced Onboarding
    if (needsOnboarding && pathname !== '/onboarding') {
      const isRestrictedRoute =
        pathname.startsWith('/alumno') ||
        pathname.startsWith('/admin') ||
        pathname.startsWith('/profesor') ||
        pathname.startsWith('/dashboard');

      if (isRestrictedRoute) {
        router.replace('/onboarding');
        return;
      }
    }

    // Rule: Role Protection for CUSTOMER
    if (currentRole === 'CUSTOMER') {
      const isRestrictedForCustomer =
        pathname.startsWith('/admin') ||
        pathname.startsWith('/profesor') ||
        pathname.startsWith('/dashboard');

      if (isRestrictedForCustomer) {
        router.replace('/alumno');
        return;
      }
    }

    // Rule: Role Protection for TRAINER
    if (isTrainer) {
      const isRestrictedForTrainer =
        pathname.startsWith('/admin') ||
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/super-admin');

      if (isRestrictedForTrainer) {
        router.replace('/profesor');
        return;
      }
    }
  }, [
    isHydrated,
    isAuthenticated,
    user,
    requiresOnboarding,
    storeRole,
    pathname,
    router,
  ]);

  if (!isHydrated || !isAuthenticated) {
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center bg-background"
        role="status"
        aria-live="polite"
      >
        <Loader2
          className="w-10 h-10 text-brand-main animate-spin mb-4"
          aria-hidden="true"
        />
        <p className="text-text-muted text-sm font-medium animate-pulse">
          Verificando sesión...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
