import { Suspense } from 'react';
import { Metadata } from 'next';
import { StudentProfileView } from '@/features/student/components/StudentProfileView';
import { TableSkeleton } from '@/common/components/ui/skeletons/TableSkeleton';

export const metadata: Metadata = {
  title: 'Mi Perfil | Portal del Alumno',
  description:
    'Gestión restringida de perfil: foto, teléfono móvil y contacto de emergencia.',
};

export default function AlumnoPerfilPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <StudentProfileView />
    </Suspense>
  );
}
