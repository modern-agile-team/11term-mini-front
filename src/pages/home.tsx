import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import QuickMenu from '../components/QuickMenu';
import { MOCK_PRODUCTS } from '../data/mock';

const ads = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1024&q=80',
    title: '나 혼자만 알고 싶은',
    subTitle: '6만원 쿠폰팩 받기',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1534452286300-b445cb067918?auto=format&fit=crop&w=1024&q=80',
    title: '겨울 패션 완성',
    subTitle: '인기 아우터 모음전',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1024&q=80',
    title: '스마트한 중고거래',
    subTitle: '번개케어로 정품 검수까지',
  },
];

const Home = () => {
  const [currentAd, setCurrentAd] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAd((prev) => (prev === ads.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(timer);
  }, [currentAd]);

  const nextAd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentAd((prev) => (prev === ads.length - 1 ? 0 : prev + 1));
  };

  const prevAd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentAd((prev) => (prev === 0 ? ads.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-white">
      <QuickMenu />
      <main className="max-w-[1024px] mx-auto px-4 py-8">
        <section className="w-full mb-10">
          <div className="relative w-full h-[300px] overflow-hidden rounded-sm cursor-pointer group">
            {ads.map((ad, index) => (
              <div
                key={ad.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentAd ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white text-center">
                  <h2 className="text-xl font-medium mb-2">{ad.title}</h2>
                  <p className="text-4xl font-bold">{ad.subTitle}</p>
                </div>
              </div>
            ))}

            <button
              onClick={prevAd}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
            >
              <span className="text-2xl mb-1">‹</span>
            </button>

            <button
              onClick={nextAd}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
            >
              <span className="text-2xl mb-1">›</span>
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {ads.map((_, index) => (
                <div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentAd(index);
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    index === currentAd ? 'w-6 bg-white' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="w-full h-[100px] bg-[#f9f9f9] border border-gray-100 mt-4 rounded-sm flex items-center px-10 gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center text-xl shadow-sm border border-gray-100 font-bold text-gray-400"></div>
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
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
