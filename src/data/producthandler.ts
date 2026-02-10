import { http, HttpResponse } from 'msw';
import { MOCK_PRODUCTS } from './mock';
import type { Product, CreateProductInput } from '../types/Product';

// 로컬 스토리지 데이터 관리 헬퍼
const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem('products');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('로컬스토리지 파싱 에러:', e);
    }
  }
  localStorage.setItem('products', JSON.stringify(MOCK_PRODUCTS));
  return MOCK_PRODUCTS;
};

export const producthandler = [
  // 1. 전체 상품 목록 조회
  http.get('/api/products', () => {
    const products = getStoredProducts();
    return HttpResponse.json(products);
  }),

  // 2. 특정 상품 상세 조회 (조회수 증가 로직 포함)
  http.get('/api/products/:id', ({ params }) => {
    const { id } = params;
    const products = getStoredProducts();
    const index = products.findIndex((p) => String(p.id) === String(id));

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    // 조회수 1 증가
    products[index] = {
      ...products[index],
      views: (products[index].views || 0) + 1,
    };

    // 업데이트된 목록 저장
    localStorage.setItem('products', JSON.stringify(products));

    return HttpResponse.json(products[index]);
  }),

  // 3. 상품 등록
  http.post('/api/products', async ({ request }) => {
    const inputData = (await request.json()) as CreateProductInput;
    const products = getStoredProducts();

    const newProduct: Product = {
      id: Date.now(),
      title: inputData.title,
      price: Number(inputData.price),
      location: inputData.location || '지역 정보 없음',
      createdAt: new Date().toISOString(),
      // Blob URL 깨짐 방지를 위해 임시 이미지 활용
      image: inputData.images?.[0] || `https://picsum.photos/400/400?random=${Date.now()}`,
      isThunderPay: inputData.isThunderPay ?? true,

      // 확장 필드 초기화
      views: 0,
      wishCount: 0,
      description: inputData.description || '',
      category: inputData.category || '기타',
      status: inputData.status || 'NEW',
      tags: inputData.tags || [],
    };

    const updatedProducts = [newProduct, ...products];
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    return HttpResponse.json(newProduct, { status: 201 });
  }),
];
