import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import type { Product } from '../types/Product';
import { PRODUCT_STATUS } from '../types/Product';
import { useProductActions } from '../hooks/useProductActions';
import { useFollow } from '../hooks/useFollow';
import { useFollowList } from '../hooks/useFollowList';
import SellerProfileCard from '../components/seller/SellerProfileCard';
import FollowListModal from '../components/seller/FollowListModal';
import { Heart, Eye, Clock } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchedIdRef = useRef<string | null>(null);

  const { isWished, toggleWish } = useProductActions(product || undefined);
  const { sellerProfile, canFollow, isFollowPending, toggleSellerFollow } = useFollow(
    product?.sellerId,
  );
  const {
    isModalOpen,
    isListLoading,
    listType,
    followUsers,
    openFollowListModal,
    closeFollowListModal,
  } = useFollowList();

  useEffect(() => {
    if (!id) return;
    if (fetchedIdRef.current === id) return;
    fetchedIdRef.current = id;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/products/${id}`);
        const data = response?.data;

        if (data?.id) {
          setProduct(data as Product);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('상품 상세 정보 로딩 실패:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleWishClick = () => {
    toggleWish();
    setProduct((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        wishCount: isWished ? Math.max(0, prev.wishCount - 1) : prev.wishCount + 1,
      };
    });
  };

  const handleFollowClick = async () => {
    try {
      await toggleSellerFollow();
    } catch {
      alert('팔로우 처리 중 오류가 발생했습니다.');
    }
  };

  const handleOpenFollowers = async () => {
    if (!sellerProfile?.id) return;
    await openFollowListModal(sellerProfile.id, 'followers');
  };

  const handleOpenFollowing = async () => {
    if (!sellerProfile?.id) return;
    await openFollowListModal(sellerProfile.id, 'following');
  };

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
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex gap-10 mb-16 bg-white">
        <div className="w-107 h-107 overflow-hidden border border-gray-100 shadow-sm shrink-0">
          <img
            src={product.image || ''}
            alt={product.title || '상품 이미지'}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-4 text-gray-900">
              {product.title || '제목 없음'}
            </h1>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-4xl font-bold">{(product.price || 0).toLocaleString()}</span>
              <span className="text-2xl font-normal">원</span>
            </div>

            <div className="flex justify-between items-center py-4 border-t border-gray-100 text-gray-400 text-sm">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleWishClick}
                  className="flex items-center gap-1 group transition-colors"
                  aria-label="찜하기"
                >
                  <Heart
                    size={18}
                    className={`transition-all ${
                      isWished
                        ? 'text-[#ff5058] fill-[#ff5058]'
                        : 'text-gray-300 group-hover:text-gray-400'
                    }`}
                  />
                  <span className={`text-sm ${isWished ? 'text-[#ff5058]' : 'text-gray-400'}`}>
                    {product.wishCount || 0}
                  </span>
                </button>
                <span className="flex items-center gap-1">
                  <Eye size={18} className="text-gray-300" /> {product.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={18} className="text-gray-300" /> 방금 전
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div className="flex text-[14px]">
                <span className="text-gray-400 w-24">• 상품상태</span>
                <span className="text-gray-800 font-medium">
                  {PRODUCT_STATUS.find((s) => s.id === product.status)?.label || '알 수 없음'}
                </span>
              </div>
              <div className="flex text-[14px]">
                <span className="text-gray-400 w-24">• 거래지역</span>
                <span className="text-gray-800 font-medium">📍 {product.location || '전국'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-8 relative">
            <button
              onClick={handleWishClick}
              className={`flex-1 h-14 font-bold rounded flex items-center justify-center gap-2 transition-all ${
                isWished ? 'bg-[#ff5058] text-white' : 'bg-[#b2b2b2] text-white hover:bg-gray-400'
              }`}
            >
              <Heart size={20} className={isWished ? 'fill-white text-white' : 'text-white'} />찜{' '}
              {product.wishCount || 0}
            </button>
            <button className="flex-1 h-14 bg-[#ffa800] text-white font-bold rounded hover:brightness-95 transition">
              번개톡
            </button>
            <div className="flex-[1.2] relative group">
              <button className="w-full h-14 bg-[#ff5058] text-white font-bold rounded hover:brightness-95 transition">
                바로구매
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-12">
        <h2 className="text-xl font-bold mb-8">상품정보</h2>
        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap min-h-50">
          {product.description || '등록된 상세 설명이 없습니다.'}
        </div>
      </div>

      {sellerProfile && (
        <SellerProfileCard
          sellerProfile={sellerProfile}
          canFollow={canFollow}
          isFollowPending={isFollowPending}
          onOpenFollowers={handleOpenFollowers}
          onOpenFollowing={handleOpenFollowing}
          onFollowClick={handleFollowClick}
        />
      )}

      <FollowListModal
        isOpen={isModalOpen}
        listType={listType}
        isLoading={isListLoading}
        followUsers={followUsers}
        onClose={closeFollowListModal}
      />
    </div>
  );
};

export default ProductDetail;
