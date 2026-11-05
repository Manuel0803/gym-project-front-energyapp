'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import ReactECharts from 'echarts-for-react';
import { buildRevenueChartOptions } from '../utils/revenue-chart-options';
import { RevenueTrajectoryItem } from '../interfaces/metrics.interface';

let hasAnimated = false;

export interface RevenueChartProps {
  data: RevenueTrajectoryItem[];
  periodLabel?: string;
}

export function RevenueChart({
  data,
  periodLabel = '12 meses',
}: RevenueChartProps) {
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

  if (!mounted) {
    return (
      <article className="bg-surface border border-border-primary rounded-xl p-6 h-full flex flex-col shadow-sm">
        <header className="mb-4">
          <h3 className="text-lg font-bold text-text-main">
            Trayectoria de Ingresos
          </h3>
          <p className="text-sm text-text-muted">
            Evolución de recaudación ({periodLabel})
          </p>
        </header>
        <div className="w-full mt-4 min-h-75 flex items-center justify-center bg-surface-hover/30 rounded-lg animate-pulse">
          <span className="sr-only">Cargando gráfico...</span>
        </div>
      </article>
    );
  }

  const option = buildRevenueChartOptions({
    data,
    isDark: theme === 'dark',
    shouldAnimate,
  });

  return (
    <article 
      className="bg-surface border border-border-primary rounded-xl p-6 h-full flex flex-col shadow-sm"
      aria-label="Gráfico de trayectoria de ingresos"
    >
      <header className="mb-4">
        <h3 className="text-lg font-bold text-text-main">
          Trayectoria de Ingresos
        </h3>
        <p className="text-sm text-text-muted">
          Evolución de recaudación ({periodLabel})
        </p>
      </header>
      
      <div 
        className="w-full mt-4 flex-1 min-h-75" 
        aria-hidden="true"
      >
        <ReactECharts
          option={option}
          style={{ height: '100%', minHeight: '300px', width: '100%' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    </article>
  );
}
