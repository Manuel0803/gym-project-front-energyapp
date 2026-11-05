'use client';

import { useState } from 'react';
import { useSales, useVoidSale } from '../hooks/usePos';
import { Sale } from '../interfaces/pos.interface';
import { useRole } from '@/features/auth/hooks/useRole';
import { Modal } from '@/common/components/ui/Modal';
import {
  CreditCard,
  Trash2,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Receipt,
  User,
} from 'lucide-react';

interface SalesHistoryTableProps {
  customerUuid?: string;
}

export function SalesHistoryTable({ customerUuid }: SalesHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [saleToVoid, setSaleToVoid] = useState<Sale | null>(null);

  // Anti-fraud role check: only ADMIN can void; STAFF is strictly read-only
  const { role, isAdmin, isSuperAdmin } = useRole();
  const canVoid = (isAdmin || isSuperAdmin) && role !== 'staff';

  const { data: response, isLoading } = useSales(
    currentPage,
    itemsPerPage,
    customerUuid
  );
  const { mutate: voidSale, isPending: isVoiding } = useVoidSale();

  const sales = response?.data || [];
  const totalPages = response?.meta?.lastPage || 1;

  const priceFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  });

  const handleVoidConfirm = () => {
    if (!saleToVoid) return;
    voidSale(saleToVoid.uuid, {
      onSettled: () => {
        setSaleToVoid(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-surface border border-border-primary rounded-lg overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto relative min-h-60" aria-live="polite">
          {isLoading && (
            <div className="absolute inset-0 bg-surface/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
              <Loader2 className="w-8 h-8 text-brand-main animate-spin mb-2" aria-hidden="true" />
              <span className="text-xs font-medium text-text-muted">Cargando ventas...</span>
            </div>
          )}

          <table className="w-full text-left text-xs min-w-160">
            <thead className="text-[10px] font-bold uppercase tracking-widest text-text-muted bg-background border-b border-border-primary">
              <tr>
                <th className="py-3 px-5 font-bold">Ticket</th>
                <th className="py-3 px-5 font-bold">Fecha</th>
                <th className="py-3 px-5 font-bold">Cliente</th>
                <th className="py-3 px-5 font-bold">Método de Pago</th>
                <th className="py-3 px-5 font-bold">Monto Total</th>
                <th className="py-3 px-5 font-bold text-right">Estado / Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary text-text-main">
              {sales.map((sale) => (
                <tr
                  key={sale.uuid}
                  className={`transition-colors ${
                    sale.isVoided
                      ? 'bg-danger-main/5 hover:bg-danger-main/10'
                      : 'hover:bg-surface-hover'
                  }`}
                >
                  <td className="py-3.5 px-5 font-mono font-bold text-text-main">
                    <div className="flex items-center gap-2">
                      <Receipt size={14} className="text-brand-main" aria-hidden="true" />
                      <span>#{sale.uuid.slice(0, 8).toUpperCase()}</span>
                    </div>
                  </td>
                  <td className={`py-3.5 px-5 ${sale.isVoided ? 'line-through text-text-muted' : ''}`}>
                    {new Date(sale.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3.5 px-5">
                    {sale.customer ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-text-main">
                        <User size={13} className="text-text-muted" aria-hidden="true" />
                        <span>
                          {sale.customer.name} {sale.customer.surname}
                        </span>
                      </span>
                    ) : (
                      <span className="text-text-muted italic">Consumidor Final</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <CreditCard size={14} aria-hidden="true" />
                      <span>{sale.paymentMethod}</span>
                    </div>
                  </td>
                  <td
                    className={`py-3.5 px-5 font-bold font-mono ${
                      sale.isVoided ? 'line-through text-text-muted' : 'text-text-main'
                    }`}
                  >
                    {priceFormatter.format(sale.total)}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {sale.isVoided ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-danger-main/30 bg-danger-surface text-danger-main text-[10px] font-bold uppercase">
                          <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-danger-main" aria-hidden="true" />
                          Anulado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-success-main/30 bg-success-surface text-success-main text-[10px] font-bold uppercase">
                          <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-success-main" aria-hidden="true" />
                          Cobrado
                        </span>
                      )}

                      {/* Anti-fraud requirement: Anular button renders ONLY for ADMIN (never for STAFF) */}
                      {!sale.isVoided && canVoid && (
                        <button
                          type="button"
                          onClick={() => setSaleToVoid(sale)}
                          className="p-1.5 rounded-md text-text-muted hover:text-danger-main hover:bg-danger-surface transition-colors cursor-pointer"
                          title="Anular ticket de venta"
                          aria-label={`Anular ticket de venta ${sale.uuid}`}
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {!isLoading && sales.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-text-muted text-xs">
                    No hay ventas registradas en el período.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <footer className="flex items-center justify-between px-6 py-3.5 border-t border-border-primary text-xs">
            <span className="text-text-muted">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isLoading}
                aria-label="Página anterior"
                className="p-1.5 rounded border border-border-primary text-text-main hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || isLoading}
                aria-label="Página siguiente"
                className="p-1.5 rounded border border-border-primary text-text-main hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </footer>
        )}
      </div>

      {/* Anti-fraud confirmation modal */}
      {canVoid && (
        <Modal
          isOpen={Boolean(saleToVoid)}
          onClose={() => !isVoiding && setSaleToVoid(null)}
          title="Anular Ticket de Venta"
        >
          <div className="flex flex-col gap-4 mt-2">
            <p className="text-xs text-text-main">
              ¿Estás seguro de que deseas anular el ticket de venta por{' '}
              <strong className="text-brand-main font-bold">
                {saleToVoid ? priceFormatter.format(saleToVoid.total) : 0}
              </strong>
              ?
            </p>

            <div
              className="p-3.5 border border-warning-main/30 bg-warning-surface rounded-xl flex flex-col gap-1.5"
              role="alert"
            >
              <div className="flex items-center gap-2 text-warning-main font-bold text-xs">
                <AlertTriangle size={16} aria-hidden="true" />
                <span>Advertencia de Control Antifraude</span>
              </div>
              <p className="text-[11px] text-text-main leading-relaxed">
                Esta acción marcará el ticket como <strong>ANULADO</strong>, restaurará automáticamente las unidades al inventario y restará el importe de la caja diaria.
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setSaleToVoid(null)}
                disabled={isVoiding}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-text-main border border-border-primary hover:bg-surface-hover transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleVoidConfirm}
                disabled={isVoiding}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-danger-main hover:bg-danger-hover text-white transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isVoiding ? (
                  <>
                    <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                    <span>Anulando...</span>
                  </>
                ) : (
                  <span>Confirmar Anulación</span>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
