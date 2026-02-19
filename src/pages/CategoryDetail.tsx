import { useParams, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';

import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import QuickMenu from '../components/QuickMenu';
import Filterbar from '../components/Filterbar';

import { MOCK_PRODUCTS } from '../data/mock';
import { CATEGORIES } from '../data/categories';

import { sortProducts } from '../utils/sortProducts';
import { findCategoryPath } from '../utils/findCategoryPath';

import type { SortKey } from '../types/sort';
import type { Product } from '../types/Product';
import type { Category } from '../types/Category';

const COLS = 5;

const CategoryDetail = () => {
  const { id } = useParams();
  const [sort, setSort] = useState<SortKey>('latest');

  const sortedProducts = useMemo(() => sortProducts(MOCK_PRODUCTS as Product[], sort), [sort]);

  const categoryPath = useMemo(() => {
    if (!id) return [];
    return findCategoryPath(CATEGORIES, id);
  }, [id]);

  const current = categoryPath[categoryPath.length - 1] ?? null;

  const title = current?.name ?? '카테고리';

  const children = useMemo<Category[]>(() => {
    if (!current) return [];
    return (current.subCategories ?? []) as Category[];
  }, [current]);

  const showMegaGrid = children.length > 0;

  const gridItems = useMemo(() => {
    if (!current) return [];

    const base = [{ id: '__all__', name: '전체보기' } as Category, ...children];

    // ✅ 5칸 그리드에서 마지막 줄 빈칸도 border가 보이도록 패딩 셀 추가
    const remainder = base.length % COLS;
    const padCount = remainder === 0 ? 0 : COLS - remainder;

    const pads = Array.from({ length: padCount }, (_, i) => ({
      id: `__pad__${i}`,
      name: '',
    })) as Category[];

    return [...base, ...pads];
  }, [current, children]);

  return (
    <div className="min-h-screen bg-white">
      <QuickMenu />
      <main className="max-w-[1024px] mx-auto px-4 py-8">
        <CategoryNav />

        {showMegaGrid && current && (
          <section className="mt-4 mb-6 border border-gray-200 bg-white">
            <div className="grid grid-cols-5">
              {gridItems.map((c) => {
                const isPad = c.id.startsWith('__pad__');

                // ✅ 빈칸 셀: 클릭 안 되고 글자 없음, 대신 border는 유지
                if (isPad) {
                  return (
                    <div
                      key={c.id}
                      className="px-5 py-4 text-sm border-b border-r border-gray-200"
                    />
                  );
                }

                return (
                  <Link
                    key={c.id}
                    to={c.id === '__all__' ? `/category/${current.id}` : `/category/${c.id}`}
                    className="px-5 py-4 text-sm text-gray-800 hover:bg-gray-50 border-b border-r border-gray-200"
                  >
                    {c.id === '__all__' ? (
                      <span className="font-semibold">
                        전체보기 <span className="text-gray-400">{'>'}</span>
                      </span>
                    ) : (
                      c.name
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <Filterbar
          title={title}
          countText={`${sortedProducts.length}개`}
          sort={sort}
          onChangeSort={setSort}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default CategoryDetail;
