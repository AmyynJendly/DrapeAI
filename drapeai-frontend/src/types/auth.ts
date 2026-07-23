export interface UserInfo {
  name: string;
  email: string;
  phone?: string;
  preferredSize?: string;
  stylePreference?: string;
  newsletterOptIn?: boolean;
  role?: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateAccountRequest {
  name?: string;
  phone?: string;
  preferredSize?: string;
  stylePreference?: string;
  newsletterOptIn?: boolean;
}
