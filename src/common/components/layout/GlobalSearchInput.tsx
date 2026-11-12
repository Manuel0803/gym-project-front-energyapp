'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

const SEARCH_CONFIG: Record<string, { placeholder: string }> = {
  '/admin/alumnos': {
    placeholder: 'Buscar socios...',
  },
  '/dashboard/miembros': {
    placeholder: 'Buscar socios...',
  },
  '/dashboard/administradores': {
    placeholder: 'Buscar administradores...',
  },
};

export function GlobalSearchInput() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  const urlQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);

  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setSearchTerm(urlQuery);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const updateUrlParams = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      params.set('q', trimmedQuery);
    } else {
      params.delete('q');
    }

    params.delete('page');

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (timerRef.current) window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      updateUrlParams(value);
    }, 350);
  };

  const handleClear = () => {
    setSearchTerm('');
    if (timerRef.current) window.clearTimeout(timerRef.current);

    updateUrlParams('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
      inputRef.current?.blur();
    }
  };

  if (!SEARCH_CONFIG[pathname]) {
    return null;
  }

  return (
    <div className="relative flex items-center gap-2.5 bg-surface border border-border-primary rounded-lg px-3.5 py-2 w-full max-w-sm focus-within:border-brand-main focus-within:ring-1 focus-within:ring-brand-main/30 transition-all shadow-xs">
      <Search size={16} className="text-text-muted shrink-0" />
      <input
        ref={inputRef}
        type="text"
        placeholder={SEARCH_CONFIG[pathname]?.placeholder || 'Buscar...'}
        className="bg-transparent border-none outline-hidden text-sm text-text-main w-full placeholder:text-text-muted"
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          title="Limpiar búsqueda"
          className="text-text-muted hover:text-text-main p-0.5 rounded-full hover:bg-surface-hover transition-colors shrink-0 cursor-pointer"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
