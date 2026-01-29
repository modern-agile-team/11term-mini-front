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
