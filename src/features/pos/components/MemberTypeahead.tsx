'use client';

import { useState, useRef, useEffect } from 'react';
import { useDebounce } from '@/common/hooks/useDebounce';
import { useMembers } from '@/features/members/hooks/useMembers';
import { Member } from '@/features/members/interfaces/members.interface';
import { User, Search, X, Loader2, CheckCircle2 } from 'lucide-react';

interface MemberTypeaheadProps {
  selectedMember: Member | null;
  onSelectMember: (member: Member | null) => void;
}

export function MemberTypeahead({
  selectedMember,
  onSelectMember,
}: MemberTypeaheadProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query.trim(), 300);

  const { data: response, isLoading } = useMembers({
    term: debouncedQuery.length >= 2 ? debouncedQuery : undefined,
    limit: 6,
    page: 1,
  });

  const members = response?.data || [];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (member: Member) => {
    onSelectMember(member);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    onSelectMember(null);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <label
        htmlFor="member-typeahead-input"
        className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5"
      >
        Asociar Alumno a la Venta
      </label>

      {selectedMember ? (
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-brand-surface border border-brand-main/30 text-text-main shadow-xs transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-background border border-border-primary flex items-center justify-center font-bold text-xs text-brand-main shrink-0">
              {selectedMember.name.charAt(0)}
              {selectedMember.surname.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold truncate">
                  {selectedMember.name} {selectedMember.surname}
                </span>
                <CheckCircle2
                  size={14}
                  className="text-brand-main shrink-0"
                  aria-hidden="true"
                />
              </div>
              <p className="text-[10px] text-text-muted">
                DNI: <span className="font-mono">{selectedMember.dni}</span> •
                Estado: {selectedMember.state}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-md text-text-muted hover:text-danger-main hover:bg-danger-surface transition-colors cursor-pointer"
            title="Quitar alumno"
            aria-label="Quitar alumno seleccionado"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="member-typeahead-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (query.length >= 2) setIsOpen(true);
            }}
            placeholder="Buscar alumno por nombre, apellido o DNI..."
            autoComplete="off"
            className="h-9 w-full pl-9 pr-9 text-xs rounded-lg bg-surface border border-border-primary text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand-main transition-colors shadow-xs"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              <Loader2 size={16} className="animate-spin text-brand-main" />
            </div>
          )}

          {/* Autocomplete Dropdown */}
          {isOpen && debouncedQuery.length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-surface border border-border-primary rounded-lg shadow-md overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
              {members.length > 0 ? (
                <ul className="divide-y divide-border-primary">
                  {members.map((member) => (
                    <li key={member.uuid}>
                      <button
                        type="button"
                        onClick={() => handleSelect(member)}
                        className="w-full text-left p-3 hover:bg-surface-hover flex items-center gap-3 transition-colors cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-surface border border-border-primary flex items-center justify-center text-text-muted shrink-0">
                          <User size={15} aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-text-main truncate">
                            {member.name} {member.surname}
                          </p>
                          <p className="text-[10px] text-text-muted">
                            DNI: {member.dni}
                          </p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-background border border-border-primary text-text-muted font-semibold">
                          {member.state}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-xs text-text-muted">
                  {isLoading
                    ? 'Buscando alumnos...'
                    : 'No se encontraron alumnos coincidentes.'}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
