// User types
export interface User {
  id: string;
  email: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface Tokens {
  accessToken: string;
  atExpiry: Date;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  atExpiry: Date;
  refreshToken: string;
  user: User;
}

export interface LogoutRequest {
  refreshToken: string;
}

// API Response types
export interface ApiResponse<T = void> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  statusCode: number;
} 