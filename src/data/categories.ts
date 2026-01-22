import type { Category } from '../types/Category';

export const CATEGORIES: Category[] = [
  {
    id: '1',
    name: '여성의류',
    subCategories: [
      {
        id: '1-1',
        name: '아우터',
        subCategories: [
          { id: '1-1-1', name: '패딩' },
          { id: '1-1-2', name: '점퍼' },
          { id: '1-1-3', name: '코트' },
          { id: '1-1-4', name: '자켓' },
        ],
      },
      { id: '1-2', name: '상의', subCategories: [] },
      { id: '1-3', name: '바지', subCategories: [] },
    ],
  },
  { id: '2', name: '남성의류', subCategories: [] },
  { id: '3', name: '신발', subCategories: [] },
];
