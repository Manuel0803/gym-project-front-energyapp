import { Metadata } from 'next';
import { EditMemberForm } from '@/features/members/components/EditMemberForm';

export const metadata: Metadata = {
  title: 'Editar Alumno | EnergyAPP',
  description: 'Modificar los datos personales y de contacto del alumno.',
};

export default async function EditAlumnoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="flex flex-col gap-6" aria-labelledby="edit-alumno-title">
      <header className="flex flex-col">
        <h1 id="edit-alumno-title" className="text-2xl font-bold text-text-main">
          Editar Alumno
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Modifique los datos del alumno y actualice su información a continuación.
        </p>
      </header>

      <EditMemberForm id={id} />
    </main>
  );
}
