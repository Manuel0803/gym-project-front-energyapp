import { httpClient } from '@/core/api/axios.adapter';
import { PaginatedResult } from '@/common/interfaces/pagination.interface';
import {
  Category,
  CreateCategoryPayload,
  CreateProductPayload,
  GetCategoriesParams,
  GetProductsParams,
  Product,
  UpdateCategoryPayload,
  UpdateProductPayload,
} from '../interfaces/inventory.interface';

export class InventoryService {
  private static readonly CATEGORIES_ENDPOINT = '/inventory/categories';
  private static readonly PRODUCTS_ENDPOINT = '/inventory/products';

  /* ================= CATEGORIES ================= */

  /**
   * Retrieves paginated or filtered list of product categories.
   */
  static async getCategories(
    params: GetCategoriesParams = {}
  ): Promise<PaginatedResult<Category>> {
    const { page = 1, limit = 20, term } = params;
    const searchParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (term) searchParams.append('term', term);

    const result = await httpClient.get<PaginatedResult<Category> | Category[]>(
      `${this.CATEGORIES_ENDPOINT}?${searchParams.toString()}`
    );

    // Normalize if backend returns flat array instead of PaginatedResult
    if (Array.isArray(result)) {
      return {
        data: result,
        meta: {
          total: result.length,
          lastPage: 1,
          currentPage: 1,
          perPage: result.length,
          prev: null,
          next: null,
        },
      };
    }

    return result;
  }

  /**
   * Retrieves all categories as a simple list for dropdown selects.
   */
  static async getAllCategoriesList(): Promise<Category[]> {
    const res = await this.getCategories({ page: 1, limit: 100 });
    return res.data;
  }

  static async createCategory(
    payload: CreateCategoryPayload
  ): Promise<Category> {
    return await httpClient.post<Category>(this.CATEGORIES_ENDPOINT, payload);
  }

  static async updateCategory(
    uuid: string,
    payload: UpdateCategoryPayload
  ): Promise<Category> {
    return await httpClient.patch<Category>(
      `${this.CATEGORIES_ENDPOINT}/${uuid}`,
      payload
    );
  }

  static async deleteCategory(uuid: string): Promise<{ success: boolean; message?: string }> {
    return await httpClient.delete<{ success: boolean; message?: string }>(
      `${this.CATEGORIES_ENDPOINT}/${uuid}`
    );
  }

  /* ================= PRODUCTS ================= */

  /**
   * Retrieves paginated or filtered list of inventory products.
   */
  static async getProducts(
    params: GetProductsParams = {}
  ): Promise<PaginatedResult<Product>> {
    const { page = 1, limit = 10, term, categoryUuid, inStockOnly } = params;
    const searchParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (term) searchParams.append('term', term);
    if (categoryUuid) searchParams.append('categoryUuid', categoryUuid);
    if (inStockOnly) searchParams.append('inStockOnly', 'true');

    const result = await httpClient.get<PaginatedResult<Product> | Product[]>(
      `${this.PRODUCTS_ENDPOINT}?${searchParams.toString()}`
    );

    if (Array.isArray(result)) {
      return {
        data: result,
        meta: {
          total: result.length,
          lastPage: 1,
          currentPage: 1,
          perPage: result.length,
          prev: null,
          next: null,
        },
      };
    }

    return result;
  }

  static async getProductByUuid(uuid: string): Promise<Product> {
    return await httpClient.get<Product>(`${this.PRODUCTS_ENDPOINT}/${uuid}`);
  }

  static async createProduct(payload: CreateProductPayload): Promise<Product> {
    return await httpClient.post<Product>(this.PRODUCTS_ENDPOINT, payload);
  }

  static async updateProduct(
    uuid: string,
    payload: UpdateProductPayload
  ): Promise<Product> {
    return await httpClient.patch<Product>(
      `${this.PRODUCTS_ENDPOINT}/${uuid}`,
      payload
    );
  }

  static async deleteProduct(uuid: string): Promise<{ success: boolean; message?: string }> {
    return await httpClient.delete<{ success: boolean; message?: string }>(
      `${this.PRODUCTS_ENDPOINT}/${uuid}`
    );
  }
}
