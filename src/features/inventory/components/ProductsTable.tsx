'use client';

import { useState } from 'react';
import { useProducts, useDeleteProduct } from '../hooks/useInventory';
import { Product } from '../interfaces/inventory.interface';
import { ProductModal } from './ProductModal';
import { Modal } from '@/common/components/ui/Modal';
import {
  Edit2,
  Trash2,
  Loader2,
  Package,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface ProductsTableProps {
  searchTerm: string;
  selectedCategoryUuid: string;
}

export function ProductsTable({
  searchTerm,
  selectedCategoryUuid,
}: ProductsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { data: response, isLoading } = useProducts({
    page: currentPage,
    limit: itemsPerPage,
    term: searchTerm || undefined,
    categoryUuid: selectedCategoryUuid || undefined,
  });

  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const products = response?.data || [];
  const totalPages = response?.meta?.lastPage || 1;

  const priceFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  });

  const handleDeleteConfirm = () => {
    if (!productToDelete) return;
    deleteProduct(productToDelete.uuid, {
      onSettled: () => {
        setProductToDelete(null);
      },
    });
  };

  /**
   * Evaluates the product stock and returns visual alert badges.
   * Requirement: Red badge for stock === 0 (Sin stock) or <= 5 (Stock crítico).
   */
  const renderStockBadge = (stock: number) => {
    if (stock <= 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold border rounded-md uppercase bg-danger-surface text-danger-main border-danger-main/30">
          <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-danger-main" aria-hidden="true" />
          <span>Sin stock</span>
        </span>
      );
    }

    if (stock <= 5) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold border rounded-md uppercase bg-warning-surface text-warning-main border-warning-main/30">
          <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-warning-main" aria-hidden="true" />
          <span>Stock crítico: {stock} un.</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium border rounded-md bg-surface border-border-primary text-text-main">
        <span>{stock} unidades</span>
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-surface border border-border-primary rounded-lg overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto relative min-h-60" aria-live="polite">
          {isLoading && (
            <div className="absolute inset-0 bg-surface/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
              <Loader2 className="w-8 h-8 text-brand-main animate-spin mb-2" aria-hidden="true" />
              <span className="text-xs font-medium text-text-muted">Cargando productos...</span>
            </div>
          )}

          <table className="w-full text-left text-xs min-w-180">
            <thead className="text-[10px] font-bold uppercase tracking-widest text-text-muted bg-background border-b border-border-primary">
              <tr>
                <th className="py-3 px-5 font-bold">Producto</th>
                <th className="py-3 px-5 font-bold">Categoría</th>
                <th className="py-3 px-5 font-bold">Precio</th>
                <th className="py-3 px-5 font-bold text-center">Nivel de Stock</th>
                <th className="py-3 px-5 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary text-text-main">
              {products.map((prod) => (
                <tr key={prod.uuid} className="hover:bg-surface-hover transition-colors">
                  <td className="py-3.5 px-5 font-bold text-text-main">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-brand-surface text-brand-main flex items-center justify-center shrink-0">
                        <Package size={16} aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-text-main">
                          {prod.name}
                        </p>
                        {prod.sku && (
                          <span className="text-[10px] text-text-muted font-mono block">
                            SKU: {prod.sku}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-text-muted">
                    <span className="px-2 py-0.5 rounded bg-background border border-border-primary text-[10px] font-semibold">
                      {prod.category?.name || 'General'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-bold text-text-main">
                    {priceFormatter.format(prod.price)}
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    {renderStockBadge(prod.stock)}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setProductToEdit(prod)}
                        className="p-1.5 rounded-md text-text-muted hover:text-brand-main hover:bg-brand-surface transition-colors cursor-pointer"
                        title="Editar producto"
                        aria-label={`Editar producto ${prod.name}`}
                      >
                        <Edit2 size={15} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setProductToDelete(prod)}
                        className="p-1.5 rounded-md text-text-muted hover:text-danger-main hover:bg-danger-surface transition-colors cursor-pointer"
                        title="Eliminar producto"
                        aria-label={`Eliminar producto ${prod.name}`}
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!isLoading && products.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-14 text-center text-text-muted text-xs">
                    No se encontraron productos registrados en el inventario.
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

      {/* Edit Product Modal */}
      <ProductModal
        isOpen={Boolean(productToEdit)}
        onClose={() => setProductToEdit(null)}
        productToEdit={productToEdit}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(productToDelete)}
        onClose={() => !isDeleting && setProductToDelete(null)}
        title="Eliminar Producto"
      >
        <div className="flex flex-col gap-4 mt-1">
          <p className="text-xs text-text-main">
            ¿Estás seguro de que deseas eliminar el producto{' '}
            <strong className="text-brand-main font-bold">
              {productToDelete?.name}
            </strong>
            ?
          </p>

          <p className="text-[11px] text-text-muted leading-relaxed">
            Esta acción quitará el producto del catálogo y no estará disponible para ventas en el Punto de Venta (POS).
          </p>

          <div className="flex justify-end gap-3 mt-3">
            <button
              type="button"
              onClick={() => setProductToDelete(null)}
              disabled={isDeleting}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-text-main border border-border-primary hover:bg-surface-hover transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-danger-main hover:bg-danger-hover text-white transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                  <span>Eliminando...</span>
                </>
              ) : (
                <span>Eliminar Producto</span>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
