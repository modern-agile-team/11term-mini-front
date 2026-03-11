import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types/Product';

export const useProductActions = (product: Product | undefined) => {
  const getInitialWishStatus = useCallback(() => {
    if (!product?.id) return false;
    try {
      const savedWishes = localStorage.getItem('wish_list');
      const wishArr: string[] = savedWishes ? JSON.parse(savedWishes) : [];
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

  useEffect(() => {
    if (!product || !product.id) return;
    try {
      const savedRecent = localStorage.getItem('recently_viewed');
      let recentArr: Product[] = savedRecent ? JSON.parse(savedRecent) : [];
      if (!Array.isArray(recentArr)) recentArr = [];

      recentArr = recentArr.filter(
        (item) => item && item.id && String(item.id) !== String(product.id),
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
      let wishArr: string[] = savedWishes ? JSON.parse(savedWishes) : [];
      if (!Array.isArray(wishArr)) wishArr = [];

      const productIdStr = String(product.id);
      if (wishArr.map(String).includes(productIdStr)) {
        wishArr = wishArr.filter((id) => String(id) !== productIdStr);
        setIsWished(false);
      } else {
        wishArr.push(productIdStr);
        setIsWished(true);
      }

      localStorage.setItem('wish_list', JSON.stringify(wishArr));
      window.dispatchEvent(new Event('storage-update'));
    } catch (error) {
      console.error('찜하기 처리 중 오류:', error);
    }
  }, [product?.id]);

  return { isWished, toggleWish };
};
