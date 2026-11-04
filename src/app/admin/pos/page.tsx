import { Suspense } from 'react';
import { Metadata } from 'next';
import { PosView } from '@/features/pos/components/PosView';
import { TableSkeleton } from '@/common/components/ui/skeletons/TableSkeleton';

export const metadata: Metadata = {
  title: 'Punto de Venta (POS) | EnergyAPP',
  description:
    'Terminal de ventas y caja registradora para comercialización ágil de productos del gimnasio.',
};

export default function PosPage() {
  return (
    <main className="flex flex-col gap-6" aria-labelledby="pos-page-title">
      <header className="flex flex-col gap-1">
        <h1 id="pos-page-title" className="text-2xl font-bold text-text-main">
          Punto de Venta (POS)
        </h1>
        <p className="text-sm text-text-muted transition-colors">
          Caja registradora para venta directa de productos de mostrador, suplementos y bebidas.
        </p>
      </header>

      <Suspense fallback={<TableSkeleton />}>
        <PosView />
      </Suspense>
    </main>
  );
}
