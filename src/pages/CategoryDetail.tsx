import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';

import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import QuickMenu from '../components/QuickMenu';
import Filterbar from '../components/Filterbar';
import { MOCK_PRODUCTS } from '../data/mock';

import { sortProducts } from '../utils/sortProducts';
import type { SortKey } from '../types/sort';
import type { Product } from '../types/Product';

const CategoryDetail = () => {
  const { id } = useParams();
  const [sort, setSort] = useState<SortKey>('latest');

  const products = MOCK_PRODUCTS as unknown as Product[];

  const sortedProducts = useMemo(() => sortProducts(products, sort), [products, sort]);

  return (
    <div className="min-h-screen bg-white">
      <QuickMenu />
      <main className="max-w-[1024px] mx-auto px-4 py-8">
        <CategoryNav />

        <Filterbar
          title={id ?? '카테고리'}
          countText="131,067개"
          sort={sort}
          onChangeSort={setSort}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-4">
          {sortedProducts.map((product) => (
            <ProductCard
              key={(product as unknown as { id: string | number }).id}
              product={product}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default CategoryDetail;
