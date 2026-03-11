export interface AdItem {
  id: number;
  image: string;
  title: string;
  subTitle: string;
  bgColor: string;
}

export const MOCK_AD: AdItem[] = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1024&q=80',
    title: '나 혼자만 알고 싶은',
    subTitle: '6만원 쿠폰팩 받기',
    bgColor: 'bg-[#99d9f3]',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1024&q=80',
    title: '트렌디한 겨울 코디',
    subTitle: '인기 브랜드 아우터 특가',
    bgColor: 'bg-[#54b454]',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1024&q=80',
    title: '스마트한 중고거래',
    subTitle: '번개케어로 정품 검수까지',
    bgColor: 'bg-[#ff5058]',
  },
  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1024&q=80',
    title: '내 폰 팔 때도 역시',
    subTitle: '중고폰 시세 바로 확인하기',
    bgColor: 'bg-[#6a5acd]',
  },
  {
    id: 5,
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1024&q=80',
    title: '이사/집들이 필수템',
    subTitle: '가전 가구 최대 80% 할인',
    bgColor: 'bg-[#ffa500]',
  },
  {
    id: 6,
    image:
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1024&q=80',
    title: '추억의 소장품 찾기',
    subTitle: '레어템 가득! 키덜트 기획전',
    bgColor: 'bg-[#4682b4]',
  },
];
