import { UserPlus, UserMinus, Activity } from 'lucide-react';

interface MembersFlowHeaderProps {
  totalNew: number;
  totalChurn: number;
  netGrowth: number;
  periodLabel?: string;
}

export function MembersFlowHeader({
  totalNew,
  totalChurn,
  netGrowth,
  periodLabel = '12 meses',
}: MembersFlowHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
      <div>
        <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
          Flujo de Miembros
          <span className="text-xs font-normal text-text-muted">
            (Altas vs Bajas)
          </span>
        </h3>
        <p className="text-sm text-text-muted">
          Evolución de nuevos registros vs miembros que no renovaron ({periodLabel})
        </p>
      </div>

      <div 
        className="flex items-center gap-3 bg-surface-hover/60 border border-border-primary px-3 py-1.5 rounded-lg text-xs shadow-sm"
        aria-label="Resumen de crecimiento neto"
      >
        <div
          className="flex items-center gap-1.5 text-success-main font-semibold"
          title="Total nuevas altas en el período"
        >
          <UserPlus size={14} aria-hidden="true" />
          <span>+{totalNew.toLocaleString('es-AR')}</span>
        </div>
        <span className="text-border-primary" aria-hidden="true">|</span>
        <div
          className="flex items-center gap-1.5 text-danger-main font-semibold"
          title="Total bajas en el período"
        >
          <UserMinus size={14} aria-hidden="true" />
          <span>-{totalChurn.toLocaleString('es-AR')}</span>
        </div>
        <span className="text-border-primary" aria-hidden="true">|</span>
        <div
          className={`flex items-center gap-1.5 font-bold ${
            netGrowth >= 0 ? 'text-brand-main' : 'text-danger-main'
          }`}
          title="Crecimiento neto"
        >
          <Activity size={14} aria-hidden="true" />
          <span>
            {netGrowth >= 0 ? `+${netGrowth.toLocaleString('es-AR')}` : netGrowth.toLocaleString('es-AR')} neto
          </span>
        </div>
      </div>
    </header>
  );
}
