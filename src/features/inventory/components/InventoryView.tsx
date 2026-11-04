'use client';

import { useState } from 'react';
import { ProductsTable } from './ProductsTable';
import { CategoriesTable } from './CategoriesTable';
import { ProductModal } from './ProductModal';
import { CategoryModal } from './CategoryModal';
import { useAllCategories } from '../hooks/useInventory';
import {
  Package,
  Layers,
  Plus,
  Search,
  Filter,
} from 'lucide-react';

export function InventoryView() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>(
    'products'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const { data: categories = [] } = useAllCategories();

  return (
    <div className="flex flex-col gap-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tab Switcher */}
        <div
          className="flex bg-surface border border-border-primary rounded-lg p-1 w-max shadow-sm"
          role="tablist"
          aria-label="Pestañas de inventario"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'products'}
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-brand-surface text-brand-main shadow-xs'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            <Package size={14} aria-hidden="true" />
            <span>Productos</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'categories'}
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-brand-surface text-brand-main shadow-xs'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            <Layers size={14} aria-hidden="true" />
            <span>Categorías</span>
          </button>
        </div>

        {/* Action Button */}
        <div>
          {activeTab === 'products' ? (
            <button
              type="button"
              onClick={() => setIsProductModalOpen(true)}
              className="h-9 inline-flex items-center justify-center gap-2 px-4 rounded-lg bg-brand-main hover:bg-brand-hover text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={15} aria-hidden="true" />
              <span>Nuevo Producto</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="h-9 inline-flex items-center justify-center gap-2 px-4 rounded-lg bg-brand-main hover:bg-brand-hover text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={15} aria-hidden="true" />
              <span>Nueva Categoría</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeTab === 'products'
                ? 'Buscar por nombre o SKU...'
                : 'Buscar categoría...'
            }
            className="h-9 w-full pl-9 pr-4 text-xs rounded-lg bg-surface border border-border-primary text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand-main transition-colors shadow-xs"
          />
        </div>

        {activeTab === 'products' && (
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-text-muted" aria-hidden="true" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 bg-surface border border-border-primary text-xs font-medium rounded-lg px-3 text-text-main focus:outline-none focus:border-brand-main transition-colors shadow-xs cursor-pointer"
              aria-label="Filtrar productos por categoría"
            >
              <option value="">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c.uuid} value={c.uuid}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Content depending on active tab */}
      {activeTab === 'products' ? (
        <ProductsTable
          searchTerm={searchTerm}
          selectedCategoryUuid={selectedCategory}
        />
      ) : (
        <CategoriesTable searchTerm={searchTerm} />
      )}

      {/* Creation Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
}
