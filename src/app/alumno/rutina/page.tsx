import { Suspense } from 'react';
import { Metadata } from 'next';
import { StudentRoutineView } from '@/features/student/components/StudentRoutineView';
import { TableSkeleton } from '@/common/components/ui/skeletons/TableSkeleton';

export const metadata: Metadata = {
  title: 'Mi Rutina | Portal del Alumno',
  description:
    'Visor de entrenamiento móvil de solo lectura con ejercicios, series, repeticiones y descansos.',
};

export default function AlumnoRutinaPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <StudentRoutineView />
    </Suspense>
  );
}
