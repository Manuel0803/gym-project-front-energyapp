'use client';

import { useState } from 'react';
import { useMetricsOverview } from '@/features/metrics/hooks/useMetrics';
import { useRole } from '@/features/auth/hooks/useRole';
import { DashboardSkeleton } from '@/common/components/ui/skeletons/DashboardSkeleton';
import { RevenueChart } from '@/features/metrics/components/RevenueChart';
import { MembersFlowChart } from '@/features/metrics/components/MembersFlowChart';
import { UpcomingRenewalsCard } from '@/features/metrics/components/UpcomingRenewalsCard';
import { UpcomingBirthdaysCard } from '@/features/metrics/components/UpcomingBirthdaysCard';
import { EyeOff } from 'lucide-react';
import { PlanDistributionCard } from '@/features/metrics/components/PlanDistributionCard';
import { MetricsHeader } from '@/features/metrics/components/MetricsHeader';
import { MetricsKpiGrid } from '@/features/metrics/components/MetricsKpiGrid';

export function MetricsOverviewClient() {
  const { isUser } = useRole();
  const canViewRevenue = !isUser;
  
  const [selectedPeriod, setSelectedPeriod] = useState('rolling');
  const [isRevenueVisible, setIsRevenueVisible] = useState(true);
  
  const { data: metrics, isLoading, isError } = useMetricsOverview(selectedPeriod);

  if (isLoading) {
    return <DashboardSkeleton canViewRevenue={canViewRevenue} />;
  }

  if (isError || !metrics) {
    return (
      <div className="flex flex-col gap-6" role="alert">
        <h1 className="text-2xl font-bold text-text-main">Vista General</h1>
        <p className="text-sm text-danger-main bg-danger-surface p-4 rounded-md border border-danger-main/30">
          Error al cargar las métricas. Intente nuevamente.
        </p>
      </div>
    );
  }

  const periodLabel =
    selectedPeriod === 'rolling' ? '12 meses' : `Año ${selectedPeriod}`;

  return (
    <div className="flex flex-col gap-6">
      <MetricsHeader
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      <MetricsKpiGrid
        metrics={metrics}
        isRevenueVisible={isRevenueVisible}
        onToggleRevenueVisible={() => setIsRevenueVisible(!isRevenueVisible)}
        canViewRevenue={canViewRevenue}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {canViewRevenue && (
            <div className="relative flex flex-col">
              <div
                className={`${!isRevenueVisible ? 'filter blur-md select-none transition-all duration-300 opacity-50 pointer-events-none' : 'transition-all duration-300'}`}
                aria-hidden={!isRevenueVisible}
              >
                <RevenueChart
                  data={metrics.revenueTrajectory || []}
                  periodLabel={periodLabel}
                />
              </div>
              {!isRevenueVisible && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <span className="bg-background/80 border border-border-primary px-4 py-2 rounded-full text-sm font-bold text-text-main flex items-center gap-2 backdrop-blur-md shadow-lg">
                    <EyeOff size={16} aria-hidden="true" /> Gráfico Oculto
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="transition-all duration-300">
            <MembersFlowChart
              data={metrics.membersTrajectory || []}
              statusDistribution={metrics.statusDistribution}
              periodLabel={periodLabel}
            />
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <UpcomingRenewalsCard renewals={metrics.upcomingRenewals} />
          <UpcomingBirthdaysCard birthdays={metrics.upcomingBirthdays} />
          <PlanDistributionCard distribution={metrics.planDistribution || []} />
        </aside>
      </div>
    </div>
  );
}
