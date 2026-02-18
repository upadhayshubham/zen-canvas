import api from '@/lib/api';
import { Product, Category, PageResponse } from '@/types';

export async function getProducts(params?: {
  categoryId?: string;
  search?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<Product>> {
  const res = await api.get<PageResponse<Product>>('/products', { params: { size: 20, ...params } });
  return res.data;
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const res = await api.get<Product>(`/products/${slug}`);
  return res.data;
}

export async function getCategories(): Promise<Category[]> {
  const res = await api.get<Category[]>('/products/categories');
  return res.data;
}
