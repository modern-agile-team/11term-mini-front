import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types/Product';

export const useProductActions = (product: Product | undefined) => {
  const getInitialWishStatus = useCallback(() => {
    if (!product) return false;
    const savedWishes = localStorage.getItem('wish_list');
    const wishArr: number[] = savedWishes ? JSON.parse(savedWishes) : [];
    return wishArr.includes(product.id);
  }, [product]);

  const [isWished, setIsWished] = useState(getInitialWishStatus);

  useEffect(() => {
    setIsWished(getInitialWishStatus());
  }, [getInitialWishStatus]);

  useEffect(() => {
    if (!product) return;

    // 최근 본 상품 업데이트
    const savedRecent = localStorage.getItem('recently_viewed');
    let recentArr: Product[] = savedRecent ? JSON.parse(savedRecent) : [];
    recentArr = recentArr.filter((item) => item.id !== product.id);
    recentArr.unshift(product);
    localStorage.setItem('recently_viewed', JSON.stringify(recentArr.slice(0, 5)));

    // 퀵메뉴 등 동기화
    window.dispatchEvent(new Event('storage-update'));
  }, [product]);

  const toggleWish = useCallback(() => {
    if (!product) return;

    const savedWishes = localStorage.getItem('wish_list');
    let wishArr: number[] = savedWishes ? JSON.parse(savedWishes) : [];

    if (wishArr.includes(product.id)) {
      wishArr = wishArr.filter((id) => id !== product.id);
      setIsWished(false);
    } else {
      wishArr.push(product.id);
      setIsWished(true);
    }

    localStorage.setItem('wish_list', JSON.stringify(wishArr));
    window.dispatchEvent(new Event('storage-update'));
  }, [product]);

  return { isWished, toggleWish };
};
