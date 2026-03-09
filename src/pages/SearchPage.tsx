import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import type { Product } from '../types/Product';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import { useInfiniteList } from '../hooks/useInfiniteList';

type SortType = 'accuracy' | 'recent' | 'lowPrice' | 'highPrice';
const pageSize = 20;
const initialSkeletonCount = 10;
const fetchingSkeletonCount = 5;

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [sortType, setSortType] = useState<SortType>('accuracy');
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // 데이터 페칭 로직 추가
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsInitialLoading(true);
        const response = await api.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('검색 데이터 로딩 실패:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 검색어 필터링
  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));
  }, [query, products]);

  // 정렬 로직
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];

    switch (sortType) {
      case 'recent':
        return list.sort((a, b) => b.id - a.id);
      case 'lowPrice':
        return list.sort((a, b) => a.price - b.price);
      case 'highPrice':
        return list.sort((a, b) => b.price - a.price);
      case 'accuracy':
      default:
        return list;
    }
  }, [filteredProducts, sortType]);

  const { visibleItems, isFetchingMore, hasNextPage, setSentinelRef } = useInfiniteList({
    items: sortedProducts,
    pageSize,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10">
        {isInitialLoading
          ? Array.from({ length: initialSkeletonCount }).map((_, index) => (
              <ProductCardSkeleton key={`searchSkeleton-${index}`} />
            ))
          : visibleItems.map((product) => <ProductCard key={product.id} product={product} />)}

        {!isInitialLoading &&
          isFetchingMore &&
          Array.from({ length: fetchingSkeletonCount }).map((_, index) => (
            <ProductCardSkeleton key={`searchFetching-${index}`} />
          ))}
      </div>

      {!isInitialLoading && sortedProducts.length === 0 && (
        <div className="py-40 text-center text-gray-400">검색 결과가 없습니다.</div>
      )}

      {!isInitialLoading && hasNextPage && <div ref={setSentinelRef} className="h-10 mt-4" />}
    </div>
  );
};

export default SearchPage;
