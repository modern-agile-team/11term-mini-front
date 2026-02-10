import { useParams } from 'react-router-dom';
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

const CategoryDetail = () => {
  const { id } = useParams();
  const [sort, setSort] = useState<SortKey>('latest');

  const sortedProducts = useMemo(() => sortProducts(MOCK_PRODUCTS as Product[], sort), [sort]);

  const categoryPath = useMemo(() => {
    if (!id) return [];
    return findCategoryPath(CATEGORIES, id);
  }, [id]);

  const title = categoryPath[categoryPath.length - 1]?.name ?? '카테고리';

  return (
    <div className="min-h-screen bg-white">
      <QuickMenu />
      <main className="max-w-[1024px] mx-auto px-4 py-8">
        <CategoryNav />

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
