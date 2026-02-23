// src/utils/categoryGrid.ts
import type { Category } from '../types/Category';

type MakeCategoryGridItemsParams = {
  base: Category[];
  columns: number;
  padPrefix?: string;
};

export const makeCategoryGridItems = ({
  base,
  columns,
  padPrefix = 'pad:',
}: MakeCategoryGridItemsParams): Category[] => {
  const remainder = base.length % columns;
  const padCount = remainder === 0 ? 0 : columns - remainder;

  const pads: Category[] = Array.from({ length: padCount }, (_, i) => ({
    id: `${padPrefix}${i}`,
    name: '',
  }));

  return [...base, ...pads];
};
