import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types/Product';

const QuickMenu = () => {
  const [recentItems, setRecentItems] = useState<Product[]>([]);
  const [wishCount, setWishCount] = useState(0);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);

  const loadData = useCallback(() => {
    const recent = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
    const wishes = JSON.parse(localStorage.getItem('wish_list') || '[]');

    setRecentItems((prev) => {
      const isSame = JSON.stringify(prev) === JSON.stringify(recent);
      return isSame ? prev : recent;
    });

    setWishCount((prev) => (prev === wishes.length ? prev : wishes.length));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();

    const onUpdate = () => {
      loadData();
    };

    window.addEventListener('storage-update', onUpdate);
    return () => {
      window.removeEventListener('storage-update', onUpdate);
    };
  }, [loadData]);

  return (
    <aside className="fixed top-[200px] left-[calc(50%+532px)] hidden min-[1250px]:flex flex-col gap-2 z-40">
      {/* 찜한 상품 */}
      <div className="border border-gray-200 bg-white p-2 text-center shadow-sm w-[90px]">
        <p className="text-[11px] text-gray-400 mb-1">찜한상품</p>
        <div className="flex items-center justify-center gap-1 text-[13px] font-bold">
          <span className="text-red-500">♥</span>
          <span className="text-gray-600">{wishCount}</span>
        </div>
      </div>

      {/* 최근 본 상품 리스트 */}
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
                key={item.id}
                className="relative"
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
              >
                {/*  상품 썸네일 (클릭 시 이동) */}
                <Link
                  to={`/product/${item.id}`}
                  className="block w-[70px] h-[70px] border border-gray-100 overflow-hidden cursor-pointer hover:border-gray-300 transition-colors"
                >
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </Link>

                {/*  마우스 호버 시 나타나는 상세 정보 말풍선 */}
                {hoveredItemId === item.id && (
                  <div className="absolute right-[85px] top-0 w-[240px] bg-white border border-gray-800 shadow-xl z-50 flex animate-in fade-in slide-in-from-right-2 duration-200">
                    {/* 말풍선 꼬리 */}
                    <div className="absolute -right-[9px] top-4 w-4 h-4 bg-white border-r border-t border-gray-800 rotate-45 z-10"></div>

                    <Link
                      to={`/product/${item.id}`}
                      className="flex p-3 gap-3 w-full items-start group"
                    >
                      <div className="flex-1 text-left">
                        <p className="text-[13px] text-gray-800 line-clamp-2 mb-1 leading-tight group-hover:underline">
                          {item.title}
                        </p>
                        <p className="text-[15px] font-bold text-gray-900">
                          {item.price.toLocaleString()}원
                        </p>
                      </div>
                      <div className="w-16 h-16 flex-shrink-0 border border-gray-100">
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    </Link>

                    {/* 상단 X 버튼 (디자인용) */}
                    <button className="absolute top-1 right-2 text-gray-400 text-[10px]">✕</button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-[10px] text-gray-400 leading-tight text-center py-4">
              최근 본 상품이 없습니다.
            </p>
          )}
        </div>
      </div>

      {/* TOP 버튼 */}
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
