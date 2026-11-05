'use client';

import Link from 'next/link';
import { useRole } from '@/features/auth/hooks/useRole';
import { Plus } from 'lucide-react';

export function CreatePlanButton() {
  const { isAdmin, isSuperAdmin } = useRole();

  if (!isAdmin && !isSuperAdmin) {
    return null;
  }

  return (
    <Link
      href="/dashboard/planes/nuevo"
      className="bg-brand-main hover:bg-brand-hover text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
    >
      <Plus size={16} aria-hidden="true" />
      <span>Nuevo Plan</span>
    </Link>
  );
}
