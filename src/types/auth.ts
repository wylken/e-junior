export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  photo?: string;
  role: 'ADMIN' | 'CLIENT';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  name: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'CLIENT';
  iat: number;
  exp: number;
}