import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mock';
import type { Product } from '../types/Product';

const ProductDetail = () => {
  const { id } = useParams();
  const product = MOCK_PRODUCTS.find((p) => p.id === Number(id));
  const [isWished, setIsWished] = useState(false);

  useEffect(() => {
    if (!product) return;

    // 1. 최근 본 상품 저장 로직
    const savedRecent = localStorage.getItem('recently_viewed');
    let recentArr: Product[] = savedRecent ? JSON.parse(savedRecent) : [];
    recentArr = recentArr.filter((item) => item.id !== product.id);
    recentArr.unshift(product);
    localStorage.setItem('recently_viewed', JSON.stringify(recentArr.slice(0, 5)));

    // 2. 찜 상태 확인 및 업데이트
    const savedWishes = localStorage.getItem('wish_list');
    const wishArr: number[] = savedWishes ? JSON.parse(savedWishes) : [];
    const currentWished = wishArr.includes(product.id);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsWished((prev) => (prev !== currentWished ? currentWished : prev));

    // 3. 퀵메뉴 동기화 이벤트
    window.dispatchEvent(new Event('storage-update'));
  }, [product]);

  const handleWishClick = () => {
    if (!product) return;
    const savedWishes = localStorage.getItem('wish_list');
    let wishArr: number[] = savedWishes ? JSON.parse(savedWishes) : [];

    if (wishArr.includes(product.id)) {
      wishArr = wishArr.filter((wishId) => wishId !== product.id);
      setIsWished(false);
    } else {
      wishArr.push(product.id);
      setIsWished(true);
    }

    localStorage.setItem('wish_list', JSON.stringify(wishArr));
    window.dispatchEvent(new Event('storage-update'));
  };

  if (!product)
    return <div className="py-40 text-center text-gray-400 font-bold">상품 정보가 없습니다.</div>;

  return (
    <div className="max-w-[1024px] mx-auto px-4 py-10 bg-[#f9f9f9]">
      <div className="flex gap-8 mb-16 bg-white p-2 border border-gray-100 shadow-sm">
        <div className="w-[428px] h-[428px] bg-gray-100 overflow-hidden">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
        </div>

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

          <div className="flex gap-2 mt-8">
            <button
              onClick={handleWishClick}
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
