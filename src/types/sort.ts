// src/types/sort.ts
export type SortKey = 'latest' | 'popular' | 'low' | 'high';

export type FilterbarProps = {
  title: string;
  countText: string;
  sort: SortKey;
  onChangeSort: (next: SortKey) => void;
};
