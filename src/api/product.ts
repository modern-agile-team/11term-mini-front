import api from './axios';
import type { Product } from '../types/Product';

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/api/products');
  return Array.isArray(response.data) ? response.data : [];
};
