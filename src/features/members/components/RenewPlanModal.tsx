import { useState } from 'react';
import { Modal } from '@/common/components/ui/Modal';
import { Loader2, Calendar, CreditCard } from 'lucide-react';
import { useRenewPlan } from '../hooks/useMembers';
import { Member } from '../interfaces/members.interface';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  planName: string;
  planDuration: number;
  planUuid: string;
  defaultAmount: number;
}

interface RenewPlanPayload {
  planUuid: string;
  registerPayment: boolean;
  paymentMethod: string;
  customStartDate?: string;
}

export function RenewPlanModal({ 
  isOpen, 
  onClose, 
  member, 
  planName, 
  planDuration, 
  planUuid, 
  defaultAmount 
}: Props) {
  const [registerPayment, setRegisterPayment] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [isRetroactive, setIsRetroactive] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  
  const { mutate: renewPlan, isPending } = useRenewPlan();

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setRegisterPayment(true);
      setPaymentMethod('CASH');
      setIsRetroactive(false);
      setCustomStartDate('');
    }
  }

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleRenew = () => {
    const payload: RenewPlanPayload = { 
      planUuid,
      registerPayment,
      paymentMethod,
    };

    if (isRetroactive && customStartDate) {
      const dateObj = new Date(customStartDate + 'T12:00:00');
      payload.customStartDate = dateObj.toISOString();
    }

    renewPlan(
      { id: member.uuid, payload },
      { onSuccess: handleClose }
    );
  };

  const priceFormatter = new Intl.NumberFormat('es-AR');

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Renovar Plan">
      <div className="flex flex-col gap-5">
        <p className="text-sm text-text-muted">
          Estás por asignar una renovación de plan. Se sumarán <strong className="text-text-main">{planDuration} días</strong> adicionales a la suscripción de <strong className="text-text-main">{member.name}</strong>.
        </p>

        <div className="bg-surface-hover border border-border-primary rounded-lg p-4 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Plan a renovar</span>
            <span className="font-bold text-text-main">{planName}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Valor Referencia</span>
            <span className="text-xl font-bold text-brand-main">${priceFormatter.format(defaultAmount)}</span>
          </div>
        </div>

        <fieldset className="flex flex-col gap-4 border border-border-primary rounded-lg p-4 bg-background">
          <legend className="sr-only">Configuración de fecha</legend>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isRetroactive}
              onChange={(e) => setIsRetroactive(e.target.checked)}
              disabled={isPending}
              className="accent-brand-main w-4 h-4"
            />
            <span className="text-sm font-bold text-text-main flex items-center gap-2">
              <Calendar size={16} className="text-text-muted" aria-hidden="true" />
              Carga retroactiva (Fecha manual)
            </span>
          </label>

          {isRetroactive && (
            <div className="flex flex-col gap-2 pt-2 border-t border-border-primary animate-in fade-in zoom-in-95 duration-200">
              <label htmlFor="customDate" className="text-xs font-bold text-text-muted uppercase tracking-wider">
                ¿Qué día inició realmente?
              </label>
              <input 
                id="customDate"
                type="date" 
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                disabled={isPending}
                className="w-full bg-surface border border-border-primary text-text-main text-sm rounded-md focus:ring-brand-main focus:border-brand-main block p-2.5 outline-none transition-colors"
              />
              <span className="text-xs text-brand-main">
                El vencimiento se calculará {planDuration} días a partir de la fecha seleccionada.
              </span>
            </div>
          )}
        </fieldset>

        <fieldset className="flex flex-col gap-4 border border-border-primary rounded-lg p-4 bg-background">
          <legend className="sr-only">Configuración de pago</legend>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={registerPayment}
              onChange={(e) => setRegisterPayment(e.target.checked)}
              disabled={isPending}
              className="accent-brand-main w-4 h-4"
            />
            <span className="text-sm font-bold text-text-main flex items-center gap-2">
              <CreditCard size={16} className="text-text-muted" aria-hidden="true" />
              Registrar pago en el sistema
            </span>
          </label>

          {registerPayment ? (
            <div className="flex flex-col gap-2 pt-2 border-t border-border-primary animate-in fade-in zoom-in-95 duration-200">
              <label htmlFor="paymentMethod" className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Método de Pago
              </label>
              <select 
                id="paymentMethod"
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value)} 
                disabled={isPending} 
                className="w-full bg-surface border border-border-primary text-text-main text-sm rounded-md focus:ring-brand-main focus:border-brand-main block p-2.5 outline-none transition-colors"
              >
                <option value="CASH">Efectivo</option>
                <option value="DEBIT_CARD">Tarjeta de Débito</option>
                <option value="CREDIT_CARD">Tarjeta de Crédito</option>
                <option value="BANK_TRANSFER">Transferencia Bancaria</option>
                <option value="MERCADO_PAGO">Mercado Pago</option>
                <option value="OTHER">Otro</option>
              </select>
            </div>
          ) : (
            <div className="pt-2 border-t border-border-primary animate-in fade-in duration-200" role="alert">
              <p className="text-xs text-warning-main font-medium leading-relaxed">
                Se asignará la suscripción, pero no impactará en el historial de pagos ni en la caja.
              </p>
            </div>
          )}
        </fieldset>

        <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-border-primary">
          <button 
            type="button" 
            onClick={handleClose} 
            disabled={isPending} 
            className="px-4 py-2 text-sm font-bold text-text-muted hover:text-text-main transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            type="button" 
            onClick={handleRenew} 
            disabled={isPending || (isRetroactive && !customStartDate)} 
            className="flex items-center justify-center gap-2 px-6 py-2 bg-brand-main text-white text-sm font-bold rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-35 cursor-pointer"
          >
            {isPending ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Procesando...</> : 'Confirmar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
