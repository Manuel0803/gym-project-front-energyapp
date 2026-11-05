import { Calendar } from 'lucide-react';

interface MetricsHeaderProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

const currentYear = new Date().getFullYear();

const PERIOD_OPTIONS = [
  { value: 'rolling', label: 'Últimos 12 meses' },
  { value: String(currentYear), label: String(currentYear) },
  { value: String(currentYear - 1), label: String(currentYear - 1) },
];

export function MetricsHeader({
  selectedPeriod,
  onPeriodChange,
}: MetricsHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-wide transition-colors">
          Vista General
        </h1>
        <p className="text-sm text-text-muted mt-1 transition-colors">
          Métricas y analítica en tiempo real
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <nav 
          className="flex items-center gap-1"
          aria-label="Filtro de período de métricas"
        >
          <Calendar size={13} className="text-text-muted mr-0.5" aria-hidden="true" />
          {PERIOD_OPTIONS.map((option) => {
            const isActive = selectedPeriod === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onPeriodChange(option.value)}
                aria-pressed={isActive}
                className={`px-2.5 py-1 text-xs rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-main ${
                  isActive
                    ? 'text-brand-main bg-brand-surface border border-brand-main/30 font-semibold shadow-sm'
                    : 'text-text-muted hover:text-text-main hover:bg-surface-hover border border-transparent font-medium'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </nav>

        <div 
          className="px-3 py-1.5 bg-brand-surface border border-brand-main/20 rounded text-brand-main text-xs font-bold tracking-widest transition-colors flex items-center gap-2"
          role="status"
          aria-live="polite"
        >
          <span className="w-2 h-2 rounded-full bg-brand-main animate-pulse" aria-hidden="true"></span>
          DATOS EN VIVO
        </div>
      </div>
    </header>
  );
}
