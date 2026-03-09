import { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import HomeBanner from '../components/Banner/HomeBanner';
import api from '../api/axios';
import type { Product } from '../types/Product';
import Filterbar from '../components/Filterbar';
import { useProductListFilters } from '../hooks/useProductListFilters';
import { filterProducts } from '../utils/filterProducts';
import { sortProducts } from '../utils/sortProducts';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { sort, filters, onChangeSort, onChangeFilter, onResetFilter } = useProductListFilters();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/products');

        const data: Product[] =
          (Array.isArray(response.data) ? response.data : response.data?.products) || [];

        const onSaleProducts = data.filter(
          (product) => !product.saleStatus || product.saleStatus === 'ON_SALE',
        );

        const sortedProducts = onSaleProducts.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setProducts(sortedProducts);
      } catch (error) {
        console.error('상품 로딩 실패:', error);
      }
    };

    fetchProducts();
  }, []);

  const visibleProducts = useMemo(() => {
    const onSaleProducts = products.filter(
      (product) => !product.saleStatus || product.saleStatus === 'ON_SALE',
    );
    const filtered = filterProducts(onSaleProducts, filters);
    return sortProducts(filtered, sort);
  }, [filters, products, sort]);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* 배너 및 앱 다운로드 섹션 */}
        <section className="w-full mb-10">
          <HomeBanner />
          <div className="w-full h-[100px] bg-[#f9f9f9] border border-gray-100 mt-4 rounded-sm flex items-center px-10 gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center text-xl shadow-sm border border-gray-100 font-bold text-gray-400">
              ⚡
            </div>
            <div>
              <p className="text-sm text-gray-500">스마트폰에서 더 편리한</p>
              <p className="font-bold text-xl text-gray-900">
                취향 중고거래 앱 번개장터{' '}
                <span className="text-[#ff5058] text-sm ml-2 underline">지금 다운받기</span>
              </p>
            </div>
          </div>
        </section>

        <Filterbar
          title="오늘의 상품 추천"
          countText={`${visibleProducts.length}개`}
          sort={sort}
          onChangeSort={onChangeSort}
          filters={filters}
          onChangeFilter={onChangeFilter}
          onResetFilter={onResetFilter}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
