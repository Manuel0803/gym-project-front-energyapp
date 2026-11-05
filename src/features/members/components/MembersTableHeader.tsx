'use client';

import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { MemberSortBy, SortOrder } from '../interfaces/members.interface';

interface MembersTableHeaderProps {
  sortConfig: { sortBy: MemberSortBy; order: SortOrder } | null;
  onSortName: () => void;
}

export function MembersTableHeader({
  sortConfig,
  onSortName,
}: MembersTableHeaderProps) {
  const isNameSorted = sortConfig?.sortBy === 'name';

  return (
    <header 
      className="grid grid-cols-[2fr_1fr_1.5fr_1.5fr_2fr_1fr_50px] gap-4 items-center px-5 py-3 border-b border-border-primary bg-background min-w-225 select-none"
      role="row"
    >
      <div 
        role="columnheader" 
        aria-sort={isNameSorted ? (sortConfig.order === 'asc' ? 'ascending' : 'descending') : 'none'}
      >
        <button
          type="button"
          onClick={onSortName}
          aria-label={isNameSorted && sortConfig.order === 'asc' ? 'Ordenar por nombre descendente' : 'Ordenar por nombre ascendente'}
          className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-left transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-main rounded-sm"
        >
          <span
            className={
              isNameSorted
                ? 'text-brand-main'
                : 'text-text-muted group-hover:text-text-main'
            }
          >
            Nombre y DNI
          </span>
          {isNameSorted ? (
            sortConfig.order === 'asc' ? (
              <ArrowUp size={14} className="text-brand-main shrink-0" aria-hidden="true" />
            ) : (
              <ArrowDown size={14} className="text-brand-main shrink-0" aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown
              size={13}
              className="text-text-muted/40 group-hover:text-text-muted shrink-0 transition-colors"
              aria-hidden="true"
            />
          )}
        </button>
      </div>
      
      <div role="columnheader" className="text-[10px] font-bold text-text-muted tracking-widest uppercase">
        Estado
      </div>
      <div role="columnheader" className="text-[10px] font-bold text-text-muted tracking-widest uppercase">
        Teléfono
      </div>
      <div role="columnheader" className="text-[10px] font-bold text-text-muted tracking-widest uppercase">
        Fecha Nac.
      </div>
      <div role="columnheader" className="text-[10px] font-bold text-text-muted tracking-widest uppercase">
        Plan
      </div>
      <div role="columnheader" className="text-[10px] font-bold text-text-muted tracking-widest uppercase">
        Observaciones
      </div>
      <div role="columnheader" className="text-[10px] font-bold text-text-muted tracking-widest uppercase text-right">
        Acciones
      </div>
    </header>
  );
}
