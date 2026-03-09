// src/components/Filterbar.tsx
import type { ProductCondition, ProductFilterState, SortKey } from '../types/sort';

interface FilterbarProps {
  title: string;
  countText: string;
  sort: SortKey;
  onChangeSort: (next: SortKey) => void;
  filters: ProductFilterState;
  onChangeFilter: (next: Partial<ProductFilterState>) => void;
  onResetFilter: () => void;
}

const Filterbar = ({
  title,
  countText,
  sort,
  onChangeSort,
  filters,
  onChangeFilter,
  onResetFilter,
}: FilterbarProps) => {
  const active = 'text-[#ff5058] font-bold';
  const normal = 'hover:text-black';

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8 pb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[18px] font-bold">{title}</h2>
          <span className="text-gray-400 text-[14px]">{countText}</span>
        </div>

        <div className="flex gap-4 text-[13px] text-gray-500">
          <button
            className={sort === 'latest' ? active : normal}
            onClick={() => onChangeSort('latest')}
          >
            최신순
          </button>
          <button
            className={sort === 'popular' ? active : normal}
            onClick={() => onChangeSort('popular')}
          >
            인기순
          </button>
          <button className={sort === 'low' ? active : normal} onClick={() => onChangeSort('low')}>
            저가순
          </button>
          <button
            className={sort === 'high' ? active : normal}
            onClick={() => onChangeSort('high')}
          >
            고가순
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          type="number"
          min={0}
          value={filters.minPrice}
          onChange={(e) => onChangeFilter({ minPrice: e.target.value })}
          placeholder="최소가격"
          className="h-9 w-28 border border-gray-200 px-2 text-sm outline-none focus:border-gray-400"
        />
        <span className="text-gray-400 text-sm">~</span>
        <input
          type="number"
          min={0}
          value={filters.maxPrice}
          onChange={(e) => onChangeFilter({ maxPrice: e.target.value })}
          placeholder="최대가격"
          className="h-9 w-28 border border-gray-200 px-2 text-sm outline-none focus:border-gray-400"
        />

        <select
          value={filters.condition}
          onChange={(e) => onChangeFilter({ condition: e.target.value as ProductCondition })}
          className="h-9 border border-gray-200 px-2 text-sm outline-none focus:border-gray-400"
        >
          <option value="">상품상태 전체</option>
          <option value="NEW">새상품</option>
          <option value="LIKE_NEW">사용감 없음</option>
          <option value="USED_GOOD">사용감 적음</option>
          <option value="USED_FAIR">사용감 많음</option>
          <option value="BROKEN">고장/파손</option>
        </select>

        <label className="h-9 px-3 border border-gray-200 text-sm flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.thunderPayOnly}
            onChange={(e) => onChangeFilter({ thunderPayOnly: e.target.checked })}
          />
          번개페이
        </label>

        <button
          type="button"
          onClick={onResetFilter}
          className="h-9 px-3 border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
        >
          초기화
        </button>
      </div>

      <div className="border-b border-gray-100"></div>
    </div>
  );
};

export default Filterbar;
