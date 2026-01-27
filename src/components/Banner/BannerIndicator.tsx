interface BannerIndicatorProps {
  total: number;
  current: number;
  onDotClick: (index: number, e: React.MouseEvent) => void;
}

export const BannerIndicator = ({ total, current, onDotClick }: BannerIndicatorProps) => (
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        onClick={(e) => onDotClick(i, e)}
        className={`h-1.5 rounded-full transition-all cursor-pointer ${
          i === current ? 'w-6 bg-white' : 'w-2 bg-white/50'
        }`}
      />
    ))}
  </div>
);
