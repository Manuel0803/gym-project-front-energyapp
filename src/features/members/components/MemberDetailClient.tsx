'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, ArrowRightLeft, Award, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { useMember } from '@/features/members/hooks/useMembers';
import { usePlans } from '@/features/plans/hooks/usePlans';
import { PaymentHistoryTable } from '@/features/payments/components/PaymentHistoryTable';
import { MemberProfileCard } from '@/features/members/components/MemberProfileCard';
import { ChangePlanModal } from '@/features/members/components/ChangePlanModal';
import { RenewPlanModal } from '@/features/members/components/RenewPlanModal';
import { STATUS_TRANSLATIONS, STATUS_STYLES } from '@/features/members/constants/member-styles-ui.constants';
import { MemberDetailClientProps } from '../interfaces/members.interface';

export default function MemberDetailClient({ id }: MemberDetailClientProps) {
  const { data: member, isLoading, isError } = useMember(id);
  const { data: plans } = usePlans();

  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full bg-surface border border-border-primary rounded-lg">
        <Loader2 className="w-8 h-8 text-brand-main animate-spin mb-4" />
        <p className="text-text-muted text-sm">Cargando perfil del miembro...</p>
      </div>
    );
  }

  if (isError || !member) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full bg-surface border border-danger-main/20 rounded-lg">
        <p className="text-text-main text-sm">Error al cargar el perfil o el miembro no existe.</p>
        <Link href="/admin/alumnos" className="mt-4 text-brand-main hover:underline text-sm">
          Volver a la lista
        </Link>
      </div>
    );
  }

  const getMidnightTime = (dateInput?: string | Date) => {
    const d = dateInput ? new Date(dateInput) : new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const todayMidnight = getMidnightTime();
  const isFuture = (startDate: string) => getMidnightTime(startDate) > todayMidnight;
  
  const isActive = (startDate: string, endDate: string) => {
    return getMidnightTime(startDate) <= todayMidnight && getMidnightTime(endDate) >= todayMidnight;
  };

  const activeSubscription =
    member.subscriptions?.find(
      (sub) => sub.status === 'ACTIVE' && isActive(sub.startDate, sub.endDate)
    ) ||
    member.subscriptions?.find(
      (sub) => sub.status === 'ACTIVE' && getMidnightTime(sub.endDate) >= todayMidnight
    );

  const futureSubscriptions =
    member.subscriptions
      ?.filter((sub) => sub.status === 'ACTIVE' && isFuture(sub.startDate))
      .sort((a, b) => getMidnightTime(a.startDate) - getMidnightTime(b.startDate)) || [];

  const latestSubscription = member.subscriptions?.[0];
  const isExpiredState = !activeSubscription && !!latestSubscription;
  const referenceSubscription = activeSubscription || latestSubscription;

  const planName = referenceSubscription?.plan?.name || 'Sin plan asignado';
  const isReferencePlanActive = referenceSubscription?.plan?.isActive !== false;
  
  let dynamicState = member.state || 'INACTIVE';
  if (dynamicState === 'ACTIVE' && !activeSubscription) {
    dynamicState = 'SUSPENDED';
  }

  let daysRemaining = 0;
  let progressPercentage = 0;
  let nextDueDate = '-';

  if (activeSubscription) {
    const endMidnight = getMidnightTime(activeSubscription.endDate);
    const startMidnight = getMidnightTime(activeSubscription.startDate);

    const totalDurationDays = Math.max(1, Math.ceil((endMidnight - startMidnight) / (1000 * 60 * 60 * 24)));
    const elapsedDays = Math.max(0, Math.ceil((todayMidnight - startMidnight) / (1000 * 60 * 60 * 24)));

    daysRemaining = Math.max(0, Math.ceil((endMidnight - todayMidnight) / (1000 * 60 * 60 * 24)));
    progressPercentage = Math.min(100, Math.max(0, (elapsedDays / totalDurationDays) * 100));
    
    nextDueDate = new Date(activeSubscription.endDate).toLocaleDateString('es-ES', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  } else if (isExpiredState && latestSubscription) {
    nextDueDate = new Date(latestSubscription.endDate).toLocaleDateString('es-ES', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  }

  return (
    <section>
      <Link href="/admin/alumnos" className="flex text-text-muted uppercase text-xs font-bold items-center gap-1 mb-4 hover:text-text-main transition-colors w-max">
        <ArrowLeft size={16} aria-hidden="true" />
        <span>Volver al padrón de socios</span>
      </Link>

      <header className="flex justify-between items-center border-b-2 border-border-primary pb-4 mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl text-text-main font-bold">
            {member.user?.name || member.name} {member.user?.surname || member.surname}
          </h1>
          <p className="text-sm text-text-muted">DNI: {member.user?.dni || member.dni}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start max-w-7xl mx-auto p-4">
        <MemberProfileCard 
          member={member} 
          displayStatus={STATUS_TRANSLATIONS[dynamicState] || dynamicState} 
          safeStatusStyles={STATUS_STYLES[dynamicState] || STATUS_STYLES['INACTIVE']} 
          defaultAmount={referenceSubscription?.plan?.price ? Number(referenceSubscription.plan.price) : 0} 
        />

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className={`bg-surface border ${isExpiredState ? 'border-danger-main/30' : 'border-border-primary'} rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors shadow-sm`}>
            <div className="flex flex-col gap-1">
              <span className={`text-xs font-bold uppercase tracking-wider ${isExpiredState ? 'text-danger-main' : 'text-text-muted'}`}>
                {isExpiredState ? 'Último Plan (Vencido)' : 'Plan Actual'}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <h3 className={`text-2xl font-bold ${isExpiredState ? 'text-text-muted' : 'text-text-main'}`}>
                  {planName}
                </h3>
                {isExpiredState ? (
                  <AlertCircle size={20} className="text-danger-main" aria-hidden="true" />
                ) : (
                  <Award size={20} className="text-brand-main" aria-hidden="true" />
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <button
                onClick={() => setIsChangePlanModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-bold text-sm bg-surface-hover border border-border-primary text-text-main hover:bg-surface transition-all active:scale-95 shadow-sm cursor-pointer"
                title="Cambiar a un plan diferente"
              >
                <ArrowRightLeft size={16} aria-hidden="true" />
                <span>Cambiar Plan</span>
              </button>

              {referenceSubscription && (
                <button
                  onClick={() => setIsRenewModalOpen(true)}
                  disabled={futureSubscriptions.length >= 2 || !isReferencePlanActive}
                  className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-bold text-sm transition-all ${
                    !isReferencePlanActive || futureSubscriptions.length >= 2
                      ? 'bg-surface-hover text-text-muted cursor-not-allowed border border-border-primary'
                      : isExpiredState 
                        ? 'bg-danger-main text-white hover:brightness-110 shadow-sm active:scale-95 cursor-pointer'
                        : 'bg-brand-main text-white hover:bg-opacity-90 shadow-sm active:scale-95 cursor-pointer'
                  }`}
                  title={
                    !isReferencePlanActive
                      ? 'Este plan ya no se comercializa. Usa "Cambiar Plan".'
                      : futureSubscriptions.length >= 2
                      ? 'Límite máximo de planes programados'
                      : isExpiredState
                      ? 'Renovar último plan vencido'
                      : 'Renovar y apilar mes'
                  }
                >
                  <RefreshCw size={16} aria-hidden="true" />
                  <span>Renovar</span>
                </button>
              )}
            </div>
          </div>

          {futureSubscriptions.length > 0 && (
            <div className="bg-surface border border-border-primary rounded-lg p-6 flex flex-col gap-4 transition-colors shadow-sm">
              <span className="text-xs text-text-muted font-bold uppercase tracking-wider">
                Planes Programados ({futureSubscriptions.length})
              </span>
              <div className="flex flex-col gap-3 mt-1">
                {futureSubscriptions.map((sub) => (
                  <div key={sub.uuid} className="flex justify-between items-center p-3 bg-background border border-border-primary rounded-md">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-text-main">{sub.plan?.name || 'Plan desconocido'}</span>
                      <span className="text-xs text-text-muted">Inicia: {new Date(sub.startDate).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-main/10 text-brand-main rounded-sm">EN ESPERA</span>
                      <span className="text-xs text-text-muted">Vence: {new Date(sub.endDate).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface border border-border-primary rounded-lg p-6 flex flex-col justify-center gap-4 transition-colors shadow-sm">
              <div className="flex justify-between items-end">
                <span className={`text-xs font-bold uppercase tracking-wider ${isExpiredState ? 'text-danger-main' : 'text-text-muted'}`}>
                   Tiempo Restante
                </span>
                <span className={`text-sm font-bold ${isExpiredState ? 'text-danger-main' : 'text-text-main'}`}>
                  {daysRemaining > 0 ? `${daysRemaining} días` : '0 días'}
                </span>
              </div>
              <div className="w-full bg-border-primary h-2 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPercentage} aria-valuemin={0} aria-valuemax={100}>
                <div className={`${isExpiredState ? 'bg-danger-main' : 'bg-brand-main'} h-full rounded-full transition-all duration-500`} style={{ width: `${isExpiredState ? 100 : progressPercentage}%` }}></div>
              </div>
            </div>

            <div className={`bg-surface border ${isExpiredState ? 'border-danger-main/30' : 'border-border-primary'} rounded-lg p-6 flex flex-col justify-center gap-2 transition-colors shadow-sm`}>
              <span className={`text-xs font-bold uppercase tracking-wider ${isExpiredState ? 'text-danger-main' : 'text-text-muted'}`}>
                {isExpiredState ? 'Venció el' : 'Próximo Vencimiento'}
              </span>
              <span className="text-xl font-bold text-text-main">{nextDueDate}</span>
            </div>
          </div>

          <PaymentHistoryTable memberUuid={member.uuid} />
        </div>
      </div>

      {referenceSubscription && (
        <RenewPlanModal 
          isOpen={isRenewModalOpen} 
          onClose={() => setIsRenewModalOpen(false)} 
          member={member} 
          planName={planName} 
          planDuration={referenceSubscription.plan?.durationDays || 30} 
          planUuid={referenceSubscription.planUuid} 
          defaultAmount={Number(referenceSubscription.plan?.price || 0)} 
        />
      )}

      <ChangePlanModal 
        isOpen={isChangePlanModalOpen}
        onClose={() => setIsChangePlanModalOpen(false)}
        memberUuid={member.uuid}
        hasActiveSubscription={!!activeSubscription}
        nextDueDate={nextDueDate !== '-' ? nextDueDate : ''}
        plans={plans?.data || []} 
      />
    </section>
  );
}
