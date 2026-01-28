import React from 'react';
import type { AdItem } from '../../data/ADmock';

interface BannerSlideProps {
  ad: AdItem;
  isActive: boolean;
}

export const BannerSlide = ({ ad, isActive }: BannerSlideProps) => {
  return (
    <div
      key={ad.id}
      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
      }`}
    >
      <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 flex flex-col items-center justify-center text-white text-center">
        <h2 className="text-xl font-medium mb-2 drop-shadow-md">{ad.title}</h2>
        <p className="text-4xl font-bold drop-shadow-lg">{ad.subTitle}</p>
      </div>
    </div>
  );
};
