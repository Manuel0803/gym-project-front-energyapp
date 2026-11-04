import { redirect } from 'next/navigation';

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/planes/${id}/editar`);
}
