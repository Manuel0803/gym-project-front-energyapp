import { Metadata } from 'next';
import { ProfesorShell } from '@/features/professors/components/ProfesorShell';

export const metadata: Metadata = {
  title: 'Portal del Instructor | EnergyAPP',
  description:
    'Gestión de alumnos asignados, armado visual de rutinas y catálogo de ejercicios del gimnasio.',
};

export default function ProfesorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProfesorShell>{children}</ProfesorShell>;
}
