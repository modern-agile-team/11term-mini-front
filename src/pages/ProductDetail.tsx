import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import type { Product } from '../types/Product';
import { PRODUCT_STATUS } from '../types/Product';
import { useProductActions } from '../hooks/useProductActions';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // 찜 액션 훅 (데이터가 없을 때를 대비해 undefined 처리)
  const { isWished, toggleWish } = useProductActions(product || undefined);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // 1. MSW 핸들러의 '/api/products/:id' 경로를 호출하여 조회수를 증가시킨 데이터를 가져옵니다.
        const response = await api.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('상품 상세 정보 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // TODO: 리액트 suspense
  if (loading) {
    return (
      <div className="py-40 text-center text-gray-400 font-bold animate-pulse text-xl">
        데이터를 불러오는 중...
      </div>
    );
  }

  if (!product) {
    return <div className="py-40 text-center text-gray-400 font-bold">상품 정보가 없습니다.</div>;
  }

  return (
    <div className="max-w-[1024px] mx-auto px-4 py-10">
      <div className="flex gap-10 mb-16 bg-white">
        {/* 1. 왼쪽 상품 이미지 */}
        <div className="w-[428px] h-[428px] overflow-hidden border border-gray-100 shadow-sm">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
        </div>

        {/* 2. 오른쪽 상품 정보 */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-4 text-gray-900">{product.title}</h1>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-4xl font-bold">{product.price.toLocaleString()}</span>
              <span className="text-2xl font-normal">원</span>
            </div>

            {/* 통계 정보 섹션 (조회수 실시간 반영) */}
            <div className="flex justify-between items-center py-4 border-t border-gray-100 text-gray-400 text-sm">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="text-lg">♥</span> {product.wishCount || 0}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-lg">👁</span> {product.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-lg">🕒</span> 방금 전
                </span>
              </div>
              <button className="flex items-center gap-1 hover:text-gray-600 transition-colors">
                🚩{' '}
                <span className="underline decoration-gray-300 underline-offset-4">신고하기</span>
              </button>
            </div>

            {/* 상품 상세 정보 리스트 */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div className="flex text-[14px]">
                <span className="text-gray-400 w-24">• 상품상태</span>
                <span className="text-gray-800 font-medium">
                  {PRODUCT_STATUS.find((s) => s.id === product.status)?.label || '사용감 없음'}
                </span>
              </div>
              <div className="flex text-[14px]">
                <span className="text-gray-400 w-24">• 배송비</span>
                <span className="text-gray-800 font-medium">배송비 별도</span>
              </div>
              <div className="flex text-[14px]">
                <span className="text-gray-400 w-24">• 거래지역</span>
                <span className="text-gray-800 font-medium">📍 {product.location}</span>
              </div>
            </div>
          </div>

          {/* 액션 버튼 그룹 */}
          <div className="flex gap-2 mt-8 relative">
            <button
              onClick={toggleWish}
              className={`flex-1 h-14 font-bold rounded flex items-center justify-center gap-2 transition-all ${
                isWished ? 'bg-red-500 text-white' : 'bg-[#b2b2b2] text-white hover:bg-gray-400'
              }`}
            >
              <span className="text-xl">{isWished ? '♥' : '♡'}</span> 찜 {product.wishCount || 0}
            </button>
            <button className="flex-1 h-14 bg-[#ffa800] text-white font-bold rounded hover:brightness-95 transition">
              번개톡
            </button>
            <div className="flex-[1.2] relative group">
              <button className="w-full h-14 bg-[#ff5058] text-white font-bold rounded hover:brightness-95 transition">
                바로구매
              </button>
              {/* 안전결제 툴팁 */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-max bg-[#616ca1] text-white text-[11px] px-3 py-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-all">
                안전결제 수수료 없이 구매하세요
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#616ca1] rotate-45"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 상품 상세 설명 추가 섹션 */}
      <div className="border-t border-gray-200 pt-12">
        <h2 className="text-xl font-bold mb-8">상품정보</h2>
        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap min-h-[200px]">
          {product.description || '등록된 상세 설명이 없습니다.'}
        </div>

        {/* 태그 영역 */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex gap-2 mt-10">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full"
              >
                # {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
