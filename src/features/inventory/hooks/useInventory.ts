import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InventoryService } from '../services/inventory.service';
import {
  CreateCategoryPayload,
  CreateProductPayload,
  GetCategoriesParams,
  GetProductsParams,
  UpdateCategoryPayload,
  UpdateProductPayload,
} from '../interfaces/inventory.interface';
import { ApiError } from '@/common/interfaces/api-error.interface';
import toast from 'react-hot-toast';

/* ================= CATEGORIES HOOKS ================= */

export const useCategories = (params: GetCategoriesParams = {}) => {
  return useQuery({
    queryKey: ['inventory-categories', params],
    queryFn: () => InventoryService.getCategories(params),
    staleTime: 1000 * 30,
  });
};

export const useAllCategories = () => {
  return useQuery({
    queryKey: ['inventory-categories', 'all'],
    queryFn: () => InventoryService.getAllCategoriesList(),
    staleTime: 1000 * 60,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      InventoryService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-categories'] });
      toast.success('Categoría creada exitosamente');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;
      toast.error(
        Array.isArray(message)
          ? message[0]
          : message || 'Error al crear la categoría'
      );
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      uuid,
      payload,
    }: {
      uuid: string;
      payload: UpdateCategoryPayload;
    }) => InventoryService.updateCategory(uuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-categories'] });
      toast.success('Categoría actualizada con éxito');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;
      toast.error(
        Array.isArray(message)
          ? message[0]
          : message || 'Error al actualizar la categoría'
      );
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => InventoryService.deleteCategory(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-categories'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
      toast.success('Categoría eliminada');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const status = apiError.response?.status;
      const message = apiError.response?.data?.message;

      // Rule: 409 Conflict explicative alert
      if (status === 409) {
        toast.error(
          'No se puede eliminar la categoría porque tiene productos asociados. Reasigna o elimina los productos primero.',
          { duration: 5000 }
        );
        return;
      }

      toast.error(
        Array.isArray(message)
          ? message[0]
          : message || 'No se pudo eliminar la categoría'
      );
    },
  });
};

/* ================= PRODUCTS HOOKS ================= */

export const useProducts = (params: GetProductsParams = {}) => {
  return useQuery({
    queryKey: ['inventory-products', params],
    queryFn: () => InventoryService.getProducts(params),
    staleTime: 1000 * 20,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) =>
      InventoryService.createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-categories'] });
      toast.success('Producto agregado al inventario');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;
      toast.error(
        Array.isArray(message)
          ? message[0]
          : message || 'Error al registrar el producto'
      );
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      uuid,
      payload,
    }: {
      uuid: string;
      payload: UpdateProductPayload;
    }) => InventoryService.updateProduct(uuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
      toast.success('Producto actualizado con éxito');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;
      toast.error(
        Array.isArray(message)
          ? message[0]
          : message || 'Error al actualizar el producto'
      );
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => InventoryService.deleteProduct(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-categories'] });
      toast.success('Producto eliminado del inventario');
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message;
      toast.error(
        Array.isArray(message)
          ? message[0]
          : message || 'No se pudo eliminar el producto'
      );
    },
  });
};
