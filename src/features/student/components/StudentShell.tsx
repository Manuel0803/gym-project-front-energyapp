'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { ThemeToggle } from '@/common/components/layout/ThemeToggle';
import { Modal } from '@/common/components/ui/Modal';
import { useMyStatus } from '../hooks/useStudent';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Dumbbell,
  CreditCard,
  User,
  LogOut,
  AlertTriangle,
  AlertOctagon,
  ChevronRight,
} from 'lucide-react';

interface StudentShellProps {
  children: React.ReactNode;
}

export function StudentShell({ children }: StudentShellProps) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const setLogout = useAuthStore((state) => state.setLogout);

  const { data: statusData } = useMyStatus();

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    setLogout();
    toast.success('Sesión cerrada correctamente');
    router.replace('/login');
  };

  const navLinks = [
    {
      name: 'Inicio',
      href: '/alumno',
      icon: LayoutDashboard,
      isActive: pathname === '/alumno',
    },
    {
      name: 'Pagos',
      href: '/alumno/pagos',
      icon: CreditCard,
      isActive: pathname.startsWith('/alumno/pagos'),
    },
    {
      name: 'Mi Perfil',
      href: '/alumno/perfil',
      icon: User,
      isActive: pathname.startsWith('/alumno/perfil'),
    },
  ];

  // UX de Alerta In-App: cuota vencida o vence en 3 días o menos
  const isExpired =
    statusData?.status === 'EXPIRED' ||
    (statusData?.daysRemaining !== undefined && statusData.daysRemaining <= 0);

  const isCriticalExpiring =
    !isExpired &&
    statusData?.daysRemaining !== undefined &&
    statusData.daysRemaining <= 3;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-text-main flex flex-col transition-colors pb-24 md:pb-8">
        {/* Sticky In-App Expiration Alert Banner */}
        {isExpired && (
          <div
            className="sticky top-0 z-50 bg-danger-main text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs font-bold animate-in slide-in-from-top duration-200"
            role="alert"
          >
            <div className="flex items-center gap-2 min-w-0">
              <AlertOctagon size={16} className="shrink-0" aria-hidden="true" />
              <span className="truncate">
                Tu cuota está vencida. Renovala para seguir entrenando.
              </span>
            </div>
            <Link
              href="/alumno/pagos"
              className="px-2.5 py-1 rounded bg-white text-danger-main text-[11px] font-black uppercase tracking-wider shrink-0 flex items-center gap-0.5 hover:bg-white/90 transition-all cursor-pointer"
            >
              <span>Pagar</span>
              <ChevronRight size={12} />
            </Link>
          </div>
        )}

        {!isExpired && isCriticalExpiring && (
          <div
            className="sticky top-0 z-50 bg-warning-main text-black px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs font-bold animate-in slide-in-from-top duration-200"
            role="alert"
          >
            <div className="flex items-center gap-2 min-w-0">
              <AlertTriangle size={16} className="shrink-0" aria-hidden="true" />
              <span className="truncate">
                Tu cuota vence en {statusData.daysRemaining}{' '}
                {statusData.daysRemaining === 1 ? 'día' : 'días'}. Renovala a tiempo.
              </span>
            </div>
            <Link
              href="/alumno/pagos"
              className="px-2.5 py-1 rounded bg-black text-white text-[11px] font-black uppercase tracking-wider shrink-0 flex items-center gap-0.5 hover:bg-black/90 transition-all cursor-pointer"
            >
              <span>Ver medios</span>
              <ChevronRight size={12} />
            </Link>
          </div>
        )}

        {/* Top Header (Responsive for both Mobile & PC) */}
        <header className="h-16 md:h-18 border-b border-border-primary bg-surface/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 transition-colors">
          <div className="flex items-center gap-6">
            <Link
              href="/alumno"
              className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-main rounded-lg"
              aria-label="Ir al inicio del portal del socio"
            >
              <div className="w-9 h-9 rounded-lg bg-brand-surface border border-brand-main/30 flex items-center justify-center text-brand-main shrink-0">
                <Dumbbell size={19} aria-hidden="true" />
              </div>
              <div>
                <span className="font-bold text-sm text-text-main tracking-tight block">
                  EnergyAPP
                </span>
                <span className="text-[9px] text-brand-main font-bold tracking-wider uppercase block -mt-0.5">
                  Portal del Socio
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav
              className="hidden md:flex items-center gap-1.5 ml-2"
              aria-label="Navegación principal del socio"
            >
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      item.isActive
                        ? 'bg-brand-surface text-brand-main font-bold border border-brand-main/30 shadow-xs'
                        : 'text-text-muted hover:text-text-main hover:bg-surface-hover'
                    }`}
                  >
                    <Icon size={15} aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Desktop User Chip */}
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-surface border border-border-primary">
              <div className="w-7 h-7 rounded-lg bg-brand-main text-white font-bold flex items-center justify-center text-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'SO'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-text-main leading-tight truncate max-w-28">
                  {user?.name || 'Socio'}
                </span>
                <span className="text-[9px] text-success-main font-semibold flex items-center gap-1">
                  <span>Socio</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-lg text-text-muted hover:text-danger-main hover:bg-danger-surface transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <LogOut size={16} aria-hidden="true" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </header>

        {/* Main Content (Responsive Container for Mobile & Desktop) */}
        <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col gap-6">
          {children}
        </main>

        {/* Fixed Mobile Bottom Navigation Bar (Hidden on Desktop: md:hidden) */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-border-primary px-3 py-2 flex items-center justify-around shadow-lg transition-colors max-w-md mx-auto"
          aria-label="Navegación del socio"
        >
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer min-w-16 ${
                  item.isActive
                    ? 'text-brand-main font-bold'
                    : 'text-text-muted hover:text-text-main font-medium'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    item.isActive
                      ? 'bg-brand-surface text-brand-main scale-105'
                      : 'text-text-muted'
                  }`}
                >
                  <Icon size={19} aria-hidden="true" />
                </div>
                <span className="text-[10px] leading-tight tracking-tight">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Modal */}
        <Modal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          title="Cerrar Sesión"
        >
          <div className="flex flex-col gap-4 mt-1">
            <p className="text-text-main text-xs sm:text-sm">
              ¿Deseas cerrar tu sesión en este dispositivo?
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
