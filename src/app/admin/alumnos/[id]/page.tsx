import { Metadata } from 'next';
import MemberDetailClient from '@/features/members/components/MemberDetailClient';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Detalle del Alumno | EnergyAPP',
    description:
      'Información detallada, suscripciones activas e historial de pagos del alumno.',
  };
}

export default async function AlumnoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main aria-label="Vista detallada del alumno">
      <MemberDetailClient id={id} />
    </main>
  );
}
