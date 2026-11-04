'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useRole } from '@/features/auth/hooks/useRole';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { ThemeToggle } from '@/common/components/layout/ThemeToggle';
import { Modal } from '@/common/components/ui/Modal';
import toast from 'react-hot-toast';
import {
  Building2,
  ClipboardList,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { SidebarNav, NavItem } from './SidebarNav';

export function SuperAdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const router = useRouter();
  const setLogout = useAuthStore((state) => state.setLogout);
  const user = useAuthStore((state) => state.user);
  const { isSuperAdmin } = useRole();

  useEffect(() => {
    if (!isSuperAdmin) {
      router.replace('/dashboard');
    }
  }, [isSuperAdmin, router]);

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    setLogout();
    toast.success('Sesión de Super Admin cerrada');
    router.replace('/login');
  };

  const navItems: NavItem[] = [
    {
      name: 'Gimnasios',
      href: '/super-admin/gimnasios',
      icon: Building2,
    },
    {
      name: 'Planes',
      href: '/super-admin/planes',
      icon: ClipboardList,
    },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-text-main flex flex-col md:flex-row transition-colors overflow-hidden">
        {/* Mobile Backdrop */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
            isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />

        {/* Super Admin Navigation Sidebar */}
        <aside
          className={`w-65 bg-sidebar border-r border-border-primary flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          aria-label="Navegación Super Admin"
        >
          <div className="flex flex-col">
            {/* Header / Logo */}
            <div className="h-20 flex items-center justify-between px-8 border-b border-border-primary">
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-brand-surface border border-brand-main/30 flex items-center justify-center text-brand-main">
                    <ShieldCheck size={18} aria-hidden="true" />
                  </div>
                  <span className="font-bold text-lg text-text-main tracking-wide">
                    EnergyAPP
                  </span>
                </div>
                <span className="text-[9px] text-brand-main font-bold tracking-widest mt-1 uppercase">
                  Super Admin Terminal
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

            {/* Sidebar Navigation */}
            <SidebarNav
              items={navItems}
              onItemClick={() => setIsSidebarOpen(false)}
            />
          </div>

          {/* User info and Logout */}
          <div className="flex flex-col mt-auto mb-6 space-y-3 px-6">
            <div className="p-3 rounded-lg bg-surface border border-border-primary flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-surface text-brand-main font-bold flex items-center justify-center text-sm shrink-0">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'SA'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-text-main truncate">
                  {user?.name || 'Super Administrador'}
                </p>
                <span className="inline-block text-[10px] font-medium text-brand-main uppercase tracking-wider">
                  SaaS Owner
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-text-muted hover:bg-danger-surface hover:text-danger-main cursor-pointer w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-danger-main"
            >
              <LogOut size={16} aria-hidden="true" />
              <span className="font-medium text-xs">Cerrar sesión</span>
            </button>
          </div>
        </aside>

        {/* Logout Modal */}
        <Modal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          title="Cerrar sesión Super Admin"
        >
          <div className="flex flex-col gap-4">
            <p className="text-text-main text-sm">
              ¿Estás seguro de que deseas salir del panel de Super Administrador?
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

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <header className="h-20 border-b border-border-primary bg-background flex items-center justify-between px-4 md:px-8 gap-4 transition-colors shrink-0">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden text-text-muted hover:text-text-main p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-main rounded"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Abrir menú"
              >
                <Menu size={24} aria-hidden="true" />
              </button>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-surface text-brand-main border border-brand-main/20">
                  Panel Global SaaS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </header>

          <div
            className="flex-1 p-4 md:p-8 overflow-y-auto"
            id="super-admin-main-content"
          >
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
