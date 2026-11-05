import { ReactNode } from 'react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trendText?: string;
  trendIcon?: ReactNode;
  trendColor?: string;
  action?: ReactNode;
  badge?: ReactNode;
}

export function MetricCard({
  title,
  value,
  icon,
  trendText,
  trendIcon,
  trendColor = 'text-brand-main',
  action,
  badge,
}: MetricCardProps) {
  return (
    <article className="bg-surface rounded-lg p-5 border border-border-primary transition-colors shadow-sm flex flex-col justify-between">
      <header className="flex justify-between items-start mb-4 gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-[10px] font-bold text-text-muted tracking-wider uppercase">
            {title}
          </h3>
          {action}
        </div>
        {icon && (
          <div aria-hidden="true" className="text-text-muted shrink-0">
            {icon}
          </div>
        )}
      </header>

      <div className="text-3xl font-bold text-text-main transition-colors tracking-tight">
        {value}
      </div>

      {(trendText || badge) && (
        <footer className="flex items-center justify-between mt-3 text-xs transition-colors">
          <div className={`flex items-center gap-1 font-medium ${trendColor}`}>
            {trendIcon && (
              <span aria-hidden="true" className="shrink-0">
                {trendIcon}
              </span>
            )}
            {trendText && <span>{trendText}</span>}
          </div>
          {badge && <div className="shrink-0">{badge}</div>}
        </footer>
      )}
    </article>
  );
}
