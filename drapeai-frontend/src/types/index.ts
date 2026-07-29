export interface Product {
  id: string;
  brand?: string;
  name: string;
  slug?: string;
  description: string;
  category: 'apparel' | 'footwear';
  price: number;
  imageUrl: string;
  images?: string[];
  fit?: string;
  materials?: string;
  careInstructions?: string;
  highlights?: string[];
}
