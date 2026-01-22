import { useState, useEffect } from 'react';

const ads = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1024&q=80',
    title: '나 혼자만 알고 싶은',
    subTitle: '6만원 쿠폰팩 받기',
    bgColor: 'bg-[#99d9f3]',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1534452286300-b445cb067918?auto=format&fit=crop&w=1024&q=80',
    title: '겨울 패션 완성',
    subTitle: '인기 아우터 모음전',
    bgColor: 'bg-[#54b454]',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1024&q=80',
    title: '스마트한 중고거래',
    subTitle: '번개케어로 정품 검수까지',
    bgColor: 'bg-[#ff5058]',
  },
];

const AdCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === ads.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[300px] overflow-hidden rounded-sm group cursor-pointer">
      {ads.map((ad, index) => (
        <div
          key={ad.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* 배경 이미지 */}
          <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
          {/* 텍스트 오버레이 */}
          <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white text-center">
            <h2 className="text-xl font-medium mb-2">{ad.title}</h2>
            <p className="text-4xl font-bold">{ad.subTitle}</p>
          </div>
        </div>
      ))}

      {/* 인디케이터 (점) */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        {ads.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index === current ? 'w-6 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AdCarousel;
