import { http, HttpResponse } from 'msw';
import { MOCK_PRODUCTS } from './mock';
import type { Product, CreateProductInput } from '../types/Product';

// 로컬 스토리지에서 데이터를 가져오거나 초기화하는 헬퍼 함수
const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem('products');
  // 1. 데이터가 존재하면 그대로 파싱해서 반환 (유지 핵심!)
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('로컬스토리지 파싱 에러:', e);
    }
  }

  // 2. 데이터가 아예 없을 때만(처음 접속 시) MOCK_PRODUCTS를 넣음
  localStorage.setItem('products', JSON.stringify(MOCK_PRODUCTS));
  return MOCK_PRODUCTS;
};

export const producthandler = [
  // 1. 전체 상품 목록 조회 (홈 화면 & 검색용)
  http.get('/api/products', () => {
    console.log('✅ MSW: 상품 목록 요청을 가로챘습니다.');
    const products = getStoredProducts();
    return HttpResponse.json(products);
  }),

  // 2. 상품 등록 (판매하기용)
  http.post('/api/products', async ({ request }) => {
    console.log('✅ MSW: 상품 등록 요청을 가로챘습니다!');
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
