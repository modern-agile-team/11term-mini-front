import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types/Product';

const getInitialRecentItems = (): Product[] => {
  try {
    const recentRaw = localStorage.getItem('recently_viewed');
    const recent = recentRaw ? (JSON.parse(recentRaw) as unknown) : [];
    return Array.isArray(recent)
      ? (recent as Product[]).filter(
          (item) => item !== null && item !== undefined && item.id !== undefined,
        )
      : [];
  } catch {
    return [];
  }
};

const getInitialWishCount = (): number => {
  try {
    const wishesRaw = localStorage.getItem('wish_list');
    const wishes = wishesRaw ? (JSON.parse(wishesRaw) as unknown) : [];
    return Array.isArray(wishes) ? wishes.length : 0;
  } catch {
    return 0;
  }
};

const QuickMenu = () => {
  const [recentItems, setRecentItems] = useState<Product[]>(getInitialRecentItems);
  const [wishCount, setWishCount] = useState<number>(getInitialWishCount);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);

  const handleStorageUpdate = useCallback(() => {
    setRecentItems(getInitialRecentItems());
    setWishCount(getInitialWishCount());
  }, []);

  useEffect(() => {
    window.addEventListener('storage-update', handleStorageUpdate);
    return () => {
      window.removeEventListener('storage-update', handleStorageUpdate);
    };
  }, [handleStorageUpdate]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='70'%3E%3Crect width='70' height='70' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
  };

  return (
    <aside className="fixed top-[200px] left-[calc(50%+532px)] hidden min-[1250px]:flex flex-col gap-2 z-40">
      <div className="border border-gray-200 bg-white p-2 text-center shadow-sm w-[90px]">
        <p className="text-[11px] text-gray-400 mb-1">찜한상품</p>
        <div className="flex items-center justify-center gap-1 text-[13px] font-bold">
          <span className="text-red-500">♥</span>
          <span className="text-gray-600">{wishCount}</span>
        </div>
      </div>

      <div className="border border-gray-200 bg-white p-2 text-center shadow-sm w-[90px]">
        <p className="text-[11px] text-gray-500 mb-2 border-b border-gray-100 pb-1 font-semibold">
          최근본상품
        </p>
        <div className="flex flex-col gap-2 items-center bg-white min-h-[60px] py-1">
          <span className="text-red-500 font-bold text-[13px]">{recentItems.length}</span>
          <div className="w-full border-b border-dotted border-gray-200 mb-1"></div>

          {recentItems.length > 0 ? (
            recentItems.slice(0, 3).map((item) => (
              <div
                key={`quick-recent-${item.id}`}
                className="relative"
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
              >
                <Link
                  to={`/product/${item.id}`}
                  className="block w-[70px] h-[70px] border border-gray-100 overflow-hidden cursor-pointer hover:border-gray-300 transition-colors"
                >
                  <img
                    src={item.image || ''}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </Link>

                {hoveredItemId === item.id && (
                  <div className="absolute right-[85px] top-0 w-[240px] bg-white border border-gray-800 shadow-xl z-50 flex animate-in fade-in duration-200">
                    <div className="absolute -right-[9px] top-4 w-4 h-4 bg-white border-r border-t border-gray-800 rotate-45 z-10"></div>
                    <Link
                      to={`/product/${item.id}`}
                      className="flex p-3 gap-3 w-full items-start group"
                    >
                      <div className="flex-1 text-left">
                        <p className="text-[13px] text-gray-800 line-clamp-2 mb-1 leading-tight group-hover:underline">
                          {item.title}
                        </p>
                        <p className="text-[15px] font-bold text-gray-900 mt-1">
                          {(item.price || 0).toLocaleString()}원
                        </p>
                      </div>
                      <div className="w-16 h-16 flex-shrink-0 border border-gray-100">
                        <img
                          src={item.image || ''}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-[10px] text-gray-400 py-4 text-center">없음</p>
          )}
        </div>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="border border-gray-200 bg-white py-2 text-[11px] font-bold text-gray-500 shadow-sm hover:text-black transition-all"
      >
        TOP
      </button>
    </aside>
  );
};

export default QuickMenu;
