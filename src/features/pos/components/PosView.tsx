'use client';

import { useState } from 'react';
import { Member } from '@/features/members/interfaces/members.interface';
import { Product } from '@/features/inventory/interfaces/inventory.interface';
import { CartItem } from '../interfaces/pos.interface';
import { MemberTypeahead } from './MemberTypeahead';
import { ProductCatalogGrid } from './ProductCatalogGrid';
import { CartTicket } from './CartTicket';
import { SalesHistoryTable } from './SalesHistoryTable';
import { ShoppingBag, ReceiptText } from 'lucide-react';

export function PosView() {
  const [activeTab, setActiveTab] = useState<'pos' | 'history'>('pos');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.product.uuid === product.uuid);
      if (existing) {
        // Do not exceed available stock
        if (existing.quantity >= product.stock) {
          return prevItems;
        }
        return prevItems.map((i) =>
          i.product.uuid === product.uuid
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productUuid: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.product.uuid === productUuid) {
            const validQuantity = Math.min(
              Math.max(1, newQuantity),
              item.product.stock
            );
            return { ...item, quantity: validQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productUuid: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.uuid !== productUuid)
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSaleSuccess = () => {
    // Reset cart and member association after successful checkout
    setCartItems([]);
    setSelectedMember(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-border-primary pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('pos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'pos'
              ? 'bg-brand-main text-white shadow-xs'
              : 'bg-surface border border-border-primary text-text-muted hover:text-text-main hover:bg-surface-hover'
          }`}
        >
          <ShoppingBag size={15} aria-hidden="true" />
          <span>Terminal de Venta (Caja)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-brand-main text-white shadow-xs'
              : 'bg-surface border border-border-primary text-text-muted hover:text-text-main hover:bg-surface-hover'
          }`}
        >
          <ReceiptText size={15} aria-hidden="true" />
          <span>Historial de Ventas y Tickets</span>
        </button>
      </div>

      {/* POS Terminal Tab */}
      {activeTab === 'pos' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Member Typeahead & Product Catalog */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            <div className="bg-surface border border-border-primary rounded-lg p-4 md:p-5 shadow-sm transition-colors">
              <MemberTypeahead
                selectedMember={selectedMember}
                onSelectMember={setSelectedMember}
              />
            </div>

            <div className="bg-surface border border-border-primary rounded-lg p-4 md:p-5 shadow-sm transition-colors">
              <ProductCatalogGrid
                onAddToCart={handleAddToCart}
                cartItems={cartItems}
              />
            </div>
          </div>

          {/* Right Column: Ticket / Cart & Checkout */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-4">
            <CartTicket
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              selectedMember={selectedMember}
              onSaleSuccess={handleSaleSuccess}
            />
          </div>
        </div>
      ) : (
        /* Sales History Tab */
        <SalesHistoryTable />
      )}
    </div>
  );
}
