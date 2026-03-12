import { useParams, Link } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';

import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import QuickMenu from '../components/QuickMenu';
import Filterbar from '../components/Filterbar';

import { CATEGORIES } from '../data/categories';
import { sortProducts } from '../utils/sortProducts';
import { findCategoryPath } from '../utils/findCategoryPath';
import api from '../api/axios';
import { makeCategoryGridItems } from '../utils/categoryGrid';
import { useInfiniteList } from '../hooks/useInfiniteList';

import type { SortKey } from '../types/sort';
import type { Product } from '../types/Product';
import type { Category } from '../types/Category';

const CATEGORY_GRID_COLUMNS = 5;
const PAGE_SIZE = 20;
const FETCHING_SKELETON_COUNT = 5;

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

  const current = categoryPath[categoryPath.length - 1] ?? null;
  const title = current?.name ?? '카테고리';

  const children = useMemo<Category[]>(() => {
    if (!current) return [];
    return (current.subCategories ?? []) as Category[];
  }, [current]);

  const showMegaGrid = children.length > 0;

  const gridCardItems = useMemo(() => {
    if (!current) return [];

    const base = [{ id: 'all', name: '전체보기' } as Category, ...children];

    return makeCategoryGridItems({
      base,
      columns: CATEGORY_GRID_COLUMNS,
    });
  }, [current, children]);

  const { visibleItems, isFetchingMore, hasNextPage, setSentinelRef } = useInfiniteList({
    items: sortedProducts,
    pageSize: PAGE_SIZE,
  });

  return (
    <div className="min-h-screen bg-white">
      <QuickMenu />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <CategoryNav />

        {showMegaGrid && (
          <section className="mt-4 mb-6 bg-white">
            <div className="grid grid-cols-5 border border-gray-200">
              {gridCardItems.map((card) => {
                const isPad = card.id.startsWith('pad:');

                if (isPad) {
                  return (
                    <div
                      key={card.id}
                      className="px-5 py-4 text-sm border-b border-r border-gray-200"
                    />
                  );
                }

                return (
                  <Link
                    key={card.id}
                    to={card.id === 'all' ? `/category/${current?.id}` : `/category/${card.id}`}
                    className="px-5 py-4 text-sm text-gray-800 hover:bg-gray-50 border-b border-r border-gray-200"
                  >
                    {card.id === 'all' ? (
                      <span className="font-semibold">
                        전체보기 <span className="text-gray-400">{'>'}</span>
                      </span>
                    ) : (
                      card.name
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

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-4 mt-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <ProductCardSkeleton key={`categoryInitialSkeleton-${index}`} />
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-4 mt-6">
              {visibleItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}

              {isFetchingMore &&
                Array.from({ length: FETCHING_SKELETON_COUNT }).map((_, index) => (
                  <ProductCardSkeleton key={`categoryFetching-${index}`} />
                ))}
            </div>
            {hasNextPage && <div ref={setSentinelRef} className="h-10 mt-4" />}
          </>
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
