import { Suspense } from 'react';
import { Metadata } from 'next';
import { CreateMemberButton } from '@/features/members/components/CreateMemberButton';
import { MembersDirectory } from '@/features/members/components/MembersDirectory';
import { TableSkeleton } from '@/common/components/ui/skeletons/TableSkeleton';

export const metadata: Metadata = {
  title: 'Padrón de Socios | EnergyAPP',
  description:
    'Gestión y administración integral de socios, membresías y suscripciones del gimnasio.',
};

export default function AlumnosDirectoryPage() {
  return (
    <main className="flex flex-col gap-6" aria-labelledby="alumnos-page-title">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 id="alumnos-page-title" className="text-2xl font-bold text-text-main">
            Padrón de Socios
          </h1>
          <p className="text-sm text-text-muted transition-colors">
            Administre el padrón societario, estados de membresía y datos personales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CreateMemberButton />
        </div>
      </header>

      <Suspense fallback={<TableSkeleton />}>
        <MembersDirectory />
      </Suspense>
    </main>
  );
}
