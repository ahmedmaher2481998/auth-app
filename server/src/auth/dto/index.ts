import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { RegisterRequest , LoginRequest, RefreshTokenRequest } from '../../types/index';

export class RegisterDto implements RegisterRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class LoginDto implements LoginRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
export class RefreshTokenDto implements RefreshTokenRequest {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}