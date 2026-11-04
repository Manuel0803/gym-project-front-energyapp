'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { ThemeToggle } from '@/common/components/layout/ThemeToggle';
import { Modal } from '@/common/components/ui/Modal';
import toast from 'react-hot-toast';
import {
  Users,
  Dumbbell,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface ProfesorShellProps {
  children: React.ReactNode;
}

export function ProfesorShell({ children }: ProfesorShellProps) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const setLogout = useAuthStore((state) => state.setLogout);

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    setLogout();
    toast.success('Sesión de profesor cerrada correctamente');
    router.replace('/login');
  };

  const navLinks = [
    {
      name: 'Mis Alumnos',
      href: '/profesor',
      icon: Users,
      isActive:
        pathname === '/profesor' || pathname.startsWith('/profesor/alumnos'),
    },
    {
      name: 'Catálogo de Ejercicios',
      href: '/profesor/ejercicios',
      icon: Dumbbell,
      isActive: pathname.startsWith('/profesor/ejercicios'),
    },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-text-main flex flex-col transition-colors pb-20 md:pb-8">
        {/* Top Header */}
        <header className="h-18 border-b border-border-primary bg-surface/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-6">
            <Link
              href="/profesor"
              className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-main rounded-lg"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-surface border border-brand-main/30 flex items-center justify-center text-brand-main shrink-0">
                <Dumbbell size={22} aria-hidden="true" />
              </div>
              <div>
                <span className="font-bold text-base text-text-main tracking-tight block">
                  EnergyAPP
                </span>
                <span className="text-[10px] text-brand-main font-bold tracking-wider uppercase block -mt-0.5">
                  Portal del Instructor
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav
              className="hidden md:flex items-center gap-1 ml-4"
              aria-label="Navegación del profesor"
            >
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      item.isActive
                        ? 'bg-brand-surface text-brand-main font-bold border border-brand-main/30 shadow-xs'
                        : 'text-text-muted hover:text-text-main hover:bg-surface-hover'
                    }`}
                  >
                    <Icon size={16} aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />

            {/* Professor badge/avatar */}
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-surface border border-border-primary">
              <div className="w-7 h-7 rounded-lg bg-brand-main text-white font-bold flex items-center justify-center text-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'PR'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-text-main leading-tight truncate max-w-30">
                  {user?.name || 'Profesor'}
                </span>
                <span className="text-[9px] text-text-muted font-semibold flex items-center gap-1">
                  <Sparkles size={9} className="text-brand-main" aria-hidden="true" />
                  <span>En Sala</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-danger-main hover:bg-danger-surface transition-colors cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut size={16} aria-hidden="true" />
              <span>Salir</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Mobile & Tablet Bottom Navigation Bar (CHGYM2-67) */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-lg border-t border-border-primary px-6 py-2.5 flex items-center justify-around shadow-lg transition-colors"
          aria-label="Navegación móvil"
        >
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  item.isActive
                    ? 'text-brand-main'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    item.isActive
                      ? 'bg-brand-surface text-brand-main'
                      : 'text-text-muted'
                  }`}
                >
                  <Icon size={18} aria-hidden="true" />
                </div>
                <span>{item.name}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold text-text-muted hover:text-danger-main transition-all cursor-pointer"
          >
            <div className="p-1.5 rounded-xl hover:bg-danger-surface text-text-muted hover:text-danger-main transition-all">
              <LogOut size={18} aria-hidden="true" />
            </div>
            <span>Salir</span>
          </button>
        </nav>

        {/* Logout Modal */}
        <Modal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          title="Cerrar Sesión del Portal"
        >
          <div className="flex flex-col gap-4 mt-1">
            <p className="text-text-main text-xs sm:text-sm">
              ¿Estás seguro de que deseas cerrar tu sesión como instructor?
            </p>

            <div className="flex justify-end gap-3 mt-3">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-text-main border border-border-primary hover:bg-surface-hover transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-5 py-2 text-xs font-semibold rounded-lg text-white bg-danger-main hover:bg-danger-hover transition-colors cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </AuthGuard>
  );
}
