import { useState, useEffect } from 'react';
import { MOCK_AD } from '../data/ADmock';

const AdCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === MOCK_AD.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[300px] overflow-hidden rounded-sm group cursor-pointer">
      {MOCK_AD.map((ad, index) => (
        <div
          key={ad.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white text-center">
            <h2 className="text-xl font-medium mb-2">{ad.title}</h2>
            <p className="text-4xl font-bold">{ad.subTitle}</p>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 right-4 flex gap-2">
        {MOCK_AD.map((_, index) => (
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
