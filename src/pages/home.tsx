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

        // 판매 중인 상품 위주로 정렬
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
        <HomeBanner />

        <h2 className="text-xl font-bold mt-10 mb-6">오늘의 추천 상품</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center py-20 text-gray-400">
            등록된 상품이 없습니다.
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
