// src/components/CategoryNav.tsx
import { CATEGORIES } from '../data/categories';

const CategoryNav = () => {
  return (
    <section className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-[1024px] mx-auto py-4 px-4 flex items-center text-sm text-gray-600 gap-2">
        {/* 홈 아이콘 */}
        <span className="cursor-pointer hover:text-black flex items-center gap-1">
          🏠 홈
        </span>
        <span className="text-gray-300 mx-1">〉</span>

        {/* 대분류 드롭다운 */}
        <div className="relative group">
          <button className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded hover:border-gray-400 bg-white">
            여성의류 <span className="text-[10px] text-gray-400 group-hover:rotate-180 transition-transform">▼</span>
          </button>
          {/* 실제 드롭다운 목록 */}
          <ul className="absolute left-0 top-full mt-1 w-40 bg-white border border-gray-200 shadow-lg hidden group-hover:block z-50">
            {CATEGORIES.map(cat => (
              <li key={cat.id} className="px-3 py-2 hover:bg-gray-50 cursor-pointer">{cat.name}</li>
            ))}
          </ul>
        </div>

        <span className="text-gray-300 mx-1">〉</span>

        {/* 중분류 드롭다운 */}
        <div className="relative group">
          <button className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded hover:border-gray-400 bg-white">
            아우터 <span className="text-[10px] text-gray-400 group-hover:rotate-180 transition-transform">▼</span>
          </button>
          <ul className="absolute left-0 top-full mt-1 w-40 bg-white border border-gray-200 shadow-lg hidden group-hover:block z-50">
            <li className="px-3 py-2 hover:bg-gray-50 cursor-pointer">아우터</li>
            <li className="px-3 py-2 hover:bg-gray-50 cursor-pointer">상의</li>
          </ul>
        </div>

        <span className="text-gray-300 mx-1">〉</span>

        {/* 소분류 드롭다운  */}
        <div className="relative group">
          <button className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded border-gray-400 font-bold text-black bg-white">
            패딩 <span className="text-[10px] text-gray-400 group-hover:rotate-180 transition-transform">▼</span>
          </button>
          <ul className="absolute left-0 top-full mt-1 w-40 bg-white border border-gray-200 shadow-lg hidden group-hover:block z-50 font-normal">
            <li className="px-3 py-2 hover:bg-gray-50 cursor-pointer">패딩</li>
            <li className="px-3 py-2 hover:bg-gray-50 cursor-pointer">코트</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default CategoryNav;