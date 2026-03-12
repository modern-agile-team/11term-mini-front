import { useParams, Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import QuickMenu from '../components/QuickMenu';
import Filterbar from '../components/Filterbar';

import { CATEGORIES } from '../data/categories';

import { sortProducts } from '../utils/sortProducts';
import { findCategoryPath } from '../utils/findCategoryPath';
import { makeCategoryGridItems } from '../utils/categoryGrid';
import { useInfiniteList } from '../hooks/useInfiniteList';
import { collectCategoryIds, normalizeProductCategory } from '../utils/productCategory';
import { fetchProductsWithFallback } from '../utils/productSource';

import type { SortKey } from '../types/sort';
import type { Product } from '../types/Product';
import type { Category } from '../types/Category';

const CATEGORY_GRID_COLUMNS = 5;
const PAGE_SIZE = 20;
const INITIAL_SKELETON_COUNT = 10;
const FETCHING_SKELETON_COUNT = 5;

const CategoryDetail = () => {
  const { id } = useParams();
  const [sort, setSort] = useState<SortKey>('latest');
  const [products, setProducts] = useState<Product[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsInitialLoading(true);
        const data = await fetchProductsWithFallback();
        setProducts(data);
      } catch (error) {
        console.error('카테고리 상품 로딩 실패:', error);
        setProducts([]);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categoryPath = useMemo(() => {
    if (!id) return [];
    return findCategoryPath(CATEGORIES, id);
  }, [id]);

  const current = categoryPath[categoryPath.length - 1] ?? null;
  const title = current?.name ?? '카테고리';
  const categoryIds = useMemo(() => (current ? collectCategoryIds(current) : []), [current]);
  const currentDepth = useMemo(() => (current?.id ? current.id.split('-').length : 0), [current?.id]);
  const topLevelCategoryName = categoryPath[0]?.name ?? '';
  const midLevelCategoryName = categoryPath[1]?.name ?? '';

  const filteredProducts = useMemo(() => {
    if (!current) return [];

    return products.filter((product) => {
      if (product.saleStatus && product.saleStatus !== 'ON_SALE') {
        return false;
      }

      const normalizedCategory = normalizeProductCategory({
        categoryId: product.categoryId,
        categoryName: product.category,
        title: product.title,
      });

      if (normalizedCategory.categoryId && categoryIds.includes(normalizedCategory.categoryId)) {
        return true;
      }

      if (currentDepth === 1) {
        return normalizedCategory.category === topLevelCategoryName;
      }

      if (currentDepth === 2) {
        return (
          normalizedCategory.category === current.name ||
          normalizedCategory.category === midLevelCategoryName
        );
      }

      return false;
    });
  }, [categoryIds, current, currentDepth, midLevelCategoryName, products, topLevelCategoryName]);

  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts as Product[], sort),
    [filteredProducts, sort],
  );

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
            {/* ✅ border는 wrapper(부모)에만 주고, 셀은 border-r/b만 유지해서 중첩을 줄임 */}
            <div className="grid grid-cols-5 border border-gray-200">
              {gridCardItems.map((card) => {
                const isPad = card.id.startsWith('pad:');

                // ✅ 빈칸 셀: 클릭 안 되고 글자 없음, 대신 border는 유지
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-4">
          {isInitialLoading
            ? Array.from({ length: INITIAL_SKELETON_COUNT }).map((_, index) => (
                <ProductCardSkeleton key={`categorySkeleton-${index}`} />
              ))
            : visibleItems.map((product) => <ProductCard key={product.id} product={product} />)}

          {!isInitialLoading &&
            sortedProducts.length === 0 && (
              <div className="col-span-full py-24 text-center text-gray-400">
                해당 카테고리의 상품이 없습니다.
              </div>
            )}

          {!isInitialLoading &&
            isFetchingMore &&
            Array.from({ length: FETCHING_SKELETON_COUNT }).map((_, index) => (
              <ProductCardSkeleton key={`categoryFetching-${index}`} />
            ))}
        </div>

        {!isInitialLoading && hasNextPage && <div ref={setSentinelRef} className="h-10 mt-4" />}
      </main>
    </div>
  );
};

export default CategoryDetail;
