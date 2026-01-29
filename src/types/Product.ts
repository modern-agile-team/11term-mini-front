export interface Product {
  id: number;
  title: string;
  price: number;
  location: string;
  createdAt: string;
  image: string;
  isThunderPay?: boolean;
}

export interface CreateProductInput extends Omit<Product, 'id' | 'createdAt'> {
  images: string[];
  category: string;
  description: string;
  status: string;
  tags: string[];
}

export const PRODUCT_STATUS = [
  { id: 'NEW', label: '새 상품 (미사용)', desc: '사용하지 않은 새 상품' },
  { id: 'LIKE_NEW', label: '사용감 없음', desc: '사용은 했지만 눈에 띄는 흔적이나 얼룩이 없음' },
  { id: 'USED_GOOD', label: '사용감 적음', desc: '눈에 띄는 흔적이나 얼룩이 약간 있음' },
  { id: 'USED_FAIR', label: '사용감 많음', desc: '눈에 띄는 흔적이나 얼룩이 많이 있음' },
  { id: 'BROKEN', label: '고장/파손 상품', desc: '기능 이상이나 외관 손상 등으로 수리/수선 필요' },
];
