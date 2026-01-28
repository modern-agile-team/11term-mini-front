import { MOCK_AD } from '../../data/ADmock';
import { useBanner } from '../../hooks/useBanner';
import { BannerControl } from './BannerControl';
import { BannerIndicator } from './BannerIndicator';
import { BannerSlide } from './BannerSlide';

const HomeBanner = () => {
  const { currentIdx, goToNext, goToPrev, goToIndex } = useBanner(MOCK_AD.length);

  const stopPropagation = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div className="relative w-full h-[300px] overflow-hidden rounded-sm cursor-pointer group bg-gray-100">
      {MOCK_AD.map((ad, index) => (
        <BannerSlide key={ad.id} ad={ad} isActive={index === currentIdx} />
      ))}

      {/* 좌우 버튼 */}
      <BannerControl direction="left" onClick={stopPropagation(goToPrev)} />
      <BannerControl direction="right" onClick={stopPropagation(goToNext)} />

      {/* 인디케이터 */}
      <BannerIndicator
        total={MOCK_AD.length}
        current={currentIdx}
        onDotClick={(i, e) => stopPropagation(() => goToIndex(i))(e)}
      />
    </div>
  );
};

export default HomeBanner;
