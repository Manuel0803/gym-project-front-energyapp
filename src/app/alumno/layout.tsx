import { Metadata } from 'next';
import { StudentShell } from '@/features/student/components/StudentShell';

export const metadata: Metadata = {
  title: 'Portal del Alumno | EnergyAPP',
  description:
    'Portal mobile-first para socios: estado de cuota, rutina de entrenamiento, medios de pago y perfil.',
};

export default function AlumnoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentShell>{children}</StudentShell>;
}
