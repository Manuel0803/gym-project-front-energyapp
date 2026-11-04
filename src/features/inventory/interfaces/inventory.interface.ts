export interface Category {
  uuid: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  productsCount?: number;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export interface Product {
  uuid: string;
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  stock: number;
  categoryUuid: string;
  category?: Category;
  sku?: string;
  barcode?: string;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductPayload {
  name: string;
  price: number;
  salePrice?: number;
  stock: number;
  categoryUuid: string;
  description?: string;
  sku?: string;
  barcode?: string;
  imageUrl?: string | null;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface GetProductsParams {
  page?: number;
  limit?: number;
  term?: string;
  categoryUuid?: string;
  inStockOnly?: boolean;
}

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  term?: string;
}
