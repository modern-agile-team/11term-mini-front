import { http, HttpResponse } from 'msw';
import { MOCK_PRODUCTS } from './mock';
import type { Product, CreateProductInput, SaleStatus } from '../types/Product';
import type { Account } from '../types/Account';

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

const viewCache = new Set<string>();

export const producthandler = [
  http.get('/api/products', () => {
    const products = getStoredProducts();
    return HttpResponse.json(products);
  }),

  http.get('/api/products/:id', ({ params }) => {
    const { id } = params;
    const products = getStoredProducts();
    const index = products.findIndex((p) => String(p.id) === String(id));

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    const cacheKey = `view_${id}`;
    if (!viewCache.has(cacheKey)) {
      products[index] = {
        ...products[index],
        views: (products[index].views || 0) + 1,
      };
      viewCache.add(cacheKey);
      localStorage.setItem('products', JSON.stringify(products));
    }

    return HttpResponse.json(products[index]);
  }),

  http.post('/api/products', async ({ request }) => {
    const inputData = (await request.json()) as CreateProductInput;
    const products = getStoredProducts();

    const authHeader = request.headers.get('Authorization');
    const currentSellerId = (() => {
      if (!authHeader) return 'unknown';

      try {
        const email = atob(authHeader.split('-').pop() || '');
        const users: Account[] = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u) => u.email === email);
        return user?.id || 'unknown';
      } catch (e) {
        console.error('유저 정보 추출 실패:', e);
        return 'unknown';
      }
    })();

    const newProduct: Product = {
      id: Date.now(),
      sellerId: currentSellerId,
      title: inputData.title,
      price: Number(inputData.price),
      location: inputData.location || '지역 정보 없음',
      createdAt: new Date().toISOString(),
      image: inputData.images?.[0] || `https://picsum.photos/400/400?random=${Date.now()}`,
      isThunderPay: inputData.isThunderPay ?? true,
      views: 0,
      wishCount: 0,
      description: inputData.description || '',
      category: inputData.category || '기타',
      status: inputData.status || 'NEW',
      tags: inputData.tags || [],
      saleStatus: 'ON_SALE',
    };

    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));

    return HttpResponse.json(newProduct, { status: 201 });
  }),

  http.patch('/api/products/:id/status', async ({ params, request }) => {
    const { id } = params;
    const { saleStatus } = (await request.json()) as { saleStatus: SaleStatus };

    const products = getStoredProducts();
    const index = products.findIndex((p) => String(p.id) === String(id));

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    products[index] = { ...products[index], saleStatus };
    localStorage.setItem('products', JSON.stringify(products));

    return HttpResponse.json(products[index]);
  }),

  http.delete('/api/products/:id', ({ params }) => {
    const { id } = params;
    const products = getStoredProducts();
    const index = products.findIndex((p) => String(p.id) === String(id));

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));

    return new HttpResponse(null, { status: 200 });
  }),
];
