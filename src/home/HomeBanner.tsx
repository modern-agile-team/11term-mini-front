import React, { useState, useEffect, useCallback } from 'react';
import { MOCK_AD } from '../data/ADmock';

const HomeBanner = () => {
  const [currentAd, setCurrentAd] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentAd((prev) => (prev === MOCK_AD.length - 1 ? 0 : prev + 1));
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentAd((prev) => (prev === 0 ? MOCK_AD.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    // 4초마다 자동 이동
    const timer = setInterval(() => {
      goToNext();
    }, 4000);

    // 조작 시(currentAd 변경 시) 기존 타이머를 죽이고 새로 4초를 시작
    return () => clearInterval(timer);
  }, [currentAd, goToNext]);

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToNext();
  };

  const handlePrevClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToPrev();
  };

  const handleDotClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentAd(index);
  };

  return (
    <div className="relative w-full h-[300px] overflow-hidden rounded-sm cursor-pointer group bg-gray-100">
      {MOCK_AD.map((ad, index) => (
        <div
          key={ad.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentAd ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* 배경색 레이어를 제거하고 이미지만 꽉 채움 */}
          <div className="w-full h-full relative">
            <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
            {/* 텍스트 가독성을 위한 검정색 그라데이션 오버레이 (이미지 색감 유지) */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 flex flex-col items-center justify-center text-white text-center">
              <h2 className="text-xl font-medium mb-2 drop-shadow-md">{ad.title}</h2>
              <p className="text-4xl font-bold drop-shadow-lg">{ad.subTitle}</p>
            </div>
          </div>
        </div>
      ))}

      {/* 좌우 버튼 */}
      <button
        onClick={handlePrevClick}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
      >
        <span className="text-2xl mb-1">‹</span>
      </button>
      <button
        onClick={handleNextClick}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
      >
        <span className="text-2xl mb-1">›</span>
      </button>

      {/* 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {MOCK_AD.map((_, index) => (
          <div
            key={index}
            onClick={(e) => handleDotClick(index, e)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              index === currentAd ? 'w-6 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeBanner;
