'use client';

import Link from 'next/link';
import { DeleteAdminButton } from './DeleteAdminButton';
import { MoreHorizontal, Edit, ShieldAlert } from 'lucide-react';
import { useFloatingDropdown } from '../hooks/useFloatingDropdown';
import { User } from '../interfaces/user.interface';

const ROLE_CONFIG: Record<string, { label: string; className: string }> = {
  ADMIN: {
    label: 'Administrador',
    className:
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  },
  USER: {
    label: 'Personal Administrativo',
    className:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  },
  CUSTOMER: {
    label: 'Socio',
    className:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  },
  SUPER_ADMIN: {
    label: 'Super Admin',
    className:
      'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
  },
};

export interface AdminRowProps {
  admin: User;
  isCurrentUser: boolean;
}

export function AdminRow({ admin, isCurrentUser }: AdminRowProps) {
  const { isOpen, setIsOpen, toggleDropdown, dropdownStyle, buttonRef, dropdownRef } = useFloatingDropdown(70);

  const fullName = `${admin.name} ${admin.surname}`.trim();
  
  const initials = `${admin.name?.charAt(0) || ''}${admin.surname?.charAt(0) || ''}`.toUpperCase() || 'NA';

  const roleKey = (admin.role || '').toString().toUpperCase();
  const roleConfig = ROLE_CONFIG[roleKey] || {
    label: roleKey || 'Usuario',
    className:
      'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
  };

  return (
    <div className="grid grid-cols-[2fr_1fr_2fr_100px] gap-4 items-center px-5 py-4 border-b border-border-primary hover:bg-surface-hover transition-colors last:border-b-0">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-full bg-background border border-border-primary flex items-center justify-center text-xs font-bold text-text-muted uppercase">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-text-main flex items-center gap-2 truncate">
              {fullName}
              {isCurrentUser && (
                <span className="text-[9px] bg-brand-main/10 text-brand-main px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                  Tú
                </span>
              )}
            </p>
            <p className="text-xs text-text-muted mt-0.5 truncate">{admin.dni}</p>
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold border rounded-full uppercase tracking-wider ${roleConfig.className}`}>
          {roleConfig.label}
        </span>
      </div>

      <div className="min-w-0">
        <p className="text-sm font-light text-text-main truncate pr-4">{admin.email}</p>
      </div>

      <div className="relative flex justify-center">
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleDropdown}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-label={`Opciones para ${fullName}`}
          className="p-1 rounded hover:bg-surface transition-colors cursor-pointer"
        >
          <MoreHorizontal aria-hidden="true" className="text-text-muted hover:text-text-main" />
        </button>

        {isOpen && (
          <div 
            ref={dropdownRef}
            style={dropdownStyle}
            role="menu"
            className="bg-surface border border-border-primary rounded-md shadow-lg py-1 overflow-hidden z-50"
          >
            <Link
              href={`/dashboard/administradores/${admin.uuid}/editar`}
              onClick={() => setIsOpen(false)}
              role="menuitem"
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-main hover:bg-surface-hover transition-colors"
            >
              <Edit size={14} aria-hidden="true" className="text-text-muted" /> Editar
            </Link>

            {isCurrentUser ? (
              <button 
                type="button"
                disabled 
                aria-disabled="true"
                role="menuitem"
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-muted bg-surface-hover cursor-not-allowed" 
                title="No puedes eliminar tu propia cuenta"
              >
                <ShieldAlert size={14} aria-hidden="true" /> Eliminar
              </button>
            ) : (
              <DeleteAdminButton admin={admin} onDeleted={() => setIsOpen(false)} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
