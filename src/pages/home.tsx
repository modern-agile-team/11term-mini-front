import ProductCard from '../components/ProductCard';
import QuickMenu from '../components/QuickMenu';
import { MOCK_PRODUCTS } from '../data/mock';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* 퀵 메뉴 */}
      <QuickMenu />

      <main className="max-w-[1024px] mx-auto px-4 py-8">
        {/* 📍 메인 배너 영역 (image_1142cd.png 스타일 적용) */}
        <section className="w-full mb-10">
          <div className="w-full h-[300px] bg-[#54b454] rounded-sm flex items-center justify-center overflow-hidden cursor-pointer relative">
             <div className="text-white text-center z-10">
                <h2 className="text-4xl font-bold mb-2">EDITION 1</h2>
                <p className="text-2xl font-light">남친 룩의 완성인 '이 아이템'은?</p>
             </div>
             {/* 배경에 은은한 이미지를 넣고 싶다면 여기에 추가 */}
          </div>
          
          {/* 하단 앱 홍보 배너 */}
          <div className="w-full h-[120px] bg-[#f9f9f9] mt-4 rounded-sm flex items-center justify-between px-10 cursor-pointer border border-gray-100">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-2xl">QR</div>
                <div>
                   <p className="text-gray-600 text-sm">스마트폰에서 더 편리한</p>
                   <p className="text-xl font-bold text-gray-900">취향 중고거래 앱 번개장터 <span className="text-[#ff5058] ml-2 font-medium text-sm underline">지금 다운받기</span></p>
                </div>
             </div>
             <div className="text-4xl">📱</div>
          </div>
        </section>

        {/* 상품 리스트 */}
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