import { useState, useEffect, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import HomeBanner from '../components/Banner/HomeBanner';
import api from '../api/axios';
import type { Product } from '../types/Product';

interface ProductsResponse {
  products?: Product[];
  data?: Product[];
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const isFetched = useRef(false);

  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;

    const fetchProducts = async () => {
      try {
        const response = await api.get<Product[] | ProductsResponse>('/products');
        const responseData = response.data;

        const data: Product[] = Array.isArray(responseData)
          ? responseData
          : responseData.products || responseData.data || [];

        const onSaleProducts = data.filter(
          (product) => !product.saleStatus || product.saleStatus === 'ON_SALE',
        );

        const sortedProducts = onSaleProducts.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setProducts(sortedProducts);
      } catch (error: unknown) {
        console.error('상품 로딩 실패:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-[1024px] mx-auto px-4 py-8">
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

        <h2 className="text-xl font-bold mb-6">오늘의 추천 상품</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center py-20 text-gray-400">
            상품을 불러오는 중이거나 등록된 상품이 없습니다.
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
