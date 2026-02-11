import { useState, useEffect } from 'react'; // 추가
import ProductCard from '../components/ProductCard';
import QuickMenu from '../components/QuickMenu';
import HomeBanner from '../components/Banner/HomeBanner';
import api from '../api/axios'; // 추가
import type { Product } from '../types/Product'; // 타입 추가

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]); // 상태 관리 추가

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('상품 로딩 실패:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <QuickMenu />

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

        <h2 className="text-xl font-bold mb-6">오늘의 상품 추천</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-4">
          {/* MOCK_PRODUCTS 대신 상태값 products 사용 */}
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
