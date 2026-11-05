import { redirect } from 'next/navigation';

export default async function LegacyEditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/alumnos/${id}/editar`);
}
