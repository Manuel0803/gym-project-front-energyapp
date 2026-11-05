import { redirect } from 'next/navigation';

export default function LegacyNewMemberPage() {
  redirect('/admin/alumnos/nuevo');
}
