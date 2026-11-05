import { Suspense } from 'react';
import { Metadata } from 'next';
import { StudentPaymentsView } from '@/features/student/components/StudentPaymentsView';
import { TableSkeleton } from '@/common/components/ui/skeletons/TableSkeleton';

export const metadata: Metadata = {
  title: 'Medios de Pago | Portal del Alumno',
  description:
    'CBU, Alias y datos bancarios oficiales para transferencia y renovación de membresía.',
};

export default function AlumnoPagosPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <StudentPaymentsView />
    </Suspense>
  );
}
