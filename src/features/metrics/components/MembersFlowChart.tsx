'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import ReactECharts from 'echarts-for-react';
import { buildMembersChartOptions } from '../utils/members-chart-options';
import { MembersFlowHeader } from './MembersFlowHeader';
import { MembersStatusFooter } from './MembersStatusFooter';
import { StatusDistribution, MemberTrajectoryItem } from '../interfaces/metrics.interface';

let hasAnimated = false;

export interface MembersFlowChartProps {
  data: MemberTrajectoryItem[];
  statusDistribution?: StatusDistribution;
  periodLabel?: string;
}

interface EChartsInstance {
  dispatchAction: (payload: { type: string; name: string }) => void;
}

export function MembersFlowChart({
  data = [],
  statusDistribution,
  periodLabel = '12 meses',
}: MembersFlowChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [shouldAnimate] = useState(!hasAnimated);

  useEffect(() => {
    hasAnimated = true;
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const totalNew = data.reduce((acc, curr) => acc + (curr.newMembers || 0), 0);
  const totalChurn = data.reduce(
    (acc, curr) => acc + (curr.churnedMembers || 0),
    0
  );
  const netGrowth = totalNew - totalChurn;

  if (!mounted) {
    return (
      <article className="bg-surface border border-border-primary rounded-xl p-6 h-full flex flex-col transition-colors shadow-sm">
        <MembersFlowHeader
          totalNew={totalNew}
          totalChurn={totalChurn}
          netGrowth={netGrowth}
          periodLabel={periodLabel}
        />
        <div className="w-full mt-2 min-h-75 flex items-center justify-center bg-surface-hover/30 rounded-lg animate-pulse">
          <span className="sr-only">Cargando gráfico de flujo de miembros...</span>
        </div>
        {statusDistribution && (
          <MembersStatusFooter distribution={statusDistribution} />
        )}
      </article>
    );
  }

  const option = buildMembersChartOptions({
    data,
    isDark: theme === 'dark',
    shouldAnimate,
  });

  const handleLegendSelectChanged = (
    params: { name: string; selected: Record<string, boolean> },
    instance?: EChartsInstance
  ) => {
    const isAllUnselected =
      !params.selected['Nuevas Altas'] && !params.selected['Bajas'];

    if (isAllUnselected && instance) {
      instance.dispatchAction({
        type: 'legendSelect',
        name: params.name,
      });
    }
  };

  return (
    <article 
      className="bg-surface border border-border-primary rounded-xl p-6 h-full flex flex-col transition-colors shadow-sm"
      aria-label="Gráfico interactivo de flujo de miembros"
    >
      <MembersFlowHeader
        totalNew={totalNew}
        totalChurn={totalChurn}
        netGrowth={netGrowth}
        periodLabel={periodLabel}
      />

      <div 
        className="w-full mt-2 flex-1 min-h-75"
        aria-hidden="true" 
      >
        <ReactECharts
          option={option}
          style={{ height: '100%', minHeight: '300px', width: '100%' }}
          notMerge={true}
          lazyUpdate={true}
          onEvents={{
            legendselectchanged: handleLegendSelectChanged,
          }}
        />
      </div>

      {statusDistribution && (
        <MembersStatusFooter distribution={statusDistribution} />
      )}
    </article>
  );
}
