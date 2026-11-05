'use client';

import { useState } from 'react';
import { useProducts, useAllCategories } from '@/features/inventory/hooks/useInventory';
import { Product } from '@/features/inventory/interfaces/inventory.interface';
import { CartItem } from '../interfaces/pos.interface';
import {
  Package,
  Search,
  AlertTriangle,
  AlertOctagon,
  Loader2,
  Plus,
  Check,
} from 'lucide-react';

interface ProductCatalogGridProps {
  onAddToCart: (product: Product) => void;
  cartItems: CartItem[];
}

export function ProductCatalogGrid({
  onAddToCart,
  cartItems,
}: ProductCatalogGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: categories = [] } = useAllCategories();
  const { data: response, isLoading } = useProducts({
    term: searchTerm || undefined,
    categoryUuid: selectedCategory || undefined,
    limit: 50,
  });

  const products = response?.data || [];

  const priceFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  });

  const getCartQuantity = (productUuid: string): number => {
    const item = cartItems.find((i) => i.product.uuid === productUuid);
    return item ? item.quantity : 0;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar producto por nombre o SKU..."
            className="h-9 w-full pl-9 pr-4 text-xs rounded-lg bg-surface border border-border-primary text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand-main transition-colors shadow-xs"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === ''
                ? 'bg-brand-surface text-brand-main font-bold shadow-xs'
                : 'bg-surface border border-border-primary text-text-muted hover:text-text-main hover:bg-surface-hover'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.uuid}
              type="button"
              onClick={() => setSelectedCategory(cat.uuid)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.uuid
                  ? 'bg-brand-surface text-brand-main font-bold shadow-xs'
                  : 'bg-surface border border-border-primary text-text-muted hover:text-text-main hover:bg-surface-hover'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="relative min-h-75">
        {isLoading && (
          <div className="absolute inset-0 bg-surface/50 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 rounded-lg">
            <Loader2 className="w-8 h-8 text-brand-main animate-spin mb-2" aria-hidden="true" />
            <span className="text-xs font-medium text-text-muted">Cargando catálogo...</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {products.map((product) => {
            const isOutOfStock = product.stock <= 0;
            const inCartQty = getCartQuantity(product.uuid);
            const remainingStock = product.stock - inCartQty;
            const isMaxInCart = remainingStock <= 0;

            return (
              <button
                key={product.uuid}
                type="button"
                onClick={() => !isOutOfStock && !isMaxInCart && onAddToCart(product)}
                disabled={isOutOfStock || isMaxInCart}
                aria-disabled={isOutOfStock || isMaxInCart}
                className={`relative flex flex-col justify-between p-3.5 rounded-lg border text-left transition-all group ${
                  isOutOfStock
                    ? 'opacity-40 cursor-not-allowed bg-surface/50 border-border-primary/50'
                    : isMaxInCart
                    ? 'opacity-60 cursor-not-allowed bg-surface border-border-primary'
                    : 'bg-surface border-border-primary hover:border-brand-main hover:shadow-sm cursor-pointer'
                }`}
              >
                {/* Cart badge indicator if added */}
                {inCartQty > 0 && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-brand-main text-white text-[10px] font-bold shadow-sm flex items-center gap-1 z-10">
                    <Check size={10} aria-hidden="true" />
                    <span>{inCartQty}</span>
                  </span>
                )}

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-background border border-border-primary text-text-muted font-medium truncate max-w-25">
                      {product.category?.name || 'General'}
                    </span>

                    {/* Stock Alert Visual */}
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-danger-main bg-danger-surface px-1.5 py-0.5 rounded border border-danger-main/30 uppercase">
                        <AlertOctagon size={10} aria-hidden="true" />
                        <span>Agotado</span>
                      </span>
                    ) : product.stock <= 5 ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-warning-main bg-warning-surface px-1.5 py-0.5 rounded border border-warning-main/30 uppercase">
                        <AlertTriangle size={10} aria-hidden="true" />
                        <span>{product.stock} un.</span>
                      </span>
                    ) : (
                      <span className="text-[9px] text-text-muted font-medium">
                        {product.stock} un.
                      </span>
                    )}
                  </div>

                  <div className="min-h-9 flex items-center">
                    <p className="text-xs font-bold text-text-main line-clamp-2 leading-tight">
                      {product.name}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-border-primary flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-brand-main">
                      {priceFormatter.format(product.price)}
                    </span>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                      isOutOfStock || isMaxInCart
                        ? 'bg-surface text-text-muted'
                        : 'bg-brand-surface text-brand-main group-hover:bg-brand-main group-hover:text-white'
                    }`}
                  >
                    <Plus size={14} aria-hidden="true" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {!isLoading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-surface border border-border-primary rounded-lg p-8">
            <Package size={36} className="text-text-muted mb-2 opacity-50" aria-hidden="true" />
            <p className="text-xs font-semibold text-text-main">
              No se encontraron productos
            </p>
            <p className="text-[11px] text-text-muted mt-1">
              Prueba cambiando el filtro de categoría o los términos de búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
