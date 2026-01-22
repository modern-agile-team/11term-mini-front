import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mock';
import ProductCard from '../components/ProductCard';

type SortType = 'accuracy' | 'recent' | 'lowPrice' | 'highPrice';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [sortType, setSortType] = useState<SortType>('accuracy');

  // 1. 검색어 필터링
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  // 2. 정렬 로직
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];

    switch (sortType) {
      case 'recent':
        return list.sort((a, b) => a.id - b.id);
      case 'lowPrice':
        return list.sort((a, b) => a.price - b.price);
      case 'highPrice':
        return list.sort((a, b) => b.price - a.price);
      case 'accuracy':
      default:
        return list;
    }
  }, [filteredProducts, sortType]);

  return (
    <div className="max-w-[1024px] mx-auto px-4 py-8">
      {/* 상단 검색 정보 및 정렬 탭 */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-xl inline">
            <span className="text-[#ff5058] font-bold">'{query}'</span>의 검색결과
          </h2>
          <span className="ml-2 text-gray-400 text-sm">{sortedProducts.length}개</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          {[
            { id: 'accuracy', label: '정확도순' },
            { id: 'recent', label: '최신순' },
            { id: 'lowPrice', label: '저가순' },
            { id: 'highPrice', label: '고가순' },
          ].map((sort, index, array) => (
            <div key={sort.id} className="flex items-center gap-4">
              <button
                onClick={() => setSortType(sort.id as SortType)}
                className={`${sortType === sort.id ? 'text-[#ff5058] font-bold' : 'hover:text-black'}`}
              >
                {sort.label}
              </button>
              {index !== array.length - 1 && <span className="w-[1px] h-3 bg-gray-200"></span>}
            </div>
          ))}
        </div>
      </div>

      {/*  3. 상품 리스트 그리드: ProductCard 재사용 */}
      <div className="grid grid-cols-5 gap-x-4 gap-y-10">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* 결과 없음 처리 */}
      {sortedProducts.length === 0 && (
        <div className="py-40 text-center text-gray-400">검색 결과가 없습니다.</div>
      )}
    </div>
  );
};

export default SearchPage;
