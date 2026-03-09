import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ProductCondition, ProductFilterState, SortKey } from '../types/sort';

const VALID_SORT_KEYS: SortKey[] = ['latest', 'popular', 'low', 'high'];
const VALID_CONDITIONS: ProductCondition[] = ['', 'NEW', 'LIKE_NEW', 'USED_GOOD', 'USED_FAIR', 'BROKEN'];

const toValidSortKey = (value: string | null): SortKey =>
  VALID_SORT_KEYS.includes(value as SortKey) ? (value as SortKey) : 'latest';

const toValidCondition = (value: string | null): ProductCondition =>
  VALID_CONDITIONS.includes(value as ProductCondition) ? (value as ProductCondition) : '';

export const useProductListFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = toValidSortKey(searchParams.get('sort'));
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const condition = toValidCondition(searchParams.get('condition'));
  const thunderPayOnly = searchParams.get('pay') === 'thunder';

  const filters = useMemo<ProductFilterState>(
    () => ({ minPrice, maxPrice, condition, thunderPayOnly }),
    [condition, maxPrice, minPrice, thunderPayOnly],
  );

  const patchParams = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams);

      Object.entries(patch).forEach(([key, value]) => {
        if (!value) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      });

      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const onChangeSort = useCallback(
    (nextSort: SortKey) => {
      patchParams({ sort: nextSort === 'latest' ? null : nextSort });
    },
    [patchParams],
  );

  const onChangeFilter = useCallback(
    (nextFilter: Partial<ProductFilterState>) => {
      patchParams({
        minPrice:
          nextFilter.minPrice !== undefined ? nextFilter.minPrice.trim() || null : minPrice || null,
        maxPrice:
          nextFilter.maxPrice !== undefined ? nextFilter.maxPrice.trim() || null : maxPrice || null,
        condition:
          nextFilter.condition !== undefined
            ? nextFilter.condition || null
            : condition || null,
        pay:
          nextFilter.thunderPayOnly !== undefined
            ? nextFilter.thunderPayOnly
              ? 'thunder'
              : null
            : thunderPayOnly
              ? 'thunder'
              : null,
      });
    },
    [condition, maxPrice, minPrice, patchParams, thunderPayOnly],
  );

  const onResetFilter = useCallback(() => {
    patchParams({
      sort: null,
      minPrice: null,
      maxPrice: null,
      condition: null,
      pay: null,
    });
  }, [patchParams]);

  return {
    sort,
    filters,
    onChangeSort,
    onChangeFilter,
    onResetFilter,
  };
};
