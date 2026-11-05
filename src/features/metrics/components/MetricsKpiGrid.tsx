'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Wallet,
  AlertTriangle,
  TrendingUp,
  Clock,
  Calendar,
  Eye,
  EyeOff,
} from 'lucide-react';
import { MetricCard, MetricCardProps } from './MetricCard';
import { MetricsOverview } from '../interfaces/metrics.interface';
import { getTrendColor, getTrendText } from '../utils/trends-styles';

interface MetricsKpiGridProps {
  metrics: MetricsOverview;
  isRevenueVisible: boolean;
  onToggleRevenueVisible: () => void;
  canViewRevenue?: boolean;
}

const renderTrendIcon = (trend?: number) => (
  <TrendingUp
    size={12}
    className={trend && trend < 0 ? 'rotate-180 transform' : ''}
    aria-hidden="true"
  />
);

export function MetricsKpiGrid({
  metrics,
  isRevenueVisible,
  onToggleRevenueVisible,
  canViewRevenue = true,
}: MetricsKpiGridProps) {
  const [dateTime, setDateTime] = useState({ date: '', time: '' });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDateTime({
        date: now.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        time: now.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const isHydrated = dateTime.date !== '';

  const newToday = metrics.activeMembers.newToday ?? 0;
  const memberTrend = metrics.activeMembers.trend || 0;
  const revenueTrend = metrics.monthlyRevenue.trend || 0;

  const cards: MetricCardProps[] = [
    {
      title: 'Miembros Activos',
      value: metrics.activeMembers.total.toLocaleString('es-AR'),
      icon: <Users size={16} className="text-text-muted" aria-hidden="true" />,
      badge:
        newToday > 0 ? (
          <span
            className="text-xs font-semibold text-success-main tracking-tight"
            title="Miembros registrados hoy"
          >
            +{newToday} hoy
          </span>
        ) : null,
      trendText: getTrendText(memberTrend, 'vs mismo periodo mes anterior'),
      trendIcon: renderTrendIcon(memberTrend),
      trendColor: getTrendColor(memberTrend),
    },
    ...(canViewRevenue
      ? [
          {
            title: 'Ingresos Mensuales',
            value: isRevenueVisible
              ? `$${metrics.monthlyRevenue.total.toLocaleString('es-AR')}`
              : '****',
            icon: (
              <Wallet size={16} className="text-brand-main transition-colors" aria-hidden="true" />
            ),
            trendText: getTrendText(revenueTrend, 'vs mismo periodo mes anterior'),
            trendIcon: renderTrendIcon(revenueTrend),
            trendColor: getTrendColor(revenueTrend),
            action: (
              <button
                type="button"
                onClick={onToggleRevenueVisible}
                className="text-text-muted hover:text-text-main transition-colors ml-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-main rounded"
                aria-label={isRevenueVisible ? 'Ocultar ingresos mensuales' : 'Mostrar ingresos mensuales'}
                title={isRevenueVisible ? 'Ocultar ingresos' : 'Mostrar ingresos'}
              >
                {isRevenueVisible ? <EyeOff size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}
              </button>
            ),
          },
        ]
      : []),
    {
      title: 'Cuentas Vencidas',
      value: metrics.overdueAccounts.total.toLocaleString('es-AR'),
      icon: (
        <AlertTriangle
          size={16}
          className="text-danger-main transition-colors"
          aria-hidden="true"
        />
      ),
      trendText: 'Requieren atención',
      trendIcon: <AlertTriangle size={12} aria-hidden="true" />,
      trendColor: 'text-danger-main',
    },
    {
      title: 'Fecha de Hoy',
      value: isHydrated ? dateTime.date : '--/--/----',
      icon: (
        <Calendar size={16} className="text-brand-main transition-colors" aria-hidden="true" />
      ),
      trendText: isHydrated ? dateTime.time : 'Calculando...',
      trendIcon: <Clock size={12} aria-hidden="true" />,
      trendColor: 'text-text-muted',
    },
  ];

  return (
    <section
      className={`grid gap-4 ${
        canViewRevenue
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
          : 'grid-cols-1 md:grid-cols-3'
      }`}
      aria-label="Indicadores clave de rendimiento"
    >
      {cards.map((card) => (
        <MetricCard key={card.title} {...card} />
      ))}
    </section>
  );
}
