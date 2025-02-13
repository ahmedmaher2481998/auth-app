import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  ApiResponse,
} from '../types';
import { Public } from './decorators/public.decorator';
import { Tokens } from '@/types';
import { getCurrentUserId } from './decorators/get-current-userId';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<ApiResponse<void>> {
    await this.authService.signUp(registerDto);
    return {
      success: true,
      message: 'Registration successful',
      data: undefined,
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse<AuthResponse>> {
    const result = await this.authService.signIn(loginDto);
    return {
      success: true,
      data: result,
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<ApiResponse<Tokens>> {
    console.log('refreshTokenDto', refreshTokenDto);
    const result = await this.authService.refreshTokens(refreshTokenDto.refreshToken);
    return {
      success: true,
      data: result,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@getCurrentUserId() userId: string): Promise<ApiResponse<void>> {
    await this.authService.logout(userId);
    return {
      success: true,
      message: 'Logged out successfully',
      data: undefined,
    };
  }
}
