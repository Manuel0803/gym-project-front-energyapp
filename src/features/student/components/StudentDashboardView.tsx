'use client';

import Link from 'next/link';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useMyStatus } from '../hooks/useStudent';
import {
  Clock,
  Dumbbell,
  CreditCard,
  User,
  ChevronRight,
  Loader2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export function StudentDashboardView() {
  const user = useAuthStore((state) => state.user);
  const { data: statusData, isLoading } = useMyStatus();

  const isExpired =
    statusData?.status === 'EXPIRED' ||
    (statusData?.daysRemaining !== undefined && statusData.daysRemaining <= 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block">
            ¡Hola de nuevo!
          </span>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            {user?.name || 'Alumno'}
          </h1>
        </div>

        <div className="w-10 h-10 rounded-full bg-brand-surface text-brand-main font-bold flex items-center justify-center text-sm border border-brand-main/30">
          {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AL'}
        </div>
      </div>

      {/* Main Membership Status Card (CHGYM2-83) */}
      <div className="relative overflow-hidden rounded-lg border border-border-primary bg-surface p-5 shadow-sm transition-colors">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-text-muted">
            <Loader2 className="w-7 h-7 text-brand-main animate-spin mb-2" />
            <span className="text-xs">Consultando estado de membresía...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Top Tag & Status Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                <Sparkles size={13} className="text-brand-main" aria-hidden="true" />
                <span>Estado de Membresía</span>
              </span>

              {isExpired ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold bg-danger-surface text-danger-main border border-danger-main/30 tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-danger-main" aria-hidden="true" />
                  <span>Vencida</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold bg-success-surface text-success-main border border-success-main/30 tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-success-main" aria-hidden="true" />
                  <span>Activa</span>
                </span>
              )}
            </div>

            {/* Days Remaining Display */}
            <div className="py-2">
              {isExpired ? (
                <div>
                  <span className="text-3xl font-bold text-danger-main tracking-tight block">
                    Cuota Vencida
                  </span>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    Tu acceso a la sala de entrenamiento requiere renovación de la cuota.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-text-main tracking-tight font-mono">
                      {statusData?.daysRemaining ?? 0}
                    </span>
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      {statusData?.daysRemaining === 1 ? 'Día restante' : 'Días restantes'}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Tu cuota está al día. ¡Aprovechá tu entrenamiento de hoy!
                  </p>
                </div>
              )}
            </div>

            {/* Details Footer */}
            <div className="pt-3 border-t border-border-primary flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-text-muted">
                <Calendar size={14} aria-hidden="true" />
                <span>Plan:</span>
                <strong className="text-text-main font-bold">
                  {statusData?.planName || 'Plan General'}
                </strong>
              </div>

              {statusData?.expirationDate && (
                <div className="flex items-center gap-1 text-[11px] text-text-muted font-mono">
                  <Clock size={12} aria-hidden="true" />
                  <span>
                    Vence:{' '}
                    {new Date(statusData.expirationDate).toLocaleDateString(
                      'es-AR',
                      { day: '2-digit', month: 'short' }
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="flex flex-col gap-3">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">
          Acciones Rápidas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Routine Card */}
          <Link
            href="/alumno/rutina"
            className="p-4 rounded-lg bg-surface border border-border-primary hover:border-brand-main transition-colors flex items-center justify-between gap-4 group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-brand-surface text-brand-main flex items-center justify-center shrink-0">
                <Dumbbell size={20} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-main group-hover:text-brand-main transition-colors">
                  Mi Rutina
                </h3>
                <p className="text-[11px] text-text-muted line-clamp-1">
                  Ejercicios y series de hoy.
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-text-muted group-hover:text-brand-main transition-colors shrink-0" />
          </Link>

          {/* Payments Card */}
          <Link
            href="/alumno/pagos"
            className="p-4 rounded-lg bg-surface border border-border-primary hover:border-brand-main transition-colors flex items-center justify-between gap-4 group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-success-surface text-success-main flex items-center justify-center shrink-0">
                <CreditCard size={20} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-main group-hover:text-success-main transition-colors">
                  Medios de Pago
                </h3>
                <p className="text-[11px] text-text-muted line-clamp-1">
                  CBU, Alias y transferencias.
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-text-muted group-hover:text-success-main transition-colors shrink-0" />
          </Link>

          {/* Profile Card */}
          <Link
            href="/alumno/perfil"
            className="p-4 rounded-lg bg-surface border border-border-primary hover:border-brand-main transition-colors flex items-center justify-between gap-4 group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-surface-hover text-text-main flex items-center justify-center shrink-0">
                <User size={20} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-main group-hover:text-brand-main transition-colors">
                  Mi Perfil
                </h3>
                <p className="text-[11px] text-text-muted line-clamp-1">
                  Contacto de emergencia y datos.
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-text-muted group-hover:text-brand-main transition-colors shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
