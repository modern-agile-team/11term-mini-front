// src/types/sort.ts
export type SortKey = 'latest' | 'popular' | 'low' | 'high';

export type ProductCondition = '' | 'NEW' | 'LIKE_NEW' | 'USED_GOOD' | 'USED_FAIR' | 'BROKEN';

export interface ProductFilterState {
  minPrice: string;
  maxPrice: string;
  condition: ProductCondition;
  thunderPayOnly: boolean;
}
