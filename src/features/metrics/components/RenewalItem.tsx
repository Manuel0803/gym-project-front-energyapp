import Link from 'next/link';

export interface RenewalItemProps {
  id: string;
  initials: string;
  name: string;
  plan: string;
  daysText: string;
  isUrgent?: boolean;
  hasBorder?: boolean;
}

export function RenewalItem({
  id,
  initials,
  name,
  plan,
  daysText,
  isUrgent = false,
  hasBorder = true,
}: RenewalItemProps) {
  const borderClass = hasBorder ? 'border-b border-border-primary' : '';
  const daysColorClass = isUrgent ? 'text-danger-main font-bold' : 'text-text-muted font-medium';

  return (
    <Link
      href={`/admin/alumnos/${id}`}
      className={`flex items-center justify-between px-5 py-4 hover:bg-surface-hover transition-colors cursor-pointer w-full focus:outline-none focus-visible:bg-surface-hover focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-main ${borderClass}`}
      aria-label={`Ver perfil de ${name}. ${isUrgent ? 'Vencimiento urgente:' : 'Vence en:'} ${daysText}`}
      title={`Ver perfil de ${name}`}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-7 h-7 rounded-full bg-background border border-border-primary flex items-center justify-center text-xs font-bold text-text-muted transition-colors shadow-sm"
          aria-hidden="true"
        >
          {initials}
        </div>
        <span className="text-sm font-medium text-text-main transition-colors">
          {name}
        </span>
      </div>
      
      <div className="flex items-center gap-3 text-sm">
        <span className="text-text-muted transition-colors">
          {plan}
        </span>
        <span className={`${daysColorClass} transition-colors`}>
          {daysText}
        </span>
      </div>
    </Link>
  );
}
