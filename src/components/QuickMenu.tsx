import { useEffect, useState, useCallback } from 'react';
import type { Product } from '../types/Product';

const QuickMenu = () => {
  const [recentItems, setRecentItems] = useState<Product[]>([]);
  const [wishCount, setWishCount] = useState(0);

  const loadData = useCallback(() => {
    const recent = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
    const wishes = JSON.parse(localStorage.getItem('wish_list') || '[]');
    
    setRecentItems(prev => {
      const isSame = JSON.stringify(prev) === JSON.stringify(recent);
      return isSame ? prev : recent;
    });
    
    setWishCount(prev => (prev === wishes.length ? prev : wishes.length));
  }, []);

  useEffect(() => {
    //  1. 컴포넌트 마운트 시 데이터 로드
    loadData();
    
    //  2. 커스텀 이벤트를 통한 실시간 업데이트 핸들러
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
      <div className="border border-gray-200 bg-white p-2 text-center shadow-sm w-[90px]">
        <p className="text-[11px] text-gray-400 mb-1">찜한상품</p>
        <div className="flex items-center justify-center gap-1 text-[13px] font-bold">
          <span className="text-gray-300">♥</span>
          <span className="text-gray-600">{wishCount}</span>
        </div>
      </div>

      <div className="border border-gray-200 bg-white p-2 text-center shadow-sm w-[90px]">
        <p className="text-[11px] text-gray-500 mb-2 border-b border-gray-100 pb-1 font-semibold">최근본상품</p>
        <div className="flex flex-col gap-2 items-center bg-white min-h-[60px] py-1">
          <span className="text-red-500 font-bold text-[13px]">{recentItems.length}</span>
          <div className="w-full border-b border-dotted border-gray-200 mb-1"></div>
          
          {recentItems.length > 0 ? (
            recentItems.slice(0, 2).map((item) => (
              <div key={item.id} className="w-[70px] h-[70px] border border-gray-100 overflow-hidden cursor-pointer hover:border-gray-300 transition-colors">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
            ))
          ) : (
            <p className="text-[10px] text-gray-400 leading-tight text-center py-4">최근 본 상품이 없습니다.</p>
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