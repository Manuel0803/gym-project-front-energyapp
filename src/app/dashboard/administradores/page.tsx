import { Metadata } from 'next';
import Link from 'next/link';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { AdminTable } from '@/features/administrators/components/AdminTable';
import { UserPlus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Administradores | EnergyAPP',
  description: 'Gestión de usuarios y administradores secundarios del sistema.',
};

export default function AdministratorsPage() {
  return (
    <RoleGuard allowedRoles={['admin', 'super_admin']}>
      <main className="flex flex-col gap-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-main transition-colors">
              Administradores
            </h1>
            <p className="text-sm text-text-muted mt-1 transition-colors">
              Gestione a los usuarios secundarios del sistema. Podrán administrar miembros y registrar pagos.
            </p>
          </div>
          
          <Link
            href="/dashboard/administradores/nuevo"
            className="bg-brand-main hover:bg-brand-hover text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <UserPlus size={16} aria-hidden="true" />
            <span>Nuevo Admin</span>
          </Link>
        </header>

        <section>
          <AdminTable />
        </section>
      </main>
    </RoleGuard>
  );
}
