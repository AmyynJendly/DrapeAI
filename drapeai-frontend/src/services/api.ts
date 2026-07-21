import axios from 'axios';
import { Product } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  getProducts: async (category?: string): Promise<Product[]> => {
    const params = category ? { category } : {};
    const response = await apiClient.get<Product[]>('/products', { params });
    return response.data;
  },
  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },
};
