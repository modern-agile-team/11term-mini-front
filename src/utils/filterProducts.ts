import type { Product } from '../types/Product';
import type { ProductFilterState } from '../types/sort';

const toNumberOrNull = (value: string): number | null => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

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
