'use client';

import { useEffect, useId } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidthClass = 'max-w-md',
}: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className={`bg-background border border-border-primary rounded-lg shadow-2xl w-full ${maxWidthClass} relative flex flex-col animate-in zoom-in-95 duration-200`}>
        <div className="flex justify-between items-center p-4 border-b border-border-primary">
          <h3 id={titleId} className="text-lg font-bold text-text-main">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-white transition-colors cursor-pointer"
            title="Cerrar"
            aria-label="Cerrar ventana"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
