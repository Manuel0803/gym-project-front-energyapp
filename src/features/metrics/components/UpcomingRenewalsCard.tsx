import { ClipboardList } from 'lucide-react';
import { UpcomingRenewal } from '../interfaces/metrics.interface';
import { RenewalItem } from './RenewalItem';

interface UpcomingRenewalsCardProps {
  renewals: UpcomingRenewal[];
}

export function UpcomingRenewalsCard({ renewals }: UpcomingRenewalsCardProps) {
  return (
    <section 
      className="bg-surface border border-border-primary rounded-lg flex flex-col transition-colors overflow-hidden h-full shadow-sm"
      aria-labelledby="upcoming-renewals-title"
    >
      <header className="flex items-center justify-between p-5 border-b border-border-primary shrink-0">
        <h2 id="upcoming-renewals-title" className="text-sm font-bold text-text-main transition-colors flex items-center gap-2">
          <ClipboardList aria-hidden="true"/>  Próximos Vencimientos (5 días)
        </h2>
        <div 
          className="text-xs font-bold text-brand-main bg-brand-surface px-2 py-0.5 rounded shadow-sm"
          aria-label={`${renewals.length} vencimientos próximos`}
          title={`${renewals.length} vencimientos próximos`}
        >
          {renewals.length}
        </div>
      </header>

      <div className="flex-1 p-0 overflow-y-auto min-h-0 relative max-h-100">
        <div 
          className="flex items-center justify-between px-5 py-3 border-b border-border-primary text-[10px] font-bold text-text-muted tracking-widest uppercase sticky top-0 bg-surface z-10 backdrop-blur-sm"
          aria-hidden="true"
        >
          <span>Miembro</span>
          <span>Plan</span>
        </div>

        {renewals.length === 0 ? (
          <div className="p-6 text-center text-sm text-text-muted flex-1 flex items-center justify-center">
            No hay vencimientos próximos.
          </div>
        ) : (
          <ul className="flex flex-col m-0 p-0 list-none">
            {renewals.map((renewal, index) => (
              <li key={renewal.id} className="w-full">
                <RenewalItem
                  id={renewal.id}
                  initials={renewal.initials}
                  name={renewal.name}
                  plan={renewal.plan}
                  daysText={`${renewal.daysLeft}d`}
                  isUrgent={renewal.isUrgent}
                  hasBorder={index !== renewals.length - 1}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
