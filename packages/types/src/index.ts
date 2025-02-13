// User types
export interface User {
  id: string;
  name: string;
  email: string;
}


// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}
// Tokens 
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
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
  user: Omit<User, 'password'>;
}

export interface LogoutRequest {
  refreshToken: string;
}
// Register response 
export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
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

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
} 