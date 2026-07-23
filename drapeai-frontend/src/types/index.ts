export interface Product {
  id: string;
  brand?: string;
  name: string;
  slug?: string;
  description: string;
  category: 'apparel' | 'footwear';
  price: number;
  imageUrl: string;
  fit?: string;
  materials?: string;
  careInstructions?: string;
  highlights?: string[];
}

export interface TryOnRequest {
  productId: string;
  userImage: string;
  category: string;
}

export interface TryOnResponse {
  id: string;
  productId: string;
  productName: string;
  category: string;
  userImageUrl: string;
  resultImageUrl: string;
  status: string;
  message?: string;
  createdAt?: string;
}
