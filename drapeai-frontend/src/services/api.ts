import axios, { AxiosError } from 'axios';
import { Product, TryOnRequest, TryOnResponse } from '../types';
import { AuthResponse, LoginRequest, RegisterRequest, UpdateAccountRequest, UserInfo } from '../types/auth';
import { CreateOrderRequestPayload, OrderResponsePayload } from '../types/order';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry interceptor - retries failed requests up to 3 times
const retryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
};

// Interceptor to attach JWT token to headers if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('drapeai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Initialize retry count
  if (!config.headers['X-Retry-Count']) {
    config.headers['X-Retry-Count'] = '0';
  }
  return config;
});

// Response interceptor with retry logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as any;
    if (!config) return Promise.reject(error);

    const retryCount = parseInt(config.headers['X-Retry-Count'] || '0');

    // Check if we should retry
    const shouldRetry =
      retryCount < retryConfig.maxRetries &&
      (retryableStatusCodes.includes(error.response?.status || 0) ||
        !error.response); // Retry on network errors too

    if (shouldRetry) {
      config.headers['X-Retry-Count'] = (retryCount + 1).toString();
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = retryConfig.retryDelay * Math.pow(2, retryCount);
      await new Promise((resolve) => setTimeout(resolve, delay));
      
      return apiClient(config);
    }

    return Promise.reject(error);
  }
);

const retryableStatusCodes = retryConfig.retryableStatusCodes;

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

export const accountApi = {
  getMe: async (): Promise<UserInfo> => {
    const response = await apiClient.get<UserInfo>('/account/me');
    return response.data;
  },
  updateMe: async (data: UpdateAccountRequest): Promise<UserInfo> => {
    const response = await apiClient.put<UserInfo>('/account/me', data);
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
  createProduct: async (product: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', product);
    return response.data;
  },
  updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, product);
    return response.data;
  },
  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};

export const tryOnApi = {
  processTryOn: async (data: TryOnRequest): Promise<TryOnResponse> => {
    const response = await apiClient.post<TryOnResponse>('/try-on/process', data);
    return response.data;
  },
  getHistory: async (): Promise<TryOnResponse[]> => {
    const response = await apiClient.get<TryOnResponse[]>('/try-on/history');
    return response.data;
  },
};

export const orderApi = {
  createOrder: async (data: CreateOrderRequestPayload): Promise<OrderResponsePayload> => {
    const response = await apiClient.post<OrderResponsePayload>('/orders', data);
    return response.data;
  },
  getOrders: async (): Promise<OrderResponsePayload[]> => {
    const response = await apiClient.get<OrderResponsePayload[]>('/orders');
    return response.data;
  },
  getAllOrdersAdmin: async (): Promise<OrderResponsePayload[]> => {
    const response = await apiClient.get<OrderResponsePayload[]>('/orders/admin/all');
    return response.data;
  },
  updateOrderStatus: async (orderId: string, status: string): Promise<OrderResponsePayload> => {
    const response = await apiClient.put<OrderResponsePayload>(`/orders/${orderId}/status?status=${status}`);
    return response.data;
  },
};
