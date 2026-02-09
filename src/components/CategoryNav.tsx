import { Link, useParams } from 'react-router-dom';
import { useMemo } from 'react';

import { CATEGORIES } from '../data/categories';
import { findCategoryPath } from '../utils/findCategoryPath';

const CategoryNav = () => {
  const { id } = useParams();

  const path = useMemo(() => {
    if (!id) return [];
    return findCategoryPath(CATEGORIES, id);
  }, [id]);

  return (
    <section className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-[1024px] mx-auto py-4 px-4 flex items-center text-sm text-gray-600 gap-2">
        <Link to="/" className="cursor-pointer hover:text-black flex items-center gap-1">
          🏠 홈
        </Link>

        {path.map((c) => (
          <span key={c.id} className="flex items-center gap-2">
            <span className="text-gray-300 mx-1">〉</span>

            <button className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded hover:border-gray-400 bg-white">
              {c.name}
              <span className="text-[10px] text-gray-400">▼</span>
            </button>
          </span>
        ))}
      </div>
    </section>
  );
};

export default CategoryNav;
