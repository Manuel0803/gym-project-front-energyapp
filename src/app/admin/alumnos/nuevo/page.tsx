import { Metadata } from 'next';
import { NewMemberForm } from '@/features/members/components/NewMemberForm';

export const metadata: Metadata = {
  title: 'Nuevo Alumno | EnergyAPP',
  description: 'Registrar un nuevo alumno en el sistema del centro de entrenamiento.',
};

export default function NuevoAlumnoPage() {
  return (
    <main className="flex flex-col gap-6" aria-labelledby="new-alumno-title">
      <header className="flex flex-col">
        <h1 id="new-alumno-title" className="text-2xl font-bold text-text-main">
          Registrar Nuevo Alumno
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Ingrese los datos personales y de contacto del alumno a continuación.
        </p>
      </header>

      <NewMemberForm />
    </main>
  );
}
