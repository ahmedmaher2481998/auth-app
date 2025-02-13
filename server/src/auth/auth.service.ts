import { User } from '../users/User.Schema';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { AuthResponse, LoginRequest, RegisterRequest, RegisterResponse, Tokens } from '../types';
import { UserDocument, IUserMethods } from '../users/User.Schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService
  ) { }

  async signUp(dto: RegisterRequest): Promise<RegisterResponse> {
    const userData = {
      email: dto.email,
      password: dto.password, // Will be hashed by schema pre-save hook
      name: dto.name,
    };

    const newUser = await this.userModel.create(userData);
    const tokens = await this.generateTokens(newUser);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);

    const userResult = await this.userModel.findById(newUser.id).select('-password -hashedRT');
    return { ...tokens, user: userResult };
  }

  async signIn(dto: LoginRequest): Promise<AuthResponse> {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.validatePassword(dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const userResult = await this.userModel.findById(user.id).select('-password -hashedRT');
    // @ts-ignore
    return { ...tokens, user: userResult.toObject() as User };
  }

  async logout(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      hashedRT: null
    });
  }

  async refreshTokens(rt: string): Promise<Tokens> {
    let user: UserDocument;
    try{
      user = await this.getUserByRT(rt);
    }catch(error){
      console.log('error', error);
      throw new UnauthorizedException('Access Denied cannot get user by RT');
    }
    console.log('user', user);
    if (!user || !user.hashedRT) {
      throw new UnauthorizedException('Access Denied not found or RT expired');
    }

    if (rt !== user.hashedRT) {
      throw new UnauthorizedException('Access Denied or RT expired');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  private async generateTokens(user: UserDocument): Promise<Tokens> {
    const payload = { sub: user.id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET_AT'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION_AT') ?? '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET_RT'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION_RT') ?? '7d',
      }),
    ]);
    // get at expiry time from accessToken
    const atExpiry = new Date(Date.now() + parseInt(this.configService.get<string>('JWT_EXPIRATION_AT') ?? '15m'));
    return {
      accessToken,
      refreshToken,
      atExpiry,
    };
  }

  private async updateRefreshToken(userId: string, rt: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      hashedRT: rt,
    });
  }

  // get User By RT 
  async getUserByRT(rt: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ hashedRT: rt });
    console.log('user', user);
    if (!user || !user.hashedRT) {
      throw new UnauthorizedException('Access Denied');
    }
    return user;
  }
}
