import { http, HttpResponse } from 'msw';
import { MOCK_PRODUCTS } from '../data/mock';
import type { Product, CreateProductInput } from '../types/Product';

// 로컬 스토리지에서 데이터를 가져오거나 초기화하는 헬퍼 함수
const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem('products');
  if (!stored) {
    localStorage.setItem('products', JSON.stringify(MOCK_PRODUCTS));
    return MOCK_PRODUCTS;
  }
  return JSON.parse(stored);
};

export const productHandlers = [
  // 1. 전체 상품 목록 조회 (홈 화면 & 검색용)
  http.get('/api/products', () => {
    const products = getStoredProducts();
    return HttpResponse.json(products);
  }),

  // 2. 상품 등록 (판매하기용)
  http.post('/api/products', async ({ request }) => {
    const inputData = (await request.json()) as CreateProductInput;
    const products = getStoredProducts();

    const newProduct: Product = {
      id: Date.now(),
      title: inputData.title,
      price: Number(inputData.price),
      location: inputData.location || '지역 정보 없음',
      createdAt: new Date().toISOString(),
      image: inputData.images?.[0] || 'https://via.placeholder.com/400',
      isThunderPay: inputData.isThunderPay ?? true,
    };
    const updatedProducts = [newProduct, ...products];
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    return HttpResponse.json(newProduct, { status: 201 });
  }),
];
