import { redirect } from 'next/navigation';

export default async function ProfesorAlumnoDetailPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  redirect(`/profesor/alumnos/${uuid}/rutina`);
}
