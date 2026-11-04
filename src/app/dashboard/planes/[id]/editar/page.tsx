import { Metadata } from 'next';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { EditPlanForm } from '@/features/plans/components/EditPlanForm';
import { Settings2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Editar Plan | EnergyAPP',
  description: 'Modifica las especificaciones, beneficios y el precio de un plan existente.',
};

interface EditPlanPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPlanPage({ params }: EditPlanPageProps) {
  const { id } = await params;

  return (
    <RoleGuard allowedRoles={['admin', 'super_admin']}>
      <main className="flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Settings2 className="text-brand-main" size={24} aria-hidden="true" />
            <h1 className="text-2xl font-bold text-text-main transition-colors">
              Editar Plan
            </h1>
          </div>
          <p className="text-sm text-text-muted transition-colors">
            Edite la información, precio y beneficios del plan seleccionado.
          </p>
        </header>

        <section>
          <EditPlanForm id={id} />
        </section>
      </main>
    </RoleGuard>
  );
}
