'use client';

import { useState } from 'react';
import { Payment } from '../interfaces/payments.interface';
import { paymentMethods } from '../constants/payment-methods.constant';
import {
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  AlertTriangle,
  Loader2,
  Package,
} from 'lucide-react';
import { Modal } from '@/common/components/ui/Modal';
import { EditPaymentForm } from './EditPaymentForm';
import { useDeletePayment, usePayments } from '../hooks/usePayments';
import { useVoidSale } from '@/features/pos/hooks/usePos';
import { useRole } from '@/features/auth/hooks/useRole';

interface Props {
  memberUuid: string;
}

export function PaymentHistoryTable({ memberUuid }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'VALID' | 'VOIDED'>('VALID');
  const itemsPerPage = 5;

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentToVoid, setPaymentToVoid] = useState<Payment | null>(null);

  // Anti-fraud role check: only ADMIN (or SUPER_ADMIN) can void; STAFF is strictly read-only
  const { role, isAdmin, isSuperAdmin } = useRole();
  const canVoid = (isAdmin || isSuperAdmin) && role !== 'staff';

  const { mutate: deletePayment, isPending: isDeletingPayment } = useDeletePayment();
  const { mutate: voidSale, isPending: isVoidingSale } = useVoidSale();
  const isDeleting = isDeletingPayment || isVoidingSale;

  const { data: response, isLoading } = usePayments(
    currentPage,
    itemsPerPage,
    memberUuid,
    filter
  );

  const payments = response?.data || [];
  const totalPages = response?.meta?.lastPage || 1;

  const handleVoidPayment = () => {
    if (!paymentToVoid) return;

    // Connect product sale payments to PATCH /api/sales/:uuid/void
    if (paymentToVoid.type === 'PRODUCTS' || paymentToVoid.saleUuid) {
      const saleId = paymentToVoid.saleUuid || paymentToVoid.uuid;
      voidSale(saleId, {
        onSuccess: () => {
          setPaymentToVoid(null);
        },
      });
    } else {
      deletePayment(paymentToVoid.uuid, {
        onSuccess: () => {
          setPaymentToVoid(null);
        },
      });
    }
  };

  const priceFormatter = new Intl.NumberFormat('es-AR');

  return (
    <section className="bg-surface border border-border-primary rounded-lg p-6 overflow-hidden flex flex-col transition-colors shadow-sm">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">
          Historial de Pagos y Compras
        </h3>

        <div
          className="flex bg-background border border-border-primary rounded-lg p-1"
          role="group"
          aria-label="Filtro de estado de pagos"
        >
          <button
            onClick={() => {
              setFilter('VALID');
              setCurrentPage(1);
            }}
            aria-pressed={filter === 'VALID'}
            className={`px-4 py-1.5 text-[10px] font-bold rounded transition-colors tracking-wider uppercase cursor-pointer ${
              filter === 'VALID'
                ? 'bg-brand-main text-white shadow-sm'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            Válidos
          </button>
          <button
            onClick={() => {
              setFilter('VOIDED');
              setCurrentPage(1);
            }}
            aria-pressed={filter === 'VOIDED'}
            className={`px-4 py-1.5 text-[10px] font-bold rounded transition-colors tracking-wider uppercase cursor-pointer ${
              filter === 'VOIDED'
                ? 'bg-danger-main text-white shadow-sm'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            Anulados
          </button>
        </div>
      </header>

      <div className="overflow-x-auto relative min-h-50" aria-live="polite">
        {isLoading && (
          <div className="absolute inset-0 bg-surface/50 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 rounded-md">
            <Loader2
              className="w-6 h-6 animate-spin text-brand-main mb-2"
              aria-hidden="true"
            />
            <span className="text-xs font-medium text-text-muted">
              Cargando pagos...
            </span>
          </div>
        )}

        <table className="w-full min-w-160 text-left border-collapse">
          <thead>
            <tr className="border-b border-t border-border-primary">
              <th
                scope="col"
                className="pb-3 pt-3 text-xs font-bold text-text-muted uppercase tracking-wider"
              >
                Fecha
              </th>
              <th
                scope="col"
                className="pb-3 pt-3 text-xs font-bold text-text-muted uppercase tracking-wider"
              >
                Concepto
              </th>
              <th
                scope="col"
                className="pb-3 pt-3 text-xs font-bold text-text-muted uppercase tracking-wider"
              >
                Monto
              </th>
              <th
                scope="col"
                className="pb-3 pt-3 text-xs font-bold text-text-muted uppercase tracking-wider"
              >
                Método
              </th>
              <th
                scope="col"
                className="pb-3 pt-3 text-xs font-bold text-text-muted uppercase tracking-wider hidden sm:table-cell"
              >
                Notas
              </th>
              <th
                scope="col"
                className="pb-3 pt-3 text-xs font-bold text-text-muted uppercase tracking-wider text-right"
              >
                Estado / Acciones
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-text-main">
            {payments.map((payment) => {
              const isProductSale =
                payment.type === 'PRODUCTS' || Boolean(payment.saleUuid);

              return (
                <tr
                  key={payment.uuid}
                  className={`border-b border-border-primary transition-colors ${
                    payment.isVoided
                      ? 'bg-danger-main/5 hover:bg-danger-main/10'
                      : 'hover:bg-surface-hover'
                  }`}
                >
                  <td
                    className={`py-4 ${
                      payment.isVoided ? 'opacity-60 line-through' : ''
                    }`}
                  >
                    {new Date(payment.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="py-4">
                    {isProductSale ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold bg-brand-surface text-brand-main border border-brand-main/30">
                        <Package size={12} aria-hidden="true" />
                        <span>Productos</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold bg-surface border border-border-primary text-text-muted">
                        <CreditCard size={12} aria-hidden="true" />
                        <span>Membresía</span>
                      </span>
                    )}
                  </td>
                  <td
                    className={`py-4 font-bold ${
                      payment.isVoided
                        ? 'text-text-muted line-through'
                        : 'text-text-main'
                    }`}
                  >
                    ${priceFormatter.format(payment.amountPaid)}
                  </td>
                  <td
                    className={`py-4 ${payment.isVoided ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard
                        size={16}
                        className="text-text-muted"
                        aria-hidden="true"
                      />
                      <span>
                        {paymentMethods[payment.paymentMethod] ||
                          payment.paymentMethod}
                      </span>
                    </div>
                  </td>
                  <td
                    className="py-4 max-w-40 truncate hidden sm:table-cell"
                    title={payment.notes || ''}
                  >
                    {payment.notes ? (
                      <span
                        className={`text-sm ${
                          payment.isVoided
                            ? 'text-danger-main/80 font-medium'
                            : 'text-text-muted'
                        }`}
                      >
                        {payment.notes}
                      </span>
                    ) : (
                      <span
                        className="text-text-muted opacity-50"
                        aria-hidden="true"
                      >
                        -
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {payment.isVoided ? (
                        <span className="px-2.5 py-1 mr-2 rounded-md border border-danger-main/30 bg-danger-surface text-danger-main text-[10px] font-bold tracking-widest uppercase hidden md:inline-block">
                          Anulado
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 mr-2 rounded-md border border-success-main/30 bg-success-surface text-success-main text-[10px] font-bold tracking-widest uppercase hidden md:inline-block">
                          Pagado
                        </span>
                      )}

                      {!payment.isVoided && (
                        <>
                          <button
                            type="button"
                            onClick={() => setSelectedPayment(payment)}
                            className="p-1.5 rounded-md text-text-muted hover:text-brand-main hover:bg-brand-main/10 transition-colors cursor-pointer"
                            aria-label="Editar pago"
                            title="Editar pago"
                          >
                            <Edit2 size={16} aria-hidden="true" />
                          </button>

                          {/* Anti-fraud requirement: Anular button renders ONLY for ADMIN (never for STAFF) */}
                          {canVoid && (
                            <button
                              type="button"
                              onClick={() => setPaymentToVoid(payment)}
                              className="p-1.5 rounded-md text-text-muted hover:text-danger-main hover:bg-danger-main/10 transition-colors cursor-pointer"
                              aria-label="Anular pago"
                              title="Anular pago (Solo Administradores)"
                            >
                              <Trash2 size={16} aria-hidden="true" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {!isLoading && payments.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-text-muted text-sm"
                >
                  {filter === 'VOIDED'
                    ? 'No hay pagos anulados en el historial.'
                    : 'No hay pagos registrados para este miembro.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        title="Editar Pago"
      >
        {selectedPayment && (
          <EditPaymentForm
            payment={selectedPayment}
            onSuccess={() => setSelectedPayment(null)}
            onCancel={() => setSelectedPayment(null)}
          />
        )}
      </Modal>

      {/* Anti-fraud modal: only accessible if user has ADMIN role */}
      {canVoid && (
        <Modal
          isOpen={!!paymentToVoid}
          onClose={() => !isDeleting && setPaymentToVoid(null)}
          title={
            paymentToVoid?.type === 'PRODUCTS' || paymentToVoid?.saleUuid
              ? 'Anular Ticket de Venta de Productos'
              : 'Anular Pago de Membresía'
          }
        >
          <div className="flex flex-col gap-4 mt-2">
            <p className="text-sm text-text-main">
              Estás a punto de anular un registro por{' '}
              <strong className="text-brand-main">
                $
                {paymentToVoid
                  ? priceFormatter.format(paymentToVoid.amountPaid)
                  : 0}
              </strong>
              .
            </p>

            <div
              className="p-4 border border-warning-main/30 bg-warning-surface rounded-lg flex flex-col gap-2"
              role="alert"
            >
              <div className="flex items-center gap-2 text-warning-main font-bold">
                <AlertTriangle size={18} aria-hidden="true" />
                <h3>Advertencia de Auditoría Antifraude</h3>
              </div>
              <p className="text-xs text-text-main">
                {paymentToVoid?.type === 'PRODUCTS' ||
                paymentToVoid?.saleUuid ? (
                  <>
                    Al anular esta venta de productos, el ticket será marcado
                    como <strong>ANULADO</strong>, se restaurará el stock de
                    los productos en el inventario y dejará de sumar a la caja.
                    Esta operación queda registrada con tu usuario administrador.
                  </>
                ) : (
                  <>
                    El pago no se borrará de la base de datos por motivos de
                    auditoría, pero será marcado como <strong>ANULADO</strong> y
                    dejará de sumar en la caja diaria. Esta acción no se puede
                    deshacer.
                  </>
                )}
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setPaymentToVoid(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-text-main border border-border-primary hover:bg-surface-hover transition-colors rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleVoidPayment}
                disabled={isDeleting}
                className="py-2 px-6 text-sm font-medium text-white bg-danger-main hover:bg-danger-hover transition-colors rounded flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-35"
              >
                {isDeleting ? (
                  <>
                    <Loader2
                      className="w-4 h-4 animate-spin"
                      aria-hidden="true"
                    />{' '}
                    <span>Procesando...</span>
                  </>
                ) : (
                  <span>
                    {paymentToVoid?.type === 'PRODUCTS' ||
                    paymentToVoid?.saleUuid
                      ? 'Anular Venta'
                      : 'Anular Pago'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {totalPages > 1 && (
        <footer className="flex items-center justify-between mt-6 px-2 border-t border-border-primary pt-4">
          <span className="text-xs text-text-muted font-medium">
            Página {currentPage} de {totalPages}
          </span>
          <nav
            className="flex gap-2"
            aria-label="Navegación de historial de pagos"
          >
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
              aria-label="Página anterior"
              className="p-1.5 rounded-md border border-border-primary text-text-main hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading}
              aria-label="Página siguiente"
              className="p-1.5 rounded-md border border-border-primary text-text-main hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </nav>
        </footer>
      )}
    </section>
  );
}
