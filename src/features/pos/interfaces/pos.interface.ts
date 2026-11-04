import { Product } from '@/features/inventory/interfaces/inventory.interface';
import { Member } from '@/features/members/interfaces/members.interface';

export type PosPaymentMethod = 'CASH' | 'CARD' | 'MERCADO_PAGO';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SaleItemPayload {
  productUuid: string;
  quantity: number;
}

export interface CreateSalePayload {
  customerUuid?: string;
  paymentMethod: PosPaymentMethod | string;
  items: SaleItemPayload[];
}

export interface SaleItem {
  uuid: string;
  productUuid: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product?: Product;
}

export interface Sale {
  uuid: string;
  customerUuid?: string;
  paymentMethod: string;
  total: number;
  isVoided: boolean;
  createdAt: string;
  customer?: Member;
  items: SaleItem[];
}
