import { useState, useRef, useEffect, useCallback } from 'react';

interface FloatingDropdownReturn<T extends HTMLElement, U extends HTMLElement> {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleDropdown: (e?: React.MouseEvent | MouseEvent) => void;
  dropdownStyle: React.CSSProperties;
  buttonRef: React.RefObject<T | null>;
  dropdownRef: React.RefObject<U | null>;
}

/**
 * Custom hook to manage floating dropdowns.
 * Handles outside clicks, scroll/resize closing, and dynamic top/bottom positioning.
 * 
 * @param dropdownHeight Expected height of the dropdown to calculate flip logic (default: 70px)
 */
export function useFloatingDropdown<
  T extends HTMLElement = HTMLButtonElement,
  U extends HTMLElement = HTMLDivElement
>(dropdownHeight: number = 70): FloatingDropdownReturn<T, U> {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  
  const buttonRef = useRef<T>(null);
  const dropdownRef = useRef<U>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);
      const isOutsideButton = buttonRef.current && !buttonRef.current.contains(target);

      if (isOutsideDropdown && isOutsideButton) {
        setIsOpen(false);
      }
    }

    function handleScrollOrResize() {
      setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);

  const toggleDropdown = useCallback((e?: React.MouseEvent | MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      
      let top = rect.bottom + 4;
      
      if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
        top = rect.top - dropdownHeight - 4; 
      }

      setDropdownStyle({
        position: 'fixed',
        top: `${top}px`,
        right: `${window.innerWidth - rect.right}px`,
        width: '144px',
        zIndex: 9999,
      });
      
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isOpen, dropdownHeight]);

  return { 
    isOpen, 
    setIsOpen, 
    toggleDropdown, 
    dropdownStyle, 
    buttonRef, 
    dropdownRef 
  };
}
