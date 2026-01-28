import { useParams } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mock';
import { useProductActions } from '../hooks/useProductActions';

const ProductDetail = () => {
  const { id } = useParams();
  const product = MOCK_PRODUCTS.find((p) => p.id === Number(id));

  const { isWished, toggleWish } = useProductActions(product);

  if (!product) {
    return <div className="py-40 text-center text-gray-400 font-bold">상품 정보가 없습니다.</div>;
  }

  return (
    <div className="max-w-[1024px] mx-auto px-4 py-10 bg-[#f9f9f9]">
      <div className="flex gap-8 mb-16 bg-white p-2 border border-gray-100 shadow-sm">
        {/* 상품 이미지 */}
        <div className="w-[428px] h-[428px] bg-gray-100 overflow-hidden">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
        </div>

        {/* 상품 정보 및 버튼 */}
        <div className="flex-1 flex flex-col justify-between py-2 pr-4">
          <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-900">{product.title}</h1>
            <div className="flex items-center gap-2 mb-8">
              <span className="text-4xl font-bold">{product.price.toLocaleString()}</span>
              <span className="text-2xl font-normal">원</span>
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div className="flex text-sm">
                <span className="text-gray-400 w-24">• 상품상태</span>
                <span className="text-gray-800 font-medium">사용감 없음</span>
              </div>
              <div className="flex text-sm">
                <span className="text-gray-400 w-24">• 거래지역</span>
                <span className="text-gray-800 font-medium">📍 {product.location}</span>
              </div>
            </div>
          </div>

          {/* 액션 버튼 그룹 */}
          <div className="flex gap-2 mt-8">
            <button
              onClick={toggleWish}
              className={`flex-1 h-14 font-bold rounded flex items-center justify-center gap-1 transition-all ${
                isWished ? 'bg-red-500 text-white' : 'bg-[#b2b2b2] text-white hover:brightness-95'
              }`}
            >
              <span className="text-xl">{isWished ? '♥' : '♡'}</span> 찜
            </button>
            <button className="flex-1 h-14 bg-[#ffa800] text-white font-bold rounded hover:brightness-95 transition">
              번개톡
            </button>
            <button className="flex-[1.2] h-14 bg-[#ff5058] text-white font-bold rounded hover:brightness-95 transition">
              바로구매
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
