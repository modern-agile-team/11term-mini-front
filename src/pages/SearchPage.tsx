import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import type { Product } from '../types/Product';
import ProductCard from '../components/ProductCard';
import Filterbar from '../components/Filterbar';
import { useProductListFilters } from '../hooks/useProductListFilters';
import { filterProducts } from '../utils/filterProducts';
import { sortProducts } from '../utils/sortProducts';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const { sort, filters, onChangeSort, onChangeFilter, onResetFilter } = useProductListFilters();

  // 데이터 페칭 로직 추가
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('검색 데이터 로딩 실패:', error);
      }
    };
    fetchProducts();
  }, []);

  // 검색어 필터링
  const filteredProducts = useMemo(() => {
    const queryFiltered = products.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase()),
    );
    return filterProducts(queryFiltered, filters);
  }, [filters, query, products]);

  const sortedProducts = useMemo(() => sortProducts(filteredProducts, sort), [filteredProducts, sort]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Filterbar
        title={`'${query}' 검색결과`}
        countText={`${sortedProducts.length}개`}
        sort={sort}
        onChangeSort={onChangeSort}
        filters={filters}
        onChangeFilter={onChangeFilter}
        onResetFilter={onResetFilter}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="py-40 text-center text-gray-400">검색 결과가 없습니다.</div>
      )}
    </div>
  );
};

export default SearchPage;
