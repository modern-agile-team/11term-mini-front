// src/types/product.ts
export interface Product {
  id: number;
  title: string;
  price: number;
  location: string;
  createdAt: string;
  image: string;          
  isThunderPay?: boolean;
}