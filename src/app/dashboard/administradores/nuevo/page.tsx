import { Metadata } from 'next';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { NewAdminForm } from '@/features/administrators/components/NewAdminForm';
import { UserPlus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nuevo Administrador | EnergyAPP',
  description: 'Crear una nueva cuenta de administrador para el sistema.',
};

export default function NuevoAdminPage() {
  return (
    <RoleGuard allowedRoles={['admin', 'super_admin']}>
      <main className="flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <UserPlus className="text-brand-main" size={24} aria-hidden="true" />
            <h1 className="text-2xl font-bold text-text-main transition-colors">
              Agregar Nuevo Administrador
            </h1>
          </div>
          <p className="text-sm text-text-muted mt-1 transition-colors">
            Complete los datos del administrador secundario para crear su cuenta y asignarle acceso.
          </p>
        </header>

        <section>
          <NewAdminForm />
        </section>
      </main>
    </RoleGuard>
  );
}
