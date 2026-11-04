import { Suspense } from 'react';
import { Metadata } from 'next';
import { StudentDashboardView } from '@/features/student/components/StudentDashboardView';
import { TableSkeleton } from '@/common/components/ui/skeletons/TableSkeleton';

export const metadata: Metadata = {
  title: 'Mi Membresía | Portal del Alumno',
  description:
    'Estado actual de cuota, días restantes y accesos rápidos a tu entrenamiento.',
};

export default function AlumnoDashboardPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <StudentDashboardView />
    </Suspense>
  );
}
