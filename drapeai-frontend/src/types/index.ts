export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'apparel' | 'footwear';
  price: number;
  imageUrl: string;
}
