import { useState } from 'react';
import { CATEGORIES } from '../data/categories';
import type { Category } from '../types/Category';
import { Link } from 'react-router-dom'; 

const CategoryMenu = () => {
  const [activeLarge, setActiveLarge] = useState<Category | null>(null);
  const [activeMedium, setActiveMedium] = useState<Category | null>(null);

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 py-4 font-bold hover:text-[#ff5058]">
        <span className="text-xl">≡</span> 전체 카테고리
      </button>

      <div className="absolute top-full left-0 hidden group-hover:flex bg-white border border-gray-200 shadow-xl z-[100] h-[550px]">
        
        {/* 1단계: 대분류 */}
        <ul className="w-[180px] border-r border-gray-100 overflow-y-auto py-2">
          {CATEGORIES.map((cat) => (
            <li key={cat.id} onMouseEnter={() => { setActiveLarge(cat); setActiveMedium(null); }}>
              {/* 📍 Link 추가: 클릭 시 해당 대분류 페이지로 이동 */}
              <Link 
                to={`/category/${cat.id}`}
                className={`px-4 py-2.5 cursor-pointer text-[14px] flex justify-between items-center w-full
                  ${activeLarge?.id === cat.id ? 'bg-[#ff5058] text-white' : 'hover:bg-gray-50 hover:text-[#ff5058]'}`}
              >
                {cat.name}
                {activeLarge?.id === cat.id && <span className="text-[10px]">▶</span>}
              </Link>
            </li>
          ))}
        </ul>

        {/* 2단계: 중분류 */}
        {activeLarge && activeLarge.subCategories && activeLarge.subCategories.length > 0 && (
          <ul className="w-[180px] border-r border-gray-100 overflow-y-auto bg-gray-50 py-2">
            {activeLarge.subCategories.map((sub) => (
              <li key={sub.id} onMouseEnter={() => setActiveMedium(sub)}>
                {/* 📍 Link 추가 */}
                <Link 
                  to={`/category/${sub.id}`}
                  className={`px-4 py-2.5 cursor-pointer text-[14px] flex justify-between items-center w-full
                    ${activeMedium?.id === sub.id ? 'text-[#ff5058] font-bold' : 'hover:text-[#ff5058]'}`}
                >
                  {sub.name}
                  {activeMedium?.id === sub.id && <span className="text-[10px]">▶</span>}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* 3단계: 소분류 */}
        {activeMedium && activeMedium.subCategories && activeMedium.subCategories.length > 0 && (
          <ul className="w-[180px] overflow-y-auto bg-white py-2 shadow-inner">
            {activeMedium.subCategories.map((small) => (
              <li key={small.id}>
                {/* 📍 Link 추가 */}
                <Link 
                  to={`/category/${small.id}`}
                  className="px-4 py-2.5 cursor-pointer text-[14px] text-gray-600 hover:text-[#ff5058] hover:font-bold block w-full"
                >
                  {small.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoryMenu;