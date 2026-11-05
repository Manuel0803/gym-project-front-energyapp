'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

interface SidebarNavProps {
  items: NavItem[];
  onItemClick?: () => void;
}

export function SidebarNav({ items, onItemClick }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col mt-6 space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
          
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            aria-current={isActive ? 'page' : undefined}
            className={`flex items-center gap-4 px-8 py-3 transition-colors border-l-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-main ${
              isActive
                ? 'bg-brand-surface border-brand-main text-text-main'
                : 'border-transparent text-text-muted hover:bg-surface-hover hover:text-text-main'
            }`}
          >
            <Icon
              size={18}
              className={isActive ? 'text-brand-main' : ''}
              aria-hidden="true"
            />
            <span className="font-medium text-sm">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
