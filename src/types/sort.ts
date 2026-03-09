// src/types/sort.ts
export type SortKey = 'latest' | 'popular' | 'low' | 'high';

export type ProductCondition = '' | 'NEW' | 'LIKE_NEW' | 'USED_GOOD' | 'USED_FAIR' | 'BROKEN';

export type ProductFilterState = {
  minPrice: string;
  maxPrice: string;
  condition: ProductCondition;
  thunderPayOnly: boolean;
};

export type FilterbarProps = {
  title: string;
  countText: string;
  sort: SortKey;
  onChangeSort: (next: SortKey) => void;
  filters: ProductFilterState;
  onChangeFilter: (next: Partial<ProductFilterState>) => void;
  onResetFilter: () => void;
};
