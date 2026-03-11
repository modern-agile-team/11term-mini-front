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
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
