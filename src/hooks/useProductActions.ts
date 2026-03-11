import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './useAuth';
import type { Product } from '../types/Product';

interface FavoriteProduct {
  productId: number;
  productTitle: string;
  productPrice: number;
  imageUrl: string;
  createdAt: string;
}

interface FavoriteResponse {
  data?: FavoriteProduct[];
}

export const useProductActions = (product: Product | undefined) => {
  const { userInfo } = useAuth();
  const [isWished, setIsWished] = useState(false);

  // 관심상품 상태 조회
  useEffect(() => {
    let ignore = false;

    const fetchWishStatus = async () => {
      const productId = product?.id;
      const userId = userInfo?.userId;

      if (!productId || !userId) {
        await Promise.resolve();
        if (!ignore) setIsWished(false);
        return;
      }

      try {
        const response = await api.get<FavoriteProduct[] | FavoriteResponse>(
          `/users/${userId}/favorites`,
        );
        const responseData = response.data;

        const favorites: FavoriteProduct[] = Array.isArray(responseData)
          ? responseData
          : responseData.data || [];

        const isFav = favorites.some((fav) => String(fav.productId) === String(productId));
        if (!ignore) setIsWished(isFav);
      } catch (error) {
        console.error('관심상품 상태 조회 실패:', error);
        if (!ignore) setIsWished(false);
      }
    };

    fetchWishStatus();

    return () => {
      ignore = true;
    };
  }, [product?.id, userInfo?.userId]);

  useEffect(() => {
    const productId = product?.id;
    if (!product || !productId) return;

    try {
      const savedRecent = localStorage.getItem('recently_viewed');
      let recentArr: Product[] = savedRecent ? JSON.parse(savedRecent) : [];
      if (!Array.isArray(recentArr)) recentArr = [];

      recentArr = recentArr.filter(
        (item) => item && item.id && String(item.id) !== String(productId),
      );
      recentArr.unshift(product);

      localStorage.setItem('recently_viewed', JSON.stringify(recentArr.slice(0, 5)));
      window.dispatchEvent(new Event('storage-update'));
    } catch (error) {
      console.error('최근 본 상품 업데이트 실패:', error);
    }
  }, [product]);

  const toggleWish = useCallback(async () => {
    const productId = product?.id;
    if (!productId) return;

    if (!userInfo) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    try {
      if (isWished) {
        await api.delete(`/products/${productId}/favorites`);
        setIsWished(false);
      } else {
        await api.post(`/products/${productId}/favorites`);
        setIsWished(true);
      }
    } catch (error) {
      console.error('관심상품 처리 중 오류:', error);
      alert('관심상품 처리에 실패했습니다.');
    }
  }, [product?.id, userInfo, isWished]);

  return { isWished, toggleWish };
};
