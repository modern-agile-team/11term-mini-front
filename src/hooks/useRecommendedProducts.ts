import { useEffect, useMemo, useState } from 'react';
import { getProducts } from '../api/product';
import type { Product } from '../types/Product';

const RECOMMENDED_PRODUCT_COUNT = 5;
const SIMILAR_PRICE_RANGE_RATIO = 0.3;

export const useRecommendedProducts = (currentProduct?: Product | null) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentProduct) {
      setAllProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const products = await getProducts();
        setAllProducts(products);
      } catch (error) {
        console.error('추천 상품 로딩 실패:', error);
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentProduct]);

  const recommendedProducts = useMemo(() => {
    if (!currentProduct) {
      return [];
    }

    const minimumPrice = currentProduct.price * (1 - SIMILAR_PRICE_RANGE_RATIO);
    const maximumPrice = currentProduct.price * (1 + SIMILAR_PRICE_RANGE_RATIO);

    return allProducts
      .filter((product) => product.id !== currentProduct.id)
      .filter((product) => !product.saleStatus || product.saleStatus === 'ON_SALE')
      .filter((product) => product.category === currentProduct.category)
      .filter((product) => product.price >= minimumPrice && product.price <= maximumPrice)
      .sort((firstProduct, secondProduct) => {
        const firstPriceGap = Math.abs(firstProduct.price - currentProduct.price);
        const secondPriceGap = Math.abs(secondProduct.price - currentProduct.price);

        if (firstPriceGap !== secondPriceGap) {
          return firstPriceGap - secondPriceGap;
        }

        return (
          new Date(secondProduct.createdAt).getTime() - new Date(firstProduct.createdAt).getTime()
        );
      })
      .slice(0, RECOMMENDED_PRODUCT_COUNT);
  }, [allProducts, currentProduct]);

  return {
    recommendedProducts,
    isLoading,
  };
};
