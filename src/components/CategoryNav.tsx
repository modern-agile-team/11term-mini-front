import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';

import { CATEGORIES } from '../data/categories';
import type { Category } from '../types/Category';
import { findCategoryPath } from '../utils/findCategoryPath';

const CategoryNav = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const path = useMemo(() => {
    if (!id) return [];
    return findCategoryPath(CATEGORIES, id);
  }, [id]);

  const main = path[0] ?? null;
  const mid = path[1] ?? null;
  const sub = path[2] ?? null;

  const mainList = CATEGORIES;

  const midList = useMemo<Category[]>(() => {
    if (!main) return [];
    return (main.subCategories ?? []) as Category[];
  }, [main]);

  const subList = useMemo<Category[]>(() => {
    if (!mid) return [];
    return (mid.subCategories ?? []) as Category[];
  }, [mid]);

  const go = (nextId: string) => {
    navigate(`/category/${nextId}`);
  };

  const menu =
    'absolute left-0 top-full mt-0 w-48 bg-white border border-gray-200 rounded shadow-md z-50 max-h-72 overflow-auto';

  const item = 'w-full text-left px-3 py-2 text-sm hover:bg-gray-50';

  const btn =
    'flex items-center gap-1 px-3 py-1 border border-gray-200 rounded hover:border-gray-400 bg-white';

  return (
    <section className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto py-4 px-4 flex items-center text-sm text-gray-600 gap-2">
        <Link to="/" className="cursor-pointer hover:text-black flex items-center gap-1">
          🏠 홈
        </Link>

        <span className="text-gray-300 mx-1">〉</span>
        <div className="relative group">
          <button className={btn}>
            {main?.name ?? '대분류'}
            <span className="text-[10px] text-gray-400 group-hover:rotate-180 transition-transform">
              ▼
            </span>
          </button>

          <ul className={`${menu} hidden group-hover:block`}>
            {mainList.map((c) => (
              <li key={c.id}>
                <button className={item} onClick={() => go(c.id)}>
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <span className="text-gray-300 mx-1">〉</span>
        <div className={`relative group ${!main ? 'pointer-events-none opacity-50' : ''}`}>
          <button className={btn}>
            {mid?.name ?? '중분류'}
            <span className="text-[10px] text-gray-400 group-hover:rotate-180 transition-transform">
              ▼
            </span>
          </button>

          <ul className={`${menu} hidden group-hover:block`}>
            {midList.map((c) => (
              <li key={c.id}>
                <button className={item} onClick={() => go(c.id)}>
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <span className="text-gray-300 mx-1">〉</span>
        <div className={`relative group ${!mid ? 'pointer-events-none opacity-50' : ''}`}>
          <button className={btn}>
            {sub?.name ?? '소분류'}
            <span className="text-[10px] text-gray-400 group-hover:rotate-180 transition-transform">
              ▼
            </span>
          </button>

          <ul className={`${menu} hidden group-hover:block`}>
            {subList.map((c) => (
              <li key={c.id}>
                <button className={item} onClick={() => go(c.id)}>
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default CategoryNav;
