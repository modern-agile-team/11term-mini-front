// src/types/Category.ts
export interface Category {
  id: string;
  name: string;
  subCategories?: Category[];
}
