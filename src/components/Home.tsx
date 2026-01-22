
import ProductCard from '../components/ProductCard';
import QuickMenu from '../components/QuickMenu';
import { MOCK_PRODUCTS } from '../data/mock';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* 화면 우측 고정 퀵 메뉴 */}
      <QuickMenu />

      <main className="max-w-[1024px] mx-auto px-4 py-8">
        {/* 1. 메인 배너) */}
        <section className="w-full mb-10">
          <div className="w-full h-[300px] bg-[#99d9f3] rounded-sm flex items-center justify-center overflow-hidden cursor-pointer">
             <span className="text-white text-3xl font-bold">나 혼자만 알고 싶은 6만원 쿠폰팩</span>
          </div>
          
          {/* 하단 앱 다운로드 유도 배너 */}
          <div className="w-full h-[100px] bg-white border border-gray-100 mt-4 rounded-sm flex items-center px-10 gap-4 cursor-pointer">
             <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center text-xl">📱</div>
             <div>
                <p className="font-bold text-sm text-gray-600">스마트폰에서 더 편리한</p>
                <p className="font-bold text-xl text-[#ff5058]">취향 중고거래 앱 번개장터 <span className="text-gray-400 font-normal text-sm ml-2">지금 다운받기</span></p>
             </div>
          </div>
        </section>

        {/* 2. 상품 리스트 */}
        <h2 className="text-xl font-bold mb-6">오늘의 상품 추천</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-4">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;