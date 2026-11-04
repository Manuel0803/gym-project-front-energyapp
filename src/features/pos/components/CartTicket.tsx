'use client';

import { useState } from 'react';
import { CartItem, PosPaymentMethod } from '../interfaces/pos.interface';
import { Member } from '@/features/members/interfaces/members.interface';
import { useCreateSale } from '../hooks/usePos';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Banknote,
  CreditCard,
  QrCode,
  Loader2,
  Receipt,
  User,
} from 'lucide-react';

interface CartTicketProps {
  items: CartItem[];
  onUpdateQuantity: (productUuid: string, newQuantity: number) => void;
  onRemoveItem: (productUuid: string) => void;
  onClearCart: () => void;
  selectedMember: Member | null;
  onSaleSuccess: () => void;
}

export function CartTicket({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  selectedMember,
  onSaleSuccess,
}: CartTicketProps) {
  const [paymentMethod, setPaymentMethod] = useState<PosPaymentMethod>('CASH');
  const { mutate: createSale, isPending } = useCreateSale();

  const priceFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  });

  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleConfirmSale = () => {
    if (items.length === 0 || isPending) return;

    createSale(
      {
        customerUuid: selectedMember?.user?.uuid || selectedMember?.uuid || undefined,
        paymentMethod,
        items: items.map((i) => ({
          productUuid: i.product.uuid,
          quantity: i.quantity,
        })),
      },
      {
        onSuccess: () => {
          onSaleSuccess();
        },
      }
    );
  };

  return (
    <div className="bg-surface border border-border-primary rounded-lg flex flex-col h-full shadow-sm overflow-hidden transition-colors">
      {/* Ticket Header */}
      <div className="p-4 border-b border-border-primary flex items-center justify-between bg-surface-hover/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-surface text-brand-main flex items-center justify-center">
            <Receipt size={18} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-main">
              Ticket de Venta
            </h2>
            <p className="text-[10px] text-text-muted">
              {totalUnits} {totalUnits === 1 ? 'artículo' : 'artículos'}
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            disabled={isPending}
            className="text-[11px] font-semibold text-danger-main hover:text-danger-hover flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
            title="Vaciar ticket"
          >
            <Trash2 size={13} aria-hidden="true" />
            <span>Vaciar</span>
          </button>
        )}
      </div>

      {/* Associated Customer Badge */}
      <div className="px-4 py-2.5 bg-background border-b border-border-primary flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <User size={14} className="text-text-muted shrink-0" aria-hidden="true" />
          <span className="text-[11px] text-text-muted">Cliente:</span>
          {selectedMember ? (
            <span className="text-[11px] font-bold text-brand-main truncate">
              {selectedMember.name} {selectedMember.surname}
            </span>
          ) : (
            <span className="text-[11px] text-text-muted italic">
              Consumidor Final (Opcional)
            </span>
          )}
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-60 max-h-[calc(100vh-420px)] scrollbar-thin">
        {items.map((item) => {
          const itemSubtotal = item.product.price * item.quantity;
          const isAtMaxStock = item.quantity >= item.product.stock;

          return (
            <div
              key={item.product.uuid}
              className="p-3 rounded-lg bg-background border border-border-primary flex flex-col gap-2 hover:border-brand-main/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-text-main truncate">
                    {item.product.name}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {priceFormatter.format(item.product.price)} c/u
                  </p>
                </div>
                <span className="text-xs font-bold text-text-main">
                  {priceFormatter.format(itemSubtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border-primary/50">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (item.quantity <= 1) {
                        onRemoveItem(item.product.uuid);
                      } else {
                        onUpdateQuantity(item.product.uuid, item.quantity - 1);
                      }
                    }}
                    disabled={isPending}
                    className="w-7 h-7 rounded-md bg-surface border border-border-primary flex items-center justify-center text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors cursor-pointer disabled:opacity-50"
                    aria-label={`Disminuir cantidad de ${item.product.name}`}
                  >
                    <Minus size={13} aria-hidden="true" />
                  </button>

                  <span className="w-8 text-center text-xs font-bold text-text-main font-mono">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (!isAtMaxStock) {
                        onUpdateQuantity(item.product.uuid, item.quantity + 1);
                      }
                    }}
                    disabled={isAtMaxStock || isPending}
                    className="w-7 h-7 rounded-md bg-surface border border-border-primary flex items-center justify-center text-text-muted hover:text-text-main hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    aria-label={`Aumentar cantidad de ${item.product.name}`}
                    title={isAtMaxStock ? 'Límite de stock disponible alcanzado' : undefined}
                  >
                    <Plus size={13} aria-hidden="true" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-text-muted font-medium">
                    (Disp: {item.product.stock})
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.product.uuid)}
                    disabled={isPending}
                    className="p-1 rounded text-text-muted hover:text-danger-main hover:bg-danger-surface transition-colors cursor-pointer"
                    title="Eliminar ítem"
                    aria-label={`Eliminar ${item.product.name} del carrito`}
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center py-12 text-center text-text-muted">
            <div className="w-12 h-12 rounded-full bg-surface-hover flex items-center justify-center mb-3">
              <ShoppingCart size={22} className="opacity-50" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold text-text-main">
              El ticket está vacío
            </p>
            <p className="text-[11px] text-text-muted mt-1 max-w-45">
              Haz clic en los productos del catálogo para agregarlos a la venta.
            </p>
          </div>
        )}
      </div>

      {/* Checkout and Totals Footer */}
      <div className="p-4 bg-surface border-t border-border-primary flex flex-col gap-4">
        {/* Payment Methods */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Método de Pago
          </label>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Método de pago">
            <button
              type="button"
              role="radio"
              aria-checked={paymentMethod === 'CASH'}
              onClick={() => setPaymentMethod('CASH')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-semibold gap-1 transition-all cursor-pointer ${
                paymentMethod === 'CASH'
                  ? 'bg-brand-surface border-brand-main text-brand-main font-bold shadow-xs'
                  : 'bg-background border-border-primary text-text-muted hover:text-text-main'
              }`}
            >
              <Banknote size={16} aria-hidden="true" />
              <span className="text-[11px]">Efectivo</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={paymentMethod === 'CARD'}
              onClick={() => setPaymentMethod('CARD')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-semibold gap-1 transition-all cursor-pointer ${
                paymentMethod === 'CARD'
                  ? 'bg-brand-surface border-brand-main text-brand-main font-bold shadow-xs'
                  : 'bg-background border-border-primary text-text-muted hover:text-text-main'
              }`}
            >
              <CreditCard size={16} aria-hidden="true" />
              <span className="text-[11px]">Tarjeta</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={paymentMethod === 'MERCADO_PAGO'}
              onClick={() => setPaymentMethod('MERCADO_PAGO')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-semibold gap-1 transition-all cursor-pointer ${
                paymentMethod === 'MERCADO_PAGO'
                  ? 'bg-brand-surface border-brand-main text-brand-main font-bold shadow-xs'
                  : 'bg-background border-border-primary text-text-muted hover:text-text-main'
              }`}
            >
              <QrCode size={16} aria-hidden="true" />
              <span className="text-[11px]">MercadoPago</span>
            </button>
          </div>
        </div>

        {/* Total Calculation */}
        <div className="pt-2 border-t border-border-primary flex items-baseline justify-between">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Total a Cobrar
          </span>
          <span className="text-2xl font-bold text-brand-main font-mono">
            {priceFormatter.format(totalAmount)}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleConfirmSale}
          disabled={items.length === 0 || isPending}
          className="w-full py-2.5 px-4 rounded-lg bg-brand-main hover:bg-brand-hover text-white font-medium text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              <span>Confirmando Venta...</span>
            </>
          ) : (
            <>
              <ShoppingCart size={18} aria-hidden="true" />
              <span>Confirmar Venta</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
