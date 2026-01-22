import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mock';

// 정렬 타입 정의
type SortType = 'accuracy' | 'recent' | 'lowPrice' | 'highPrice';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  // 📍 정렬 상태 관리 (기본값: 정확도순)
  const [sortType, setSortType] = useState<SortType>('accuracy');

  // 1. 검색어 필터링 (불필요한 재계산 방지를 위해 useMemo 사용)
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  // 2. 정렬 로직 적용
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts]; // 원본 훼손 방지를 위한 복사
    
    switch (sortType) {
      case 'recent':
        // mock 데이터의 createdAt 문자열을 기준으로 정렬 (방금 전, n분 전 순)
        // 실제 서비스에서는 timestamp 숫자로 정렬하는 것이 정확합니다.
        return list.sort((a, b) => a.id - b.id); 
      case 'lowPrice':
        return list.sort((a, b) => a.price - b.price);
      case 'highPrice':
        return list.sort((a, b) => b.price - a.price);
      case 'accuracy':
      default:
        return list; // 정확도순은 기본 필터링 순서 유지
    }
  }, [filteredProducts, sortType]);

  return (
    <div className="max-w-[1024px] mx-auto px-4 py-8">
      {/* 검색 정보 및 정렬 탭 */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-xl inline">
            <span className="text-[#ff5058] font-bold">'{query}'</span>의 검색결과
          </h2>
          <span className="ml-2 text-gray-400 text-sm">{sortedProducts.length}개</span>
        </div>

        {/* 📍 정렬 버튼 그룹 */}
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

      {/* 상품 리스트 그리드 */}
      <div className="grid grid-cols-5 gap-x-4 gap-y-10">
        {sortedProducts.map((product) => (
          <div key={product.id} className="cursor-pointer group">
            <div className="aspect-square bg-gray-100 overflow-hidden mb-3 border border-gray-100">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-200" 
              />
            </div>
            <div className="px-1">
              <h3 className="text-sm text-gray-800 line-clamp-2 h-10 leading-5 mb-2">{product.title}</h3>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">{product.price.toLocaleString()}원</span>
                <span className="text-[11px] text-gray-400">{product.createdAt}</span>
              </div>
              <div className="text-[11px] text-gray-400 mt-2 pt-2 border-t">
                📍 {product.location}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 결과 없음 처리 */}
      {sortedProducts.length === 0 && (
        <div className="py-40 text-center text-gray-400">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
};

export default SearchPage;