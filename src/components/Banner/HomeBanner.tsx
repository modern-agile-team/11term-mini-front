import { BannerControl } from './BannerControl';
import { BannerIndicator } from './BannerIndicator';
import { useBanner } from '../../hooks/useBanner';
import { MOCK_AD } from '../../data/ADmock';

const HomeBanner = () => {
  const { currentIdx, goToNext, goToPrev, goToIndex } = useBanner(MOCK_AD.length);

  const stopPropagation = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div className="relative w-full h-[300px] overflow-hidden rounded-sm cursor-pointer group bg-gray-100">
      {MOCK_AD.map((ad, index) => (
        <div
          key={ad.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 flex flex-col items-center justify-center text-white text-center">
            <h2 className="text-xl font-medium mb-2 drop-shadow-md">{ad.title}</h2>
            <p className="text-4xl font-bold drop-shadow-lg">{ad.subTitle}</p>
          </div>
        </div>
      ))}

      <BannerControl direction="left" onClick={stopPropagation(goToPrev)} />
      <BannerControl direction="right" onClick={stopPropagation(goToNext)} />

      <BannerIndicator
        total={MOCK_AD.length}
        current={currentIdx}
        onDotClick={(i, e) => stopPropagation(() => goToIndex(i))(e)}
      />
    </div>
  );
};

export default HomeBanner;
