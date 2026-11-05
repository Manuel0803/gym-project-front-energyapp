'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts';
import { PieChart } from 'lucide-react';
import { PlanDistributionItem } from '../interfaces/metrics.interface';

interface PlanDistributionCardProps {
  distribution: PlanDistributionItem[];
}

interface PieTooltipParam {
  name: string;
  value: number;
  percent: number;
  color: string;
}

const CHART_COLORS = [
  '#3b82f6', 
  '#10b981', 
  '#f59e0b',
  '#ef4444', 
  '#8b5cf6', 
  '#06b6d4', 
  '#f97316',
  '#ec4899', 
  '#14b8a6', 
];

export const PlanDistributionCard = ({ distribution }: PlanDistributionCardProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <section className="bg-surface border border-border-primary rounded-lg flex flex-col shadow-sm h-full transition-colors">
        <header className="flex items-center gap-3 border-b border-border-primary p-5 shrink-0">
          <div className="p-2 bg-brand-surface rounded-lg">
            <PieChart size={20} className="text-brand-main" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-main">Distribución de Planes</h3>
            <p className="text-xs text-text-muted">Suscripciones activas</p>
          </div>
        </header>
        <div className="flex-1 w-full flex items-center justify-center min-h-75 bg-surface-hover/30 rounded-b-lg animate-pulse">
          <span className="sr-only">Cargando gráfico de distribución de planes...</span>
        </div>
      </section>
    );
  }

  const isDark = theme === 'dark';
  const mainTextColor = isDark ? '#f3f4f6' : '#111827';
  const borderColor = isDark ? '#111827' : '#ffffff';

  const chartData = distribution.map((plan) => ({
    name: plan.name,
    value: plan.count,
  }));

  const option: EChartsOption = {
    color: CHART_COLORS,
    tooltip: {
      trigger: 'item',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      textStyle: { color: mainTextColor },
      formatter: (params: unknown) => {
        const payload = params as PieTooltipParam;
        return `
          <div class="font-bold mb-1">${payload.name}</div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full" style="background-color: ${payload.color}"></span>
            <span class="font-medium">${payload.value.toLocaleString('es-AR')} alumnos (${payload.percent}%)</span>
          </div>
        `;
      },
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: 'Planes',
        type: 'pie',
        radius: ['55%', '85%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: borderColor,
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        data: chartData,
      },
    ],
  };

  return (
    <section 
      className="bg-surface border border-border-primary rounded-lg flex flex-col shadow-sm h-full transition-colors overflow-hidden"
      aria-label="Gráfico de distribución de planes activos"
    >
      <header className="flex items-center justify-between p-5 border-b border-border-primary shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-surface rounded-lg">
            <PieChart size={20} className="text-brand-main" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-main">Distribución de Planes</h3>
            <p className="text-[11px] text-text-muted mt-0.5">Suscripciones activas</p>
          </div>
        </div>
        <div 
          className="text-xs font-bold text-brand-main bg-brand-surface px-2 py-0.5 rounded shadow-sm"
          title={`${distribution.length} planes activos`}
        >
          {distribution.length}
        </div>
      </header>

      {!distribution || distribution.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-text-muted min-h-75">
          <p className="text-sm font-medium">No hay suscripciones activas.</p>
          <p className="text-xs mt-1 text-center">Registra pagos de planes para ver la distribución.</p>
        </div>
      ) : (
        <div className="flex flex-col flex-1 min-h-0">
          <div 
            className="w-full h-55 shrink-0 pt-4"
            aria-hidden="true"
          >
            <ReactECharts
              option={option}
              style={{ height: '100%', width: '100%' }}
              notMerge={true}
              lazyUpdate={true}
            />
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 max-h-62.5 border-t border-border-primary/50 mt-2">
            <ul className="flex flex-col m-0 p-0 list-none">
              {distribution.map((plan, index) => {
                const color = CHART_COLORS[index % CHART_COLORS.length];
                return (
                  <li 
                    key={plan.name} 
                    className="flex items-center justify-between px-5 py-3 hover:bg-surface-hover transition-colors border-b border-border-primary/50 last:border-0"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-4">
                      <span 
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm" 
                        style={{ backgroundColor: color }} 
                        aria-hidden="true"
                      />
                      <span className="text-sm text-text-main font-medium truncate">
                        {plan.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm shrink-0">
                      <span className="text-text-muted">{plan.count}</span>
                      <span className="font-bold text-text-main w-11 text-right">{plan.percentage}%</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};
