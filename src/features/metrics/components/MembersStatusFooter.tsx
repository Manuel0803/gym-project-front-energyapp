import { StatusDistribution } from '../interfaces/metrics.interface';

interface MembersStatusFooterProps {
  distribution: StatusDistribution;
}

export function MembersStatusFooter({
  distribution,
}: MembersStatusFooterProps) {
  return (
    <footer 
      className="mt-4 pt-3 border-t border-border-primary flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted"
      aria-label="Resumen del estado actual de miembros"
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold text-text-main">
          Estado actual del gimnasio:
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5" title="Miembros con plan activo">
          <span className="w-2 h-2 rounded-full bg-success-main" aria-hidden="true"></span>
          <strong className="text-text-main">
            {distribution.active.toLocaleString('es-AR')}
          </strong>{' '}
          Activos
        </span>
        <span className="flex items-center gap-1.5" title="Miembros con pagos pendientes o planes suspendidos">
          <span className="w-2 h-2 rounded-full bg-warning-main" aria-hidden="true"></span>
          <strong className="text-text-main">
            {distribution.suspended.toLocaleString('es-AR')}
          </strong>{' '}
          Vencidos / Suspendidos
        </span>
        <span className="flex items-center gap-1.5" title="Miembros dados de baja del sistema">
          <span className="w-2 h-2 rounded-full bg-text-muted" aria-hidden="true"></span>
          <strong className="text-text-main">
            {distribution.inactive.toLocaleString('es-AR')}
          </strong>{' '}
          Inactivos
        </span>
      </div>
    </footer>
  );
}
