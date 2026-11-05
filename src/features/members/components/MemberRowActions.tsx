'use client';

import { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from 'react';
import Link from 'next/link';
import { MoreHorizontal, Edit, Eye } from 'lucide-react';
import { useRole } from '@/features/auth/hooks/useRole';
import { DeleteMemberButton } from './DeleteMemberButton';

interface MemberRowActionsProps {
  uuid: string;
  name: string;
}

export function MemberRowActions({ uuid, name }: MemberRowActionsProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const { isAdmin } = useRole();
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    function handleScroll() {
      if (showDropdown) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [showDropdown]);

  const toggleDropdown = (e: ReactMouseEvent) => {
    e.stopPropagation();
    
    if (!showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = isAdmin ? 110 : 70;
      const spaceBelow = window.innerHeight - rect.bottom;

      let top = rect.bottom + 4;
      if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
        top = rect.top - dropdownHeight - 4;
      }

      setDropdownStyle({
        position: 'fixed',
        top: `${top}px`,
        right: `${window.innerWidth - rect.right}px`,
        width: '160px',
        zIndex: 9999,
      });
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative flex justify-end" onClick={(e) => e.stopPropagation()}>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        aria-label="Opciones del socio"
        aria-haspopup="menu"
        aria-expanded={showDropdown}
        className="p-1.5 rounded hover:bg-surface-hover transition-colors cursor-pointer"
      >
        <MoreHorizontal className="text-text-muted hover:text-text-main transition-colors" size={20} aria-hidden="true" />
      </button>

      {showDropdown && (
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          role="menu"
          className="bg-surface border border-border-primary rounded-md shadow-xl py-1 overflow-hidden"
        >
          <Link
            href={`/admin/alumnos/${uuid}`}
            role="menuitem"
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-text-main hover:bg-surface-hover transition-colors"
            onClick={() => setShowDropdown(false)}
          >
            <Eye size={14} className="text-brand-main" aria-hidden="true" /> 
            <span>Ver Detalles</span>
          </Link>
          
          <Link
            href={`/admin/alumnos/${uuid}/editar`}
            role="menuitem"
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-text-main hover:bg-surface-hover transition-colors"
            onClick={() => setShowDropdown(false)}
          >
            <Edit size={14} className="text-warning-main" aria-hidden="true" /> 
            <span>Editar</span>
          </Link>

          {isAdmin && (
            <div className="border-t border-border-primary mt-1 pt-1" role="none">
              <DeleteMemberButton
                uuid={uuid}
                name={name}
                onDeleted={() => setShowDropdown(false)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
