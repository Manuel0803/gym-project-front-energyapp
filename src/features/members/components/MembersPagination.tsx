'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MembersPaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function MembersPagination({
  currentPage,
  totalPages,
  isLoading,
  onPrevPage,
  onNextPage,
}: MembersPaginationProps) {
  return (
    <nav 
      className="flex items-center justify-between px-5 py-4 border-t border-border-primary bg-surface"
      aria-label="Navegación de páginas de miembros"
    >
      <p className="text-sm text-text-muted" aria-live="polite">
        Mostrando página <strong className="font-medium text-text-main">{currentPage}</strong> de <strong className="font-medium text-text-main">{totalPages || 1}</strong>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevPage}
          disabled={currentPage === 1 || isLoading}
          className="p-1.5 rounded-md text-text-muted hover:text-text-main hover:bg-surface-hover disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-text-muted transition-colors cursor-pointer disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-main"
          aria-label="Ir a la página anterior"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onNextPage}
          disabled={currentPage >= totalPages || isLoading}
          className="p-1.5 rounded-md text-text-muted hover:text-text-main hover:bg-surface-hover disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-text-muted transition-colors cursor-pointer disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-main"
          aria-label="Ir a la página siguiente"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
