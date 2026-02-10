import type { SortKey } from '../types/sort';
import type { Product } from '../types/Product';

export const sortProducts = (products: Product[], sort: SortKey) => {
  const copy = [...products];

  switch (sort) {
    case 'latest':
      return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    case 'popular':
      return copy.sort((a, b) => b.id - a.id);

    case 'low':
      return copy.sort((a, b) => a.price - b.price);

    case 'high':
      return copy.sort((a, b) => b.price - a.price);

    default:
      return copy;
  }
};
