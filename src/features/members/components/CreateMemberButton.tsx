'use client';

import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export function CreateMemberButton() {
  return (
    <Link
      href="/admin/alumnos/nuevo"
      className="bg-brand-main hover:bg-brand-hover text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors text-center flex items-center justify-center gap-2 shadow-sm"
    >
      <UserPlus size={16} aria-hidden="true" />
      <span>Nuevo Alumno</span>
    </Link>
  );
}
