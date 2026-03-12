import api from '../api/axios';
import { MOCK_PRODUCTS } from '../data/mock';
import type { Product } from '../types/Product';
import { normalizeProductCategory } from './productCategory';

const normalizeProduct = (product: Product): Product => {
  const normalizedCategory = normalizeProductCategory({
    categoryId: product.categoryId,
    categoryName: product.category,
    title: product.title,
  });

  return {
    ...product,
    category: normalizedCategory.category,
    categoryId: normalizedCategory.categoryId,
  };
};

const getLocalProducts = (): Product[] => {
  const stored = localStorage.getItem('products');

  if (!stored) {
    const normalizedMockProducts = MOCK_PRODUCTS.map(normalizeProduct);
    localStorage.setItem('products', JSON.stringify(normalizedMockProducts));
    return normalizedMockProducts;
  }

  try {
    const parsedProducts = (JSON.parse(stored) as Product[]).map(normalizeProduct);
    if (parsedProducts.length === 0) {
      const normalizedMockProducts = MOCK_PRODUCTS.map(normalizeProduct);
      localStorage.setItem('products', JSON.stringify(normalizedMockProducts));
      return normalizedMockProducts;
    }

    return parsedProducts;
  } catch {
    const normalizedMockProducts = MOCK_PRODUCTS.map(normalizeProduct);
    localStorage.setItem('products', JSON.stringify(normalizedMockProducts));
    return normalizedMockProducts;
  }
};

export const fetchProductsWithFallback = async (): Promise<Product[]> => {
  const localProducts = getLocalProducts();

  try {
    const response = await api.get('/api/products');
    const remoteProducts: Product[] =
      (Array.isArray(response.data) ? response.data : response.data?.products) || [];

    if (remoteProducts.length === 0) {
      return localProducts;
    }

    const mergedProducts = [...remoteProducts.map(normalizeProduct), ...localProducts];
    const dedupedProducts = Array.from(
      new Map(mergedProducts.map((product) => [String(product.id), product])).values(),
    );

    return dedupedProducts;
  } catch (error) {
    console.error('상품 API 호출 실패, 로컬 데이터를 사용합니다.', error);
    return localProducts;
  }
};

export const fetchProductByIdWithFallback = async (productId: string | number): Promise<Product | null> => {
  const normalizedProductId = String(productId);

  try {
    const response = await api.get(`/api/products/${normalizedProductId}`);
    const remoteProduct = response?.data as Product | undefined;

    if (remoteProduct?.id !== undefined && remoteProduct?.id !== null) {
      return normalizeProduct(remoteProduct);
    }
  } catch (error) {
    console.error('상품 상세 API 호출 실패, 로컬 데이터를 사용합니다.', error);
  }

  const products = await fetchProductsWithFallback();
  return products.find((product) => String(product.id) === normalizedProductId) ?? null;
};
