'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/common/components/ui/Modal';
import { InputField } from '@/common/components/ui/InputField';
import { TextareaField } from '@/common/components/ui/TextareaField';
import {
  CategoryFormValues,
  categorySchema,
} from '../schemas/category.schema';
import {
  useCreateCategory,
  useUpdateCategory,
} from '../hooks/useInventory';
import { Category } from '../interfaces/inventory.interface';
import { Loader2, Tags } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: Category | null;
}

export function CategoryModal({
  isOpen,
  onClose,
  categoryToEdit,
}: CategoryModalProps) {
  const isEditing = Boolean(categoryToEdit);
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (categoryToEdit) {
      reset({
        name: categoryToEdit.name,
        description: categoryToEdit.description || '',
      });
    } else {
      reset({
        name: '',
        description: '',
      });
    }
  }, [categoryToEdit, reset, isOpen]);

  const onSubmit = (data: CategoryFormValues) => {
    if (isEditing && categoryToEdit) {
      updateCategory(
        { uuid: categoryToEdit.uuid, payload: data },
        {
          onSuccess: () => {
            onClose();
            reset();
          },
        }
      );
    } else {
      createCategory(data, {
        onSuccess: () => {
          onClose();
          reset();
        },
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isPending ? () => {} : onClose}
      title={isEditing ? 'Editar Categoría' : 'Nueva Categoría de Productos'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <InputField
          label="NOMBRE DE CATEGORÍA"
          type="text"
          placeholder="ej: Bebidas, Suplementos, Ropa"
          disabled={isPending}
          registration={register('name')}
          error={errors.name?.message}
          icon={
            <Tags
              size={16}
              className="text-text-muted transition-colors"
              aria-hidden="true"
            />
          }
          className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_input]:bg-sidebar"
        />

        <TextareaField
          label="DESCRIPCIÓN (OPCIONAL)"
          placeholder="Detalles sobre los productos de esta categoría..."
          disabled={isPending}
          registration={register('description')}
          error={errors.description?.message}
          rows={3}
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
              <span>{isEditing ? 'Guardar Cambios' : 'Crear Categoría'}</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
