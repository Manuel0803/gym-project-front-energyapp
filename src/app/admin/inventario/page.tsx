import { Suspense } from 'react';
import { Metadata } from 'next';
import { InventoryView } from '@/features/inventory/components/InventoryView';
import { TableSkeleton } from '@/common/components/ui/skeletons/TableSkeleton';

export const metadata: Metadata = {
  title: 'Gestión de Inventario | EnergyAPP',
  description:
    'Administración integral de productos, stock, precios y categorías del gimnasio.',
};

export default function InventarioPage() {
  return (
    <main className="flex flex-col gap-6" aria-labelledby="inventario-page-title">
      <header className="flex flex-col gap-1">
        <h1
          id="inventario-page-title"
          className="text-2xl font-bold text-text-main"
        >
          Catálogo e Inventario
        </h1>
        <p className="text-sm text-text-muted transition-colors">
          Controle el stock de productos, administre categorías comerciales y configure alertas de stock crítico.
        </p>
      </header>

      <Suspense fallback={<TableSkeleton />}>
        <InventoryView />
      </Suspense>
    </main>
  );
}
