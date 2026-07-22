import axios from 'axios';
import { Product } from '../types';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to headers if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('drapeai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
};

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
