export type SaleStatus = 'ON_SALE' | 'RESERVED' | 'SOLD_OUT';

export interface Product {
  id: number;
  sellerId: string;
  title: string;
  price: number;
  location: string;
  createdAt: string;
  image: string;
  images: string[];
  views: number;
  wishCount: number;
  description: string;
  category: string;
  status: string;
  tags: string[];
  saleStatus: SaleStatus;
  isThunderPay?: boolean;
}

export interface CreateProductInput {
  title: string;
  price: number;
  location: string;
  description: string;
  category: string;
  status: string;
  tags: string[];
  images: string[];
  shippingFee?: string;
  directTrade?: boolean;
  quantity?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const PRODUCT_STATUS = [
  { id: 'NEW', label: '새 상품 (미사용)', desc: '사용하지 않은 새 상품' },
  { id: 'LIKE_NEW', label: '사용감 없음', desc: '사용은 했지만 흔적이 없음' },
  { id: 'USED', label: '중고 상품', desc: '사용감이 있는 일반적인 중고' },
] as const;
