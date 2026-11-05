import { Metadata } from 'next';
import { SuperAdminShell } from '@/common/components/layout/SuperAdminShell';

export const metadata: Metadata = {
  title: 'Super Admin | EnergyAPP SaaS',
  description: 'Panel de administración global para gestión de gimnasios y planes.',
};

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperAdminShell>{children}</SuperAdminShell>;
}
