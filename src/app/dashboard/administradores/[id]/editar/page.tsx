import { Metadata } from 'next';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { EditAdminForm } from '@/features/administrators/components/EditAdminForm';
import { UserCog } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Editar Administrador | EnergyAPP',
  description: 'Modificar los datos y credenciales de un administrador existente.',
};

interface EditAdminPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAdminPage({ params }: EditAdminPageProps) {
  const { id } = await params;

  return (
    <RoleGuard allowedRoles={['admin', 'super_admin']}>
      <main className="flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <UserCog className="text-brand-main" size={24} aria-hidden="true" />
            <h1 className="text-2xl font-bold text-text-main transition-colors">
              Editar Administrador
            </h1>
          </div>
          <p className="text-sm text-text-muted mt-1 transition-colors">
            Modifique la información y permisos de esta cuenta administrativa.
          </p>
        </header>

        <section>
          <EditAdminForm id={id} />
        </section>
      </main>
    </RoleGuard>
  );
}
