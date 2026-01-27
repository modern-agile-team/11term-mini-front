import type { MouseEvent } from 'react';

interface BannerControlProps {
  direction: 'left' | 'right';
  onClick: (e: MouseEvent) => void;
}

export const BannerControl = ({ direction, onClick }: BannerControlProps) => (
  <button
    onClick={onClick}
    className={`absolute ${direction === 'left' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all`}
  >
    <span className="text-2xl mb-1">{direction === 'left' ? '‹' : '›'}</span>
  </button>
);
