import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import type { Product } from '../types/Product';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import Filterbar from '../components/Filterbar';
import { useInfiniteList } from '../hooks/useInfiniteList';
import { useProductListFilters } from '../hooks/useProductListFilters';
import { filterProducts } from '../utils/filterProducts';
import { sortProducts } from '../utils/sortProducts';

const PAGE_SIZE = 20;
const INITIAL_SKELETON_COUNT = 10;
const FETCHING_SKELETON_COUNT = 5;

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { sort, filters, onChangeSort, onChangeFilter, onResetFilter } = useProductListFilters();

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

  const filteredProducts = useMemo(() => {
    const queryFilteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase()),
    );
    return filterProducts(queryFilteredProducts, filters);
  }, [filters, query, products]);

  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, sort),
    [filteredProducts, sort],
  );

  const { visibleItems, isFetchingMore, hasNextPage, setSentinelRef } = useInfiniteList({
    items: sortedProducts,
    pageSize: PAGE_SIZE,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Filterbar
        title={`'${query}' 검색결과`}
        countText={`${sortedProducts.length}개`}
        sort={sort}
        onChangeSort={onChangeSort}
        filters={filters}
        onChangeFilter={onChangeFilter}
        onResetFilter={onResetFilter}
      />

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {isInitialLoading
          ? Array.from({ length: INITIAL_SKELETON_COUNT }).map((_, index) => (
              <ProductCardSkeleton key={`searchSkeleton${index}`} />
            ))
          : visibleItems.map((product) => <ProductCard key={product.id} product={product} />)}

        {!isInitialLoading &&
          isFetchingMore &&
          Array.from({ length: FETCHING_SKELETON_COUNT }).map((_, index) => (
            <ProductCardSkeleton key={`searchFetching${index}`} />
          ))}
      </div>

      {!isInitialLoading && sortedProducts.length === 0 && (
        <div className="py-40 text-center text-gray-400">검색 결과가 없습니다.</div>
      )}

      {!isInitialLoading && hasNextPage && <div ref={setSentinelRef} className="mt-4 h-10" />}
    </div>
  );
};

export default SearchPage;
