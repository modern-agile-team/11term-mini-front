import { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import HomeBanner from '../components/Banner/HomeBanner';
import Filterbar from '../components/Filterbar';
import api from '../api/axios';
import type { Product } from '../types/Product';
import { useInfiniteList } from '../hooks/useInfiniteList';
import { useProductListFilters } from '../hooks/useProductListFilters';
import { filterProducts } from '../utils/filterProducts';
import { sortProducts } from '../utils/sortProducts';

const PAGE_SIZE = 20;
const SKELETON_COUNT = 10;
const FETCHING_SKELETON_COUNT = 5;

interface ProductsResponse {
  data?: Product[];
  products?: Product[];
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { sort, filters, onChangeSort, onChangeFilter, onResetFilter } = useProductListFilters();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsInitialLoading(true);
        const response = await api.get<Product[] | ProductsResponse>('/products');
        const responseData = response.data;

        let productList: Product[] = [];
        if (Array.isArray(responseData)) {
          productList = responseData;
        } else if (responseData && typeof responseData === 'object') {
          productList = responseData.data || responseData.products || [];
        }

        if (!Array.isArray(productList)) {
          productList = [];
        }

        const onSaleProducts = productList.filter(
          (product) => !product.saleStatus || product.saleStatus === 'ON_SALE',
        );

        setProducts(onSaleProducts);
      } catch (error) {
        console.error('상품 로딩 실패:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const sortedProducts = useMemo(() => {
    const filteredProducts = filterProducts(products, filters);
    return sortProducts(filteredProducts, sort);
  }, [filters, products, sort]);

  const { visibleItems, isFetchingMore, hasNextPage, setSentinelRef } = useInfiniteList({
    items: sortedProducts,
    pageSize: PAGE_SIZE,
  });

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <section className="w-full mb-10">
          <HomeBanner />
          <div className="mt-4 flex h-[100px] w-full cursor-pointer items-center gap-4 rounded-sm border border-gray-100 bg-[#f9f9f9] px-10 transition-colors hover:bg-gray-50">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-100 bg-white text-xl font-bold text-gray-400 shadow-sm">
              ⚡
            </div>
            <div>
              <p className="text-sm text-gray-500">스마트폰에서 더 편리한</p>
              <p className="text-xl font-bold text-gray-900">
                취향 중고거래 앱 번개장터{' '}
                <span className="ml-2 text-sm text-[#ff5058] underline">지금 다운받기</span>
              </p>
            </div>
          </div>
        </section>

        <Filterbar
          title="오늘의 추천 상품"
          countText={`${sortedProducts.length}개`}
          sort={sort}
          onChangeSort={onChangeSort}
          filters={filters}
          onChangeFilter={onChangeFilter}
          onResetFilter={onResetFilter}
        />

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {isInitialLoading
            ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <ProductCardSkeleton key={`homeSkeleton-${index}`} />
              ))
            : visibleItems.map((product) => <ProductCard key={product.id} product={product} />)}

          {!isInitialLoading &&
            isFetchingMore &&
            Array.from({ length: FETCHING_SKELETON_COUNT }).map((_, index) => (
              <ProductCardSkeleton key={`homeFetching-${index}`} />
            ))}
        </div>

        {!isInitialLoading && hasNextPage && <div ref={setSentinelRef} className="h-10 mt-4" />}
      </main>
    </div>
  );
};

export default Home;
