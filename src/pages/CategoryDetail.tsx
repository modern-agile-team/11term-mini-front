import { useParams } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import QuickMenu from '../components/QuickMenu';
import { MOCK_PRODUCTS } from '../data/mock';

const CategoryDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-white">
      <QuickMenu />
      <main className="max-w-[1024px] mx-auto px-4 py-8">
        {/*  카테고리 상세 페이지 전용 경로 표시 */}
        <CategoryNav />

        <div className="mt-8 mb-6 flex justify-between items-end border-b pb-4">
          <h2 className="text-2xl font-bold">
            {id} <span className="text-gray-400 text-lg font-normal ml-2">131,067개</span>
          </h2>
          <div className="flex gap-4 text-sm text-gray-500">
            <button className="text-[#ff5058] font-bold">최신순</button>
            <button>인기순</button>
            <button>저가순</button>
            <button>고가순</button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-4">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default CategoryDetail;
