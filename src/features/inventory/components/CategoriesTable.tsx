'use client';

import { useState } from 'react';
import { useCategories, useDeleteCategory } from '../hooks/useInventory';
import { Category } from '../interfaces/inventory.interface';
import { CategoryModal } from './CategoryModal';
import { Modal } from '@/common/components/ui/Modal';
import { Edit2, Trash2, Loader2, AlertTriangle, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoriesTableProps {
  searchTerm: string;
}

export function CategoriesTable({ searchTerm }: CategoriesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const { data: response, isLoading } = useCategories({
    page: currentPage,
    limit: itemsPerPage,
    term: searchTerm || undefined,
  });

  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const categories = response?.data || [];
  const totalPages = response?.meta?.lastPage || 1;

  const handleDeleteConfirm = () => {
    if (!categoryToDelete) return;
    deleteCategory(categoryToDelete.uuid, {
      onSettled: () => {
        setCategoryToDelete(null);
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
              <span className="text-xs font-medium text-text-muted">Cargando categorías...</span>
            </div>
          )}

          <table className="w-full text-left text-xs min-w-160">
            <thead className="text-[10px] font-bold uppercase tracking-widest text-text-muted bg-background border-b border-border-primary">
              <tr>
                <th className="py-3 px-5 font-bold">Categoría</th>
                <th className="py-3 px-5 font-bold">Descripción</th>
                <th className="py-3 px-5 font-bold text-center">Productos</th>
                <th className="py-3 px-5 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary text-text-main">
              {categories.map((cat) => (
                <tr key={cat.uuid} className="hover:bg-surface-hover transition-colors">
                  <td className="py-3.5 px-5 font-bold text-text-main">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-brand-surface text-brand-main flex items-center justify-center font-bold shrink-0">
                        <Layers size={16} aria-hidden="true" />
                      </div>
                      <span className="truncate">{cat.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-text-muted max-w-72 truncate">
                    {cat.description || '-'}
                  </td>
                  <td className="py-3.5 px-5 text-center font-bold">
                    <span className="px-2 py-0.5 rounded-md bg-background border border-border-primary text-[10px] font-bold">
                      {cat.productsCount ?? 0}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setCategoryToEdit(cat)}
                        className="p-1.5 rounded-md text-text-muted hover:text-brand-main hover:bg-brand-surface transition-colors cursor-pointer"
                        title="Editar categoría"
                        aria-label={`Editar categoría ${cat.name}`}
                      >
                        <Edit2 size={15} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCategoryToDelete(cat)}
                        className="p-1.5 rounded-md text-text-muted hover:text-danger-main hover:bg-danger-surface transition-colors cursor-pointer"
                        title="Eliminar categoría"
                        aria-label={`Eliminar categoría ${cat.name}`}
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!isLoading && categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-14 text-center text-text-muted text-xs">
                    No se encontraron categorías registradas.
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

      {/* Edit Category Modal */}
      <CategoryModal
        isOpen={Boolean(categoryToEdit)}
        onClose={() => setCategoryToEdit(null)}
        categoryToEdit={categoryToEdit}
      />

      {/* Delete Confirmation Modal (handles 409 Conflict) */}
      <Modal
        isOpen={Boolean(categoryToDelete)}
        onClose={() => !isDeleting && setCategoryToDelete(null)}
        title="Eliminar Categoría"
      >
        <div className="flex flex-col gap-4 mt-1">
          <p className="text-xs text-text-main">
            ¿Estás seguro de que deseas eliminar la categoría{' '}
            <strong className="text-brand-main font-bold">
              {categoryToDelete?.name}
            </strong>
            ?
          </p>

          <div
            className="p-3.5 border border-warning-main/30 bg-warning-surface rounded-lg flex items-start gap-2.5 text-xs text-text-main"
            role="alert"
          >
            <AlertTriangle size={18} className="text-warning-main shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-[11px] leading-relaxed">
              Si existen productos vinculados a esta categoría, el sistema impedirá su eliminación para proteger la integridad del catálogo.
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-3">
            <button
              type="button"
              onClick={() => setCategoryToDelete(null)}
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
                <span>Eliminar Categoría</span>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
