import { Metadata } from 'next';
import { MetricsOverviewClient } from '@/features/metrics/components/MetricsOverviewClient';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Vista general, métricas, finanzas y analíticas en tiempo real del gimnasio.',
};

export default function DashboardPage() {
  return (
    <main aria-label="Panel de Métricas Principales">
      <MetricsOverviewClient />
    </main>
  );
}
