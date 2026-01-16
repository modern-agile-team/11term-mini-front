// src/types/product.ts
export interface Product {
  id: number;
  title: string;
  price: number;
  location: string;         //지역
  createdAt: string;        // 만든날짜
  thumbnail: string;
  isThunderPay?: boolean; // 번개페이 가능 여부
  image: string;
}