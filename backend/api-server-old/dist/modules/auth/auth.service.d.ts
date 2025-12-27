import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto, AuthResponseDto } from './dto';
import { UserEntity } from '../users/entities/user.entity';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(user: UserEntity): Promise<AuthResponseDto>;
    validateUser(email: string, password: string): Promise<UserEntity | null>;
    refreshToken(token: string): Promise<AuthResponseDto>;
    logout(token: string): Promise<void>;
    private generateTokens;
}
