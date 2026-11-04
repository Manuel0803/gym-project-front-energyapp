import { Metadata } from 'next';
import { CreatePlanButton } from '@/features/plans/components/CreatePlanButton';
import { PlansGrid } from '@/features/plans/components/PlansGrid';

export const metadata: Metadata = {
  title: 'Planes | EnergyAPP',
  description: 'Gestione los planes de membresía y la estructura de precios del gimnasio.',
};

export default function PlansPage() {
  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-text-main transition-colors">
            Configuración de planes
          </h1>
          <p className="text-sm text-text-muted mt-1 transition-colors">
            Gestione los planes y la estructura de precios.
          </p>
        </div>

        <CreatePlanButton />
      </header>

      <section>
        <PlansGrid />
      </section>
    </main>
  );
}
