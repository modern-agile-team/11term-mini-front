import { useParams } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';

import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import QuickMenu from '../components/QuickMenu';
import Filterbar from '../components/Filterbar';

import { CATEGORIES } from '../data/categories';
import { sortProducts } from '../utils/sortProducts';
import { findCategoryPath } from '../utils/findCategoryPath';
import api from '../api/axios';

import type { SortKey } from '../types/sort';
import type { Product } from '../types/Product';

interface ProductsResponse {
  products?: Product[];
  data?: Product[];
}

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [sort, setSort] = useState<SortKey>('latest');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get<Product[] | ProductsResponse>('/products');
        const responseData = response.data;
        const data: Product[] = Array.isArray(responseData)
          ? responseData
          : responseData.products || responseData.data || [];

        const filtered = data.filter((p) => {
          if (!id) return true;
          return p.category === id;
        });

        setProducts(filtered);
      } catch (error) {
        console.error('카테고리 상품 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [id]);

  const sortedProducts = useMemo(() => sortProducts(products, sort), [products, sort]);

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

        {loading ? (
          <div className="py-20 text-center text-gray-400">상품을 불러오는 중입니다...</div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-400">
            해당 카테고리에 등록된 상품이 없습니다.
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryDetail;
