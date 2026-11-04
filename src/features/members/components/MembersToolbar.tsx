'use client';

import { useState, useRef, useEffect } from 'react';
import { Filter, ArrowUpDown, ChevronDown, FileSpreadsheet } from 'lucide-react';
import { Plan } from '@/features/plans/interfaces/plan.interface';
import { MemberSortBy, SortOrder } from '../interfaces/members.interface';

export type SortOption =
  | 'default'
  | 'createdAt_desc'
  | 'name_asc'
  | 'name_desc'
  | 'surname_asc'
  | 'surname_desc';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Por defecto' },
  { value: 'createdAt_desc', label: 'Más recientes' },
  { value: 'name_asc', label: 'Nombre (A - Z)' },
  { value: 'name_desc', label: 'Nombre (Z - A)' },
  { value: 'surname_asc', label: 'Apellido (A - Z)' },
  { value: 'surname_desc', label: 'Apellido (Z - A)' },
];

interface MembersToolbarProps {
  selectedPlanId: string;
  onPlanChange: (planId: string) => void;
  plans: Plan[];
  sortConfig: { sortBy: MemberSortBy; order: SortOrder } | null;
  onSortChange: (value: SortOption) => void;
  filter: 'RELEVANT' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  onFilterChange: (
    filter: 'RELEVANT' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  ) => void;
  onImportClick?: () => void;
}

export function MembersToolbar({
  selectedPlanId,
  onPlanChange,
  plans,
  sortConfig,
  onSortChange,
  filter,
  onFilterChange,
  onImportClick,
}: MembersToolbarProps) {
  const [showPlansMenu, setShowPlansMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const plansMenuRef = useRef<HTMLDivElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (plansMenuRef.current && !plansMenuRef.current.contains(target)) {
        setShowPlansMenu(false);
      }
      if (sortMenuRef.current && !sortMenuRef.current.contains(target)) {
        setShowSortMenu(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowPlansMenu(false);
        setShowSortMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const selectedPlan = plans.find((p) => p.uuid === selectedPlanId);

  const getSortOption = (): SortOption => {
    if (!sortConfig) return 'default';
    if (sortConfig.sortBy === 'createdAt' && sortConfig.order === 'desc')
      return 'createdAt_desc';
    if (sortConfig.sortBy === 'name' && sortConfig.order === 'asc')
      return 'name_asc';
    if (sortConfig.sortBy === 'name' && sortConfig.order === 'desc')
      return 'name_desc';
    if (sortConfig.sortBy === 'surname' && sortConfig.order === 'asc')
      return 'surname_asc';
    if (sortConfig.sortBy === 'surname' && sortConfig.order === 'desc')
      return 'surname_desc';
    return 'default';
  };

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === getSortOption())?.label ||
    'Por defecto';

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      {onImportClick && (
        <button
          type="button"
          onClick={onImportClick}
          aria-label="Importar alumnos por archivo Excel o CSV"
          className="h-9 flex items-center gap-2 bg-surface hover:bg-surface-hover border border-border-primary text-text-main text-xs font-semibold rounded-lg px-3 focus:outline-none focus:border-brand-main transition-colors cursor-pointer shadow-xs"
        >
          <FileSpreadsheet
            size={14}
            className="text-success-main"
            aria-hidden="true"
          />
          <span>Importar Excel/CSV</span>
        </button>
      )}

      <div className="relative" ref={plansMenuRef}>
        <button
          type="button"
          onClick={() => {
            setShowPlansMenu((prev) => !prev);
            setShowSortMenu(false);
          }}
          aria-label="Filtrar por plan de membresía"
          aria-haspopup="menu"
          aria-expanded={showPlansMenu}
          className={`h-9 flex items-center gap-2 bg-surface border text-xs font-semibold rounded-lg px-3 focus:outline-none focus:border-brand-main transition-colors cursor-pointer shadow-sm ${
            selectedPlanId
              ? 'border-brand-main text-brand-main font-bold'
              : 'border-border-primary text-text-muted hover:text-text-main hover:border-border-primary/80'
          }`}
        >
          <Filter
            size={12}
            className={selectedPlanId ? 'text-brand-main' : 'text-text-muted'}
            aria-hidden="true"
          />
          <span className="max-w-36 truncate">
            {selectedPlan ? selectedPlan.name : 'Todos los planes'}
          </span>
          <ChevronDown
            size={14}
            className={`text-text-muted transition-transform duration-200 ${
              showPlansMenu ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {showPlansMenu && (
          <div 
            className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 z-50 bg-surface border border-border-primary rounded-xl p-2 shadow-2xl min-w-48 backdrop-blur-md flex flex-col gap-1"
            role="menu"
          >
            <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-border-primary/60">
              <span className="text-[10px] font-bold tracking-wider uppercase text-text-muted">
                Planes de Membresía
              </span>
              {selectedPlanId && (
                <button
                  type="button"
                  onClick={() => {
                    onPlanChange('');
                    setShowPlansMenu(false);
                  }}
                  className="text-[10px] font-bold text-brand-main hover:underline cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onPlanChange('');
                setShowPlansMenu(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                !selectedPlanId
                  ? 'bg-brand-main text-white'
                  : 'text-text-muted hover:text-text-main hover:bg-surface-hover'
              }`}
            >
              Todos los planes
            </button>
            {plans.map((plan) => (
              <button
                key={plan.uuid}
                type="button"
                role="menuitem"
                onClick={() => {
                  onPlanChange(plan.uuid);
                  setShowPlansMenu(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer truncate ${
                  selectedPlanId === plan.uuid
                    ? 'bg-brand-main text-white font-bold'
                    : 'text-text-muted hover:text-text-main hover:bg-surface-hover'
                }`}
              >
                {plan.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative" ref={sortMenuRef}>
        <button
          type="button"
          onClick={() => {
            setShowSortMenu((prev) => !prev);
            setShowPlansMenu(false);
          }}
          aria-label="Ordenar miembros"
          aria-haspopup="menu"
          aria-expanded={showSortMenu}
          className={`h-9 flex items-center gap-2 bg-surface border text-xs font-semibold rounded-lg px-3 focus:outline-none focus:border-brand-main transition-colors cursor-pointer shadow-sm ${
            sortConfig
              ? 'border-brand-main text-brand-main font-bold'
              : 'border-border-primary text-text-muted hover:text-text-main hover:border-border-primary/80'
          }`}
        >
          <ArrowUpDown
            size={12}
            className={sortConfig ? 'text-brand-main' : 'text-text-muted'}
            aria-hidden="true"
          />
          <span className="max-w-36 truncate">{currentSortLabel}</span>
          <ChevronDown
            size={14}
            className={`text-text-muted transition-transform duration-200 ${
              showSortMenu ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {showSortMenu && (
          <div 
            className="absolute right-0 top-full mt-2 z-50 bg-surface border border-border-primary rounded-xl p-2 shadow-2xl min-w-44 backdrop-blur-md flex flex-col gap-1"
            role="menu"
          >
            <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-border-primary/60">
              <span className="text-[10px] font-bold tracking-wider uppercase text-text-muted">
                Ordenar por
              </span>
              {sortConfig && (
                <button
                  type="button"
                  onClick={() => {
                    onSortChange('default');
                    setShowSortMenu(false);
                  }}
                  className="text-[10px] font-bold text-brand-main hover:underline cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>
            {SORT_OPTIONS.map((opt) => {
              const isSelected = getSortOption() === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onSortChange(opt.value);
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-brand-main text-white font-bold'
                      : 'text-text-muted hover:text-text-main hover:bg-surface-hover font-medium'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div 
        className="flex bg-surface border border-border-primary rounded-lg p-1 shadow-sm"
        role="group"
        aria-label="Filtro de estado de miembros"
      >
        {(
          [
            { key: 'RELEVANT', label: 'Frecuentes' },
            { key: 'ACTIVE', label: 'Activos' },
            { key: 'SUSPENDED', label: 'Suspendidos' },
            { key: 'INACTIVE', label: 'Bajas' },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            aria-pressed={filter === key}
            className={`px-4 py-1.5 text-[10px] font-bold rounded transition-colors tracking-wider uppercase cursor-pointer ${
              filter === key
                ? 'bg-brand-main text-white shadow-sm'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
