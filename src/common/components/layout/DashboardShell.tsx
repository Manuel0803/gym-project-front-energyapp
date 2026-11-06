'use client';

import { Suspense, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useGym } from '@/features/gyms/hooks/useGyms';
import { useRole } from '@/features/auth/hooks/useRole';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { ThemeToggle } from '@/common/components/layout/ThemeToggle';
import { GlobalSearchInput } from '@/common/components/layout/GlobalSearchInput';
import { Modal } from '@/common/components/ui/Modal';
import { GymAIChat } from '@/features/gym-ai/components/GymAIChat';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  ShoppingCart,
  Package,
} from 'lucide-react';
import { SidebarNav, NavItem } from './SidebarNav';

export function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const setLogout = useAuthStore((state) => state.setLogout);
  const { isAdmin } = useRole();
  const gymDomain = useAuthStore((state) => state.user?.gymUuid);
  const { data: gymData, isLoading } = useGym(gymDomain);

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    setLogout();
    toast.success('Sesión cerrada correctamente');
    router.replace('/login');
  };

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      exact: true,
    },
    { name: 'Alumnos', href: '/admin/alumnos', icon: Users },
    { name: 'Punto de Venta', href: '/admin/pos', icon: ShoppingCart },
    { name: 'Inventario', href: '/admin/inventario', icon: Package },
    {
      name: 'Administradores',
      href: '/dashboard/administradores',
      icon: Shield,
      show: isAdmin,
    },
    { name: 'Planes', href: '/dashboard/planes', icon: ClipboardList },
    { name: 'Configuración', href: '/dashboard/configuracion', icon: Settings },
  ].filter((item) => item.show !== false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-text-main flex flex-col md:flex-row transition-colors overflow-hidden">
        <div
          className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />

        <aside
          className={`w-65 bg-sidebar border-r border-border-primary flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          aria-label="Navegación principal"
        >
          <div className="flex flex-col">
            <div className="h-20 flex items-center justify-between px-8 border-b border-border-primary">
              <div className="flex flex-col justify-center">
                {isLoading && (
                  <div className="h-4 w-24 bg-surface-hover animate-pulse rounded mb-1" />
                )}
                <span className="font-bold text-xl text-text-main tracking-wide">
                  {gymData?.name}
                </span>
                <span className="text-[9px] text-text-muted font-bold tracking-widest mt-1">
                  ADMIN TERMINAL
                </span>
              </div>
              <button
                className="md:hidden text-text-muted hover:text-text-main focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-main rounded"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Cerrar menú"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>

            <SidebarNav 
              items={navItems} 
              onItemClick={() => setIsSidebarOpen(false)} 
            />
          </div>

          <div className="flex flex-col mt-auto mb-6 space-y-1">
            
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center gap-4 px-8 py-3 transition-colors border-l-2 border-transparent text-text-muted hover:bg-danger-surface hover:text-danger-main hover:border-danger-main cursor-pointer w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-danger-main"
            >
              <LogOut size={18} aria-hidden="true" />
              <span className="font-medium text-sm">Cerrar sesión</span>
            </button>
          </div>
        </aside>

        <Modal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          title="Cerrar sesión"
        >
          <div className="flex flex-col gap-4">
            <p className="text-text-main">
              ¿Estás seguro de que deseas cerrar sesión?
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-text-main border border-border-primary hover:bg-surface-hover transition-colors rounded cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-danger-main hover:bg-danger-hover transition-colors rounded cursor-pointer"
              >
                Sí, cerrar sesión
              </button>
            </div>
          </div>
        </Modal>

        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <header className="h-20 border-b border-border-primary bg-background flex items-center px-4 md:px-8 gap-4 transition-colors shrink-0">
            <button
              className="md:hidden text-text-muted hover:text-text-main p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-main rounded"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu size={24} aria-hidden="true" />
            </button>

            <div className="flex-1 flex items-center">
              <Suspense fallback={<div className="w-full max-w-md h-10 bg-surface-hover animate-pulse rounded-lg" />}>
                <div className="w-full max-w-xs md:max-w-md">
                  <GlobalSearchInput key={pathname} />
                </div>
              </Suspense>
            </div>

            <div className="flex items-center shrink-0">
              <ThemeToggle />
            </div>
          </header>

          <div className="flex-1 p-4 md:p-8 overflow-y-auto" id="main-content">
            {children}
          </div>
        </main>

        <GymAIChat />
      </div>
    </AuthGuard>
  );
}
