import { Suspense } from 'react';
import { Metadata } from 'next';
import { ExercisesCatalogView } from '@/features/exercises/components/ExercisesCatalogView';
import { TableSkeleton } from '@/common/components/ui/skeletons/TableSkeleton';

export const metadata: Metadata = {
  title: 'Catálogo de Ejercicios | Portal del Instructor',
  description:
    'Catálogo híbrido de ejercicios globales y locales del gimnasio clasificados por grupo muscular.',
};

export default function ProfesorEjerciciosPage() {
  return (
    <main className="flex flex-col gap-6" aria-labelledby="ejercicios-page-title">
      <header className="flex flex-col gap-1">
        <h1
          id="ejercicios-page-title"
          className="text-xl sm:text-2xl font-bold text-text-main"
        >
          Catálogo Híbrido de Ejercicios
        </h1>
        <p className="text-xs sm:text-sm text-text-muted transition-colors">
          Explore los ejercicios del sistema global y registre variantes personalizadas de su gimnasio.
        </p>
      </header>

      <Suspense fallback={<TableSkeleton />}>
        <ExercisesCatalogView />
      </Suspense>
    </main>
  );
}
