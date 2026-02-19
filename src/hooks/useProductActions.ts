import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types/Product';

export const useProductActions = (product: Product | undefined) => {
  // ✅ 초기값 설정 시 안전하게 검사
  const getInitialWishStatus = useCallback(() => {
    if (!product?.id) return false; // 데이터가 없으면 즉시 종료
    try {
      const savedWishes = localStorage.getItem('wish_list');
      const wishArr = savedWishes ? JSON.parse(savedWishes) : [];
      if (!Array.isArray(wishArr)) return false;
      return wishArr.map(String).includes(String(product.id));
    } catch {
      return false;
    }
  }, [product?.id]);

  const [isWished, setIsWished] = useState(false);

  useEffect(() => {
    setIsWished(getInitialWishStatus());
  }, [getInitialWishStatus]);

  // ✅ 최근 본 상품 업데이트 (데이터 유효성 검사 강화)
  useEffect(() => {
    if (!product || !product.id) return;
    try {
      const savedRecent = localStorage.getItem('recently_viewed');
      let recentArr = savedRecent ? JSON.parse(savedRecent) : [];
      if (!Array.isArray(recentArr)) recentArr = [];

      // 불완전한 데이터 필터링 및 중복 제거
      recentArr = recentArr.filter(
        (item: any) => item && item.id && String(item.id) !== String(product.id),
      );
      recentArr.unshift(product);

      localStorage.setItem('recently_viewed', JSON.stringify(recentArr.slice(0, 5)));
      window.dispatchEvent(new Event('storage-update'));
    } catch (e) {
      console.error(e);
    }
  }, [product]);

  const toggleWish = useCallback(() => {
    if (!product?.id) return;
    try {
      const savedWishes = localStorage.getItem('wish_list');
      let wishArr = savedWishes ? JSON.parse(savedWishes) : [];
      if (!Array.isArray(wishArr)) wishArr = [];

      const productIdStr = String(product.id);
      if (wishArr.map(String).includes(productIdStr)) {
        wishArr = wishArr.filter((id: any) => String(id) !== productIdStr);
        setIsWished(false);
      } else {
        wishArr.push(productIdStr);
        setIsWished(true);
      }
      localStorage.setItem('wish_list', JSON.stringify(wishArr));
      window.dispatchEvent(new Event('storage-update'));
    } catch (e) {
      console.error(e);
    }
  }, [product, isWished]);

  return { isWished, toggleWish };
};
