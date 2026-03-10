import { http, HttpResponse } from 'msw';
import { MOCK_PRODUCTS } from './mock';
import type { Product, CreateProductInput, SaleStatus } from '../types/Product';
import type { Account } from '../types/Account';
import { SEARCH_CONFIG } from '../constants/header';

const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem('products');
  if (stored) {
    try {
      return JSON.parse(stored) as Product[];
    } catch (e) {
      console.error('로컬스토리지 파싱 에러:', e);
    }
  }
  localStorage.setItem('products', JSON.stringify(MOCK_PRODUCTS));
  return MOCK_PRODUCTS;
};

const viewCache = new Set<string>();

export const producthandler = [
  // 1. 전체 조회
  http.get('/api/products', () => {
    const products = getStoredProducts();
    return HttpResponse.json(products);
  }),

  // 1-1. 검색 자동완성 조회
  http.get('/api/search/suggestions', ({ request }) => {
    const requestUrl = new URL(request.url);
    const query = requestUrl.searchParams.get('q')?.trim().toLowerCase() || '';

    if (!query) {
      return HttpResponse.json([]);
    }

    const products = getStoredProducts();
    const suggestionMap = new Map<
      string,
      { keyword: string; matchedBy: 'title' | 'tag' | 'category' }
    >();

    products.forEach((product) => {
      const searchableFields = [
        { keyword: product.title, matchedBy: 'title' as const },
        { keyword: product.category, matchedBy: 'category' as const },
        ...product.tags.map((tag) => ({ keyword: tag, matchedBy: 'tag' as const })),
      ];

      searchableFields.forEach(({ keyword, matchedBy }) => {
        if (!keyword.toLowerCase().includes(query)) {
          return;
        }

        const normalizedKeyword = keyword.toLowerCase();
        if (!suggestionMap.has(normalizedKeyword)) {
          suggestionMap.set(normalizedKeyword, { keyword, matchedBy });
        }
      });
    });

    const suggestions = Array.from(suggestionMap.values())
      .sort((firstSuggestion, secondSuggestion) => {
        const firstStartsWithQuery = firstSuggestion.keyword.toLowerCase().startsWith(query);
        const secondStartsWithQuery = secondSuggestion.keyword.toLowerCase().startsWith(query);

        if (firstStartsWithQuery !== secondStartsWithQuery) {
          return firstStartsWithQuery ? -1 : 1;
        }

        return firstSuggestion.keyword.localeCompare(secondSuggestion.keyword, 'ko');
      })
      .slice(0, SEARCH_CONFIG.MAX_AUTOCOMPLETE_SUGGESTIONS);

    return HttpResponse.json(suggestions);
  }),

  // 2. 상세 조회
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

  // 3. 상품 등록
  http.post('/api/products', async ({ request }) => {
    const inputData = (await request.json()) as CreateProductInput;
    const products = getStoredProducts();

    const authHeader = request.headers.get('Authorization');
    let currentSellerId = 'unknown';

    if (authHeader) {
      try {
        const email = atob(authHeader.split('-').pop() || '');
        const users = JSON.parse(localStorage.getItem('users') || '[]') as Account[];
        const user = users.find((u) => u.email === email);
        if (user) currentSellerId = user.id;
      } catch (e) {
        console.error('유저 정보 추출 실패:', e);
      }
    }

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

    const updatedProducts = [newProduct, ...products];
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    return HttpResponse.json(newProduct, { status: 201 });
  }),

  // 4. 상품 수정
  http.patch('/api/products/:id', async ({ params, request }) => {
    const { id } = params;
    const updateData = (await request.json()) as Partial<CreateProductInput>;
    const products = getStoredProducts();

    const index = products.findIndex((p) => String(p.id) === String(id));
    if (index === -1) return new HttpResponse(null, { status: 404 });

    const mainImage =
      updateData.images && updateData.images.length > 0
        ? updateData.images[0]
        : products[index].image;

    const updatedProduct: Product = {
      ...products[index],
      ...updateData,
      image: mainImage,
      id: Number(id),
      sellerId: products[index].sellerId,
    };

    products[index] = updatedProduct;
    localStorage.setItem('products', JSON.stringify(products));

    return HttpResponse.json(updatedProduct);
  }),

  // 5. 판매 상태 변경
  http.patch('/api/products/:id/status', async ({ params, request }) => {
    const { id } = params;
    const { saleStatus } = (await request.json()) as { saleStatus: SaleStatus };

    const products = getStoredProducts();
    const index = products.findIndex((p) => String(p.id) === String(id));

    if (index === -1) return new HttpResponse(null, { status: 404 });

    products[index] = { ...products[index], saleStatus };
    localStorage.setItem('products', JSON.stringify(products));

    return HttpResponse.json(products[index]);
  }),

  // 6. 삭제
  http.delete('/api/products/:id', ({ params }) => {
    const { id } = params;
    const products = getStoredProducts();
    const filteredProducts = products.filter((p) => String(p.id) !== String(id));

    if (products.length === filteredProducts.length) {
      return new HttpResponse(null, { status: 404 });
    }

    localStorage.setItem('products', JSON.stringify(filteredProducts));
    return HttpResponse.json({ success: true });
  }),
];
