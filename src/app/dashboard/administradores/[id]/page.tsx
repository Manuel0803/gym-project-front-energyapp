import { redirect } from 'next/navigation';

export default async function AdminDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/administradores/${id}/editar`);
}
