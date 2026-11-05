import { Suspense } from 'react';
import { Metadata } from 'next';
import { MyStudentsView } from '@/features/professors/components/MyStudentsView';
import { TableSkeleton } from '@/common/components/ui/skeletons/TableSkeleton';

export const metadata: Metadata = {
  title: 'Mis Alumnos Asignados | Portal del Instructor',
  description:
    'Listado de alumnos a cargo para seguimiento de entrenamiento, contacto y armado de rutinas.',
};

export default function ProfesorMainPage() {
  return (
    <div className="flex flex-col gap-6" aria-labelledby="profesor-page-title">
      <header className="flex flex-col gap-1">
        <h1
          id="profesor-page-title"
          className="text-xl sm:text-2xl font-bold text-text-main"
        >
          Alumnos Asignados
        </h1>
        <p className="text-xs sm:text-sm text-text-muted transition-colors">
          Consulte los datos de perfil y contacto de sus alumnos a cargo y configure sus rutinas semanales.
        </p>
      </header>

      <Suspense fallback={<TableSkeleton />}>
        <MyStudentsView />
      </Suspense>
    </div>
  );
}
