import { Metadata } from 'next';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { NewPlanForm } from '@/features/plans/components/NewPlanForm';
import { PlusCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Crear Plan | EnergyAPP',
  description: 'Crea un nuevo plan de membresía y establece su estructura de precios.',
};

export default function CreatePlanPage() {
  return (
    <RoleGuard allowedRoles={['admin', 'super_admin']}>
      <main className="flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <PlusCircle className="text-brand-main" size={24} aria-hidden="true" />
            <h1 className="text-2xl font-bold text-text-main transition-colors">
              Crear Nuevo Plan
            </h1>
          </div>
          <p className="text-sm text-text-muted transition-colors">
            Complete la información para registrar una nueva membresía en el sistema.
          </p>
        </header>
        
        <section>
          <NewPlanForm />
        </section>
      </main>
    </RoleGuard>
  );
}
