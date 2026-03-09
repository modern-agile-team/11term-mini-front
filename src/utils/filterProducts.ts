import type { Product } from '../types/Product';
import type { ProductFilterState } from '../types/sort';

const toNumberOrNull = (value: string): number | null => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

// 상품 목록에 가격/상태/번개페이 필터를 순차 적용해 조건에 맞는 데이터만 반환한다.
export const filterProducts = (products: Product[], filters: ProductFilterState): Product[] => {
  const min = toNumberOrNull(filters.minPrice);
  const max = toNumberOrNull(filters.maxPrice);

  return products.filter((product) => {
    if (min !== null && product.price < min) return false;
    if (max !== null && product.price > max) return false;
    if (filters.condition && product.status !== filters.condition) return false;
    if (filters.thunderPayOnly && !product.isThunderPay) return false;
    return true;
  });
};
