import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import QuickMenu from '../components/QuickMenu';
import Filterbar from '../components/Filterbar';
import { MOCK_PRODUCTS } from '../data/mock';
import { CATEGORIES } from '../data/categories';
import { sortProducts } from '../utils/sortProducts';
import { findCategoryPath } from '../utils/findCategoryPath';
import { makeCategoryGridItems } from '../utils/categoryGrid';
import { useInfiniteList } from '../hooks/useInfiniteList';
import { useProductListFilters } from '../hooks/useProductListFilters';
import { filterProducts } from '../utils/filterProducts';
import type { Product } from '../types/Product';
import type { Category } from '../types/Category';

const CATEGORY_GRID_COLUMNS = 5;
const PAGE_SIZE = 20;
const FETCHING_SKELETON_COUNT = 5;

const CategoryDetail = () => {
  const { id } = useParams();
  const { sort, filters, onChangeSort, onChangeFilter, onResetFilter } = useProductListFilters();

  const sortedProducts = useMemo(() => {
    const filteredProducts = filterProducts(MOCK_PRODUCTS as Product[], filters);
    return sortProducts(filteredProducts, sort);
  }, [filters, sort]);

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
                      className="border-b border-r border-gray-200 px-5 py-4 text-sm"
                    />
                  );
                }

                return (
                  <Link
                    key={card.id}
                    to={card.id === 'all' ? `/category/${current?.id}` : `/category/${card.id}`}
                    className="border-b border-r border-gray-200 px-5 py-4 text-sm text-gray-800 hover:bg-gray-50"
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
          onChangeSort={onChangeSort}
          filters={filters}
          onChangeFilter={onChangeFilter}
          onResetFilter={onResetFilter}
        />

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {visibleItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {isFetchingMore &&
            Array.from({ length: FETCHING_SKELETON_COUNT }).map((_, index) => (
              <ProductCardSkeleton key={`categoryFetching${index}`} />
            ))}
        </div>

        {hasNextPage && <div ref={setSentinelRef} className="mt-4 h-10" />}
      </main>
    </div>
  );
};

export default CategoryDetail;
