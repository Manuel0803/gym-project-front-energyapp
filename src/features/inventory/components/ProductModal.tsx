'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/common/components/ui/Modal';
import { InputField } from '@/common/components/ui/InputField';
import { SelectField } from '@/common/components/ui/SelectField';
import { TextareaField } from '@/common/components/ui/TextareaField';
import {
  ProductFormValues,
  productSchema,
} from '../schemas/product.schema';
import {
  useAllCategories,
  useCreateProduct,
  useUpdateProduct,
} from '../hooks/useInventory';
import { Product } from '../interfaces/inventory.interface';
import { Loader2, DollarSign, Package, Barcode, Tag } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export function ProductModal({
  isOpen,
  onClose,
  productToEdit,
}: ProductModalProps) {
  const isEditing = Boolean(productToEdit);
  const { data: categories = [], isLoading: isLoadingCategories } =
    useAllCategories();

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: 0,
      stock: 0,
      categoryUuid: '',
      description: '',
      sku: '',
      barcode: '',
    },
  });

  useEffect(() => {
    if (productToEdit) {
      reset({
        name: productToEdit.name,
        price: productToEdit.price,
        stock: productToEdit.stock,
        categoryUuid: productToEdit.categoryUuid,
        description: productToEdit.description || '',
        sku: productToEdit.sku || '',
        barcode: productToEdit.barcode || '',
      });
    } else {
      reset({
        name: '',
        price: 0,
        stock: 0,
        categoryUuid: categories[0]?.uuid || '',
        description: '',
        sku: '',
        barcode: '',
      });
    }
  }, [productToEdit, categories, reset, isOpen]);

  const onSubmit = (data: ProductFormValues) => {
    const payload = {
      name: data.name.trim(),
      price: Number(data.price),
      salePrice: Number(data.price),
      stock: Number(data.stock),
      categoryUuid: data.categoryUuid || categories[0]?.uuid || '',
      description: data.description?.trim() || undefined,
      sku: data.sku?.trim() || undefined,
      barcode: data.barcode?.trim() || data.sku?.trim() || undefined,
    };

    if (isEditing && productToEdit) {
      updateProduct(
        { uuid: productToEdit.uuid, payload },
        {
          onSuccess: () => {
            onClose();
            reset();
          },
        }
      );
    } else {
      createProduct(payload, {
        onSuccess: () => {
          onClose();
          reset();
        },
      });
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.uuid,
    label: cat.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={isPending ? () => {} : onClose}
      title={isEditing ? 'Editar Producto' : 'Nuevo Producto en Inventario'}
      maxWidthClass="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <InputField
          label="NOMBRE DEL PRODUCTO"
          type="text"
          placeholder="ej: Bebida Isotónica 500ml, Proteína Whey 1kg"
          disabled={isPending}
          registration={register('name')}
          error={errors.name?.message}
          icon={<Tag size={16} className="text-text-muted" aria-hidden="true" />}
          className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_input]:bg-sidebar"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="PRECIO DE VENTA ($)"
            type="number"
            step="0.01"
            placeholder="0.00"
            disabled={isPending}
            registration={register('price')}
            error={errors.price?.message}
            icon={
              <DollarSign size={16} className="text-text-muted" aria-hidden="true" />
            }
            className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_input]:bg-sidebar"
          />

          <InputField
            label="STOCK DISPONIBLE"
            type="number"
            step="1"
            placeholder="0"
            disabled={isPending}
            registration={register('stock')}
            error={errors.stock?.message}
            icon={
              <Package size={16} className="text-text-muted" aria-hidden="true" />
            }
            className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_input]:bg-sidebar"
          />
        </div>

        <SelectField
          label="CATEGORÍA"
          disabled={isPending || isLoadingCategories}
          registration={register('categoryUuid')}
          error={errors.categoryUuid?.message}
          className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_select]:bg-sidebar"
        >
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </SelectField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="CÓDIGO SKU (OPCIONAL)"
            type="text"
            placeholder="SKU-1024"
            disabled={isPending}
            registration={register('sku')}
            error={errors.sku?.message}
            className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_input]:bg-sidebar"
          />

          <InputField
            label="CÓDIGO DE BARRAS (OPCIONAL)"
            type="text"
            placeholder="779123456789"
            disabled={isPending}
            registration={register('barcode')}
            error={errors.barcode?.message}
            icon={
              <Barcode size={16} className="text-text-muted" aria-hidden="true" />
            }
            className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_input]:bg-sidebar"
          />
        </div>

        <TextareaField
          label="DESCRIPCIÓN (OPCIONAL)"
          placeholder="Presentación, sabor, tamaño o especificaciones..."
          disabled={isPending}
          registration={register('description')}
          error={errors.description?.message}
          rows={2}
          className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_textarea]:bg-sidebar"
        />

        <div className="flex justify-end gap-3 pt-3 border-t border-border-primary">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-text-main border border-border-primary hover:bg-surface-hover transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg bg-brand-main hover:bg-brand-hover text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                <span>Guardando...</span>
              </>
            ) : (
              <span>{isEditing ? 'Guardar Cambios' : 'Registrar Producto'}</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
