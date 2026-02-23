export interface Product {
  id: number;
  sellerId: string;
  title: string; //제목
  price: number; //가격
  location: string; //지역
  createdAt: string; //만든시간
  image: string; //이미지
  isThunderPay?: boolean; //썬더페이
  // --- 상세 정보창을 위한 추가 필드 ---
  views: number; // 조회수
  wishCount: number; // 찜 수
  description: string; // 상품 설명
  category: string; // 카테고리
  status: string; // 상품 상태 코드
  tags: string[]; // 태그 리스트
}

export interface CreateProductInput extends Omit<
  Product,
  'id' | 'createdAt' | 'views' | 'wishCount'
> {
  images: string[];
}

export const PRODUCT_STATUS = [
  { id: 'NEW', label: '새 상품 (미사용)', desc: '사용하지 않은 새 상품' },
  { id: 'LIKE_NEW', label: '사용감 없음', desc: '사용은 했지만 눈에 띄는 흔적이나 얼룩이 없음' },
  { id: 'USED_GOOD', label: '사용감 적음', desc: '눈에 띄는 흔적이나 얼룩이 약간 있음' },
  { id: 'USED_FAIR', label: '사용감 많음', desc: '눈에 띄는 흔적이나 얼룩이 많이 있음' },
  { id: 'BROKEN', label: '고장/파손 상품', desc: '기능 이상이나 외관 손상 등으로 수리/수선 필요' },
] as const;
