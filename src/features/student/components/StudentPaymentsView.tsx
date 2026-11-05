'use client';

import { useState } from 'react';
import { usePublicPaymentMethods } from '../hooks/useStudent';
import { PublicPaymentMethod } from '../interfaces/student.interface';
import {
  CreditCard,
  Copy,
  Check,
  Building,
  Banknote,
  MessageCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export function StudentPaymentsView() {
  const { data: paymentMethods = [], isLoading } = usePublicPaymentMethods();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (text: string, label: string, key: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older web views
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedKey(key);
      toast.success(`${label} copiado`);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      toast.error('No se pudo copiar el texto');
    }
  };

  // Fallback default methods if gym backend returns empty array initially
  const defaultBankTransfer: PublicPaymentMethod = {
    title: 'Transferencia Bancaria',
    bankName: 'Banco Galicia / Santander',
    alias: 'ENERGYAPP.OFICIAL',
    cbu: '0070123430000012345678',
    cvu: '',
    accountHolder: 'EnergyAPP S.R.L.',
    cuit: '30-71234567-9',
  };

  const methodsToDisplay =
    paymentMethods.length > 0 ? paymentMethods : [defaultBankTransfer];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight flex items-center gap-2">
          <CreditCard className="text-brand-main" size={22} aria-hidden="true" />
          <span>Información de Pagos</span>
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          Datos oficiales habilitados por el gimnasio para renovar tu membresía.
        </p>
      </div>

      {/* Mandatory Fixed Clarification Notice (CHGYM2-92) */}
      <div
        className="p-4 rounded-lg bg-brand-surface border border-brand-main/30 text-brand-main shadow-sm flex items-start gap-3"
        role="note"
      >
        <MessageCircle size={20} className="shrink-0 mt-0.5 text-brand-main" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-main">
            Instrucción de Confirmación
          </span>
          <p className="text-xs font-semibold text-text-main leading-relaxed">
            Una vez realizada la transferencia, envía el comprobante por WhatsApp a recepción.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="py-20 flex flex-col items-center justify-center text-text-muted">
          <Loader2 className="w-8 h-8 text-brand-main animate-spin mb-2" />
          <span className="text-xs font-medium">Cargando métodos de pago...</span>
        </div>
      )}

      {/* Payment Method Cards */}
      {!isLoading && (
        <div className="space-y-4">
          {methodsToDisplay.map((method, idx) => (
            <div
              key={method.uuid || idx}
              className="p-5 rounded-lg bg-surface border border-border-primary shadow-sm flex flex-col gap-4 transition-colors"
            >
              {/* Card Title */}
              <div className="flex items-center justify-between pb-3 border-b border-border-primary">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-surface text-brand-main flex items-center justify-center shrink-0">
                    <Building size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-text-main">
                      {method.title || 'Datos de Transferencia'}
                    </h2>
                    {method.bankName && (
                      <span className="text-[11px] text-text-muted font-medium">
                        {method.bankName}
                      </span>
                    )}
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-success-surface text-success-main border border-success-main/30 uppercase">
                  <ShieldCheck size={11} aria-hidden="true" />
                  <span>Oficial</span>
                </span>
              </div>

              {/* Data Items with Clipboard Buttons (CHGYM2-92) */}
              <div className="space-y-2.5 text-xs">
                {/* ALIAS */}
                {method.alias && (
                  <div className="p-3 rounded-lg bg-background border border-border-primary flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block">
                        Alias
                      </span>
                      <span className="font-mono font-bold text-text-main text-sm truncate block mt-0.5">
                        {method.alias}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          method.alias!,
                          'Alias',
                          `alias-${method.alias}`
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-brand-surface hover:bg-brand-main text-brand-main hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                      aria-label="Copiar alias"
                    >
                      {copiedKey === `alias-${method.alias}` ? (
                        <>
                          <Check size={13} className="text-success-main" aria-hidden="true" />
                          <span className="text-[11px]">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} aria-hidden="true" />
                          <span className="text-[11px]">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* CBU */}
                {method.cbu && (
                  <div className="p-3 rounded-lg bg-background border border-border-primary flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block">
                        CBU
                      </span>
                      <span className="font-mono font-bold text-text-main text-xs truncate block mt-0.5">
                        {method.cbu}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(method.cbu!, 'CBU', `cbu-${method.cbu}`)
                      }
                      className="px-3 py-1.5 rounded-lg bg-surface hover:bg-brand-main text-text-muted hover:text-white border border-border-primary text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                      aria-label="Copiar CBU"
                    >
                      {copiedKey === `cbu-${method.cbu}` ? (
                        <>
                          <Check size={13} className="text-success-main" aria-hidden="true" />
                          <span className="text-[11px]">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} aria-hidden="true" />
                          <span className="text-[11px]">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* CVU */}
                {method.cvu && (
                  <div className="p-3 rounded-lg bg-background border border-border-primary flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block">
                        CVU
                      </span>
                      <span className="font-mono font-bold text-text-main text-xs truncate block mt-0.5">
                        {method.cvu}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(method.cvu!, 'CVU', `cvu-${method.cvu}`)
                      }
                      className="px-3 py-1.5 rounded-lg bg-surface hover:bg-brand-main text-text-muted hover:text-white border border-border-primary text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                      aria-label="Copiar CVU"
                    >
                      {copiedKey === `cvu-${method.cvu}` ? (
                        <>
                          <Check size={13} className="text-success-main" aria-hidden="true" />
                          <span className="text-[11px]">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} aria-hidden="true" />
                          <span className="text-[11px]">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Titular & CUIT */}
                {(method.accountHolder || method.cuit) && (
                  <div className="p-3 rounded-lg bg-background border border-border-primary flex flex-col gap-1 text-[11px] text-text-muted">
                    {method.accountHolder && (
                      <p>
                        <span className="font-bold text-text-main">Titular:</span>{' '}
                        {method.accountHolder}
                      </p>
                    )}
                    {method.cuit && (
                      <p>
                        <span className="font-bold text-text-main">CUIT:</span>{' '}
                        <span className="font-mono">{method.cuit}</span>
                      </p>
                    )}
                  </div>
                )}

                {method.instructions && (
                  <p className="text-[11px] text-text-muted italic pt-1">
                    {method.instructions}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Cash / Counter payment option card */}
          <div className="p-4 rounded-lg bg-surface border border-border-primary flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-surface-hover flex items-center justify-center text-text-muted shrink-0">
              <Banknote size={18} aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-text-main">
                Efectivo o Tarjeta en Recepción
              </h3>
              <p className="text-[11px] text-text-muted">
                También podés abonar en el mostrador del gimnasio en tu próximo entrenamiento.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
