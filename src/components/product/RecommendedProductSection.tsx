import ProductCard from '../ProductCard';
import type { Product } from '../../types/Product';

interface RecommendedProductSectionProps {
  recommendedProducts: Product[];
  isLoading: boolean;
}

const SKELETON_CARD_COUNT = 5;

const RecommendedProductSection = ({
  recommendedProducts,
  isLoading,
}: RecommendedProductSectionProps) => {
  if (!isLoading && recommendedProducts.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-gray-200 pt-12">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">이 상품과 비슷한 상품</h2>
          <p className="mt-2 text-sm text-gray-400">같은 카테고리와 비슷한 가격대 상품입니다.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
            <div key={`recommendedSkeleton${index}`} className="animate-pulse">
              <div className="aspect-square bg-gray-100" />
              <div className="mt-3 h-4 rounded bg-gray-100" />
              <div className="mt-2 h-4 w-2/3 rounded bg-gray-100" />
              <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:grid-cols-5">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecommendedProductSection;
