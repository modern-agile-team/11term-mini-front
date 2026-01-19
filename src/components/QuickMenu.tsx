// src/components/QuickMenu.tsx
const QuickMenu = () => {
  return (
    <aside className="fixed top-[200px] left-[calc(50%+532px)] hidden min-[1250px]:flex flex-col gap-2 z-40">
      
      {/* 찜한 상품 */}
      <div className="border border-gray-200 bg-white p-2 text-center shadow-sm w-[90px]">
        <p className="text-[11px] text-gray-400 mb-1">찜한상품</p>
        <div className="flex items-center justify-center gap-1 text-[13px] font-bold">
          <span className="text-red-500">♥</span>
          <span>0</span>
        </div>
      </div>

      {/* 최근본 상품 */}
      <div className="border border-gray-200 bg-white p-2 text-center shadow-sm w-[90px]">
        <p className="text-[11px] text-gray-500 mb-2 border-b border-gray-100 pb-1 font-semibold">최근본상품</p>
        <div className="py-4 flex flex-col items-center justify-center bg-white">
           <p className="text-[10px] text-gray-400 leading-tight text-center">
            최근 본 상품이<br />없습니다.
          </p>
        </div>
      </div>

      {/* TOP 버튼 */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="border border-gray-200 bg-white py-2 text-[11px] font-bold text-gray-500 shadow-sm hover:text-black transition-all bg-white"
      >
        TOP
      </button>
    </aside>
  );
};

export default QuickMenu;