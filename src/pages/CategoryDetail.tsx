import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';

import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import QuickMenu from '../components/QuickMenu';
import Filterbar from '../components/Filterbar';
import { MOCK_PRODUCTS } from '../data/mock';

type SortKey = 'latest' | 'popular' | 'low' | 'high';

const CategoryDetail = () => {
  const { id } = useParams();
  const [sort, setSort] = useState<SortKey>('latest');

  // ✅ sort 값에 따라 상품 목록을 "정렬해서" 새 배열로 만든다 (원본 MOCK_PRODUCTS는 건드리지 않음)
  const sortedProducts = useMemo(() => {
    const copy = [...MOCK_PRODUCTS];

    // price가 문자열/숫자일 수 있어서 숫자로 안전 변환
    const getPrice = (p: any) => {
      const v = p?.price;
      if (typeof v === 'number') return v;
      if (typeof v === 'string') return Number(v.replace(/[^\d.-]/g, '')) || 0;
      return 0;
    };

    // 인기값: 프로젝트마다 필드명이 다를 수 있어서 여러 후보로 fallback
    const getPopularity = (p: any) =>
      p?.likeCount ?? p?.likes ?? p?.wishCount ?? p?.wishes ?? p?.viewCount ?? p?.views ?? 0;

    // 최신순: createdAt 같은 날짜가 없으면 id로 fallback
    const getCreatedTime = (p: any) => {
      const v = p?.createdAt ?? p?.createdDate ?? p?.registeredAt ?? p?.date ?? null;
      const t = v ? new Date(v).getTime() : NaN;
      if (!Number.isNaN(t)) return t;
      return Number(p?.id) || 0;
    };

    switch (sort) {
      case 'latest':
        return copy.sort((a: any, b: any) => getCreatedTime(b) - getCreatedTime(a));
      case 'popular':
        return copy.sort((a: any, b: any) => getPopularity(b) - getPopularity(a));
      case 'low':
        return copy.sort((a: any, b: any) => getPrice(a) - getPrice(b));
      case 'high':
        return copy.sort((a: any, b: any) => getPrice(b) - getPrice(a));
      default:
        return copy;
    }
  }, [sort]);

  return (
    <div className="min-h-screen bg-white">
      <QuickMenu />
      <main className="max-w-[1024px] mx-auto px-4 py-8">
        {/* 카테고리 상세 페이지 전용 경로 표시 */}
        <CategoryNav />

        {/* ✅ 기존 상단 UI는 Filterbar로 "연결만" 해서 사용 */}
        <Filterbar
          title={id ?? '카테고리'}
          countText="131,067개"
          sort={sort}
          onChangeSort={setSort}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-4">
          {sortedProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default CategoryDetail;
