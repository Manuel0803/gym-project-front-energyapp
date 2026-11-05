import { Sparkles } from 'lucide-react';

interface SidebarNewsProps {
  version: string;
  message: string;
}

export function SidebarNews({ version, message }: SidebarNewsProps) {
  return (
    <div className="px-6 mb-2">
      <div className="bg-surface-hover border border-border-primary rounded-lg p-3 flex flex-col gap-2 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
            <Sparkles size={14} className="text-brand-main" aria-hidden="true" /> Novedades
          </span>
          <span className="text-[10px] font-bold bg-background border border-border-primary text-text-muted px-1.5 py-0.5 rounded">
            {version}
          </span>
        </div>
        <p className="text-[11px] text-text-muted leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}
