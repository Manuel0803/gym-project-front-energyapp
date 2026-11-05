'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '../hooks/useRole';
import { Loader2 } from 'lucide-react';

export interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { role } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (role && !allowedRoles.includes(role)) {
      router.replace('/dashboard');
    }
  }, [role, allowedRoles, router]);

  if (!allowedRoles.includes(role)) {
    return (
      <div 
        className="h-64 flex flex-col items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <Loader2 
          className="w-8 h-8 animate-spin text-brand-main mb-4" 
          aria-hidden="true" 
        />
        <p className="text-text-muted text-sm font-medium animate-pulse">
          Verificando permisos...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
