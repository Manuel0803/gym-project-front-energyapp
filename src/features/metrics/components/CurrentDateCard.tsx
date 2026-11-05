'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { MetricCard } from './MetricCard';

export function CurrentDateCard() {
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

  return (
    <MetricCard
      title="Fecha de Hoy"
      value={isHydrated ? dateTime.date : '--/--/----'}
      icon={<Calendar size={16} className="text-brand-main transition-colors" aria-hidden="true" />}
      trendText={isHydrated ? dateTime.time : 'Calculando...'}
      trendIcon={<Clock size={12} aria-hidden="true" />}
      trendColor="text-text-muted"
    />
  );
}
