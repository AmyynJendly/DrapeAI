export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'apparel' | 'footwear';
  price: number;
  imageUrl: string;
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
