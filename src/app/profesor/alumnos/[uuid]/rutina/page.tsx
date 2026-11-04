import { Suspense } from 'react';
import { Metadata } from 'next';
import { RoutineBuilderView } from '@/features/routines/components/RoutineBuilderView';
import { TableSkeleton } from '@/common/components/ui/skeletons/TableSkeleton';

export const metadata: Metadata = {
  title: 'Constructor Visual de Rutinas | Portal del Instructor',
  description:
    'Planificación, asignación y configuración visual de la rutina semanal de ejercicios para el alumno.',
};

export default async function RoutineConstructorPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  return (
    <main aria-label="Constructor de Rutina de Entrenamiento">
      <Suspense fallback={<TableSkeleton />}>
        <RoutineBuilderView memberUuid={uuid} />
      </Suspense>
    </main>
  );
}
