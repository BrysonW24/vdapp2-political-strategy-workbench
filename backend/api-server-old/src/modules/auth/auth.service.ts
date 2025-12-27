import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../database/prisma.service'
import { RegisterDto, AuthResponseDto } from './dto'
import { UserEntity } from '../users/entities/user.entity'
import { v4 as uuidv4 } from 'uuid'

// Simplified - removed UsersService and bcrypt dependencies
// Using static authentication only

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Registration disabled - using static authentication only
    // Return static user instead
    const staticUsername = this.configService.get<string>('STATIC_USERNAME') || 'admin'

    const user = {
      id: 'static-user-001',
      email: staticUsername,
      firstName: registerDto.firstName || 'Admin',
      lastName: registerDto.lastName || 'User',
      role: 'ADMIN',
      isActive: true,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(user)

    return {
      accessToken,
      refreshToken,
      user,
    }
  }

  async login(user: UserEntity): Promise<AuthResponseDto> {
    const { accessToken, refreshToken } = await this.generateTokens(user)

    return {
      accessToken,
      refreshToken,
      user,
    }
  }

  async validateUser(email: string, password: string): Promise<UserEntity | null> {
    // Simple static username/password check
    const staticUsername = this.configService.get<string>('STATIC_USERNAME') || 'admin'
    const staticPassword = this.configService.get<string>('STATIC_PASSWORD') || 'password123'

    // Check if credentials match static values
    if (email === staticUsername && password === staticPassword) {
      // Return a mock user for the static login
      // This user doesn't need to exist in the database
      return {
        id: 'static-user-001',
        email: staticUsername,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        isActive: true,
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any
    }

    // Invalid credentials
    return null
  }

  async refreshToken(token: string): Promise<AuthResponseDto> {
    // Try to find refresh token in database
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    })

    // If not found in database, assume it's a static user token
    // Just generate new tokens for the static user
    if (!refreshToken) {
      const staticUsername = this.configService.get<string>('STATIC_USERNAME') || 'admin'

      // Return new tokens for static user
      const staticUser = {
        id: 'static-user-001',
        email: staticUsername,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        isActive: true,
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any

      const tokens = await this.generateTokens(staticUser)

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: staticUser,
      }
    }

    // Check if token is expired
    if (new Date() > refreshToken.expiresAt) {
      // Delete expired token
      await this.prisma.refreshToken.delete({
        where: { id: refreshToken.id },
      })
      throw new UnauthorizedException('Refresh token expired')
    }

    // Check if user is still active
    if (!refreshToken.user.isActive) {
      throw new UnauthorizedException('User is inactive')
    }

    // Delete old refresh token
    await this.prisma.refreshToken.delete({
      where: { id: refreshToken.id },
    })

    // Generate new tokens
    const user = new UserEntity(refreshToken.user)
    const tokens = await this.generateTokens(user)

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
    }
  }

  async logout(token: string): Promise<void> {
    // Delete refresh token from database
    await this.prisma.refreshToken.deleteMany({
      where: { token },
    })
  }

  private async generateTokens(user: UserEntity): Promise<{
    accessToken: string
    refreshToken: string
  }> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }

    // Generate access token
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
    })

    // Generate refresh token
    const refreshToken = uuidv4()
    const refreshTokenExpiresIn =
      this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '7d'

    // Calculate expiration date
    const expiresAt = new Date()
    const days = parseInt(refreshTokenExpiresIn.replace('d', ''))
    expiresAt.setDate(expiresAt.getDate() + days)

    // Only save to database if it's not the static user
    if (user.id !== 'static-user-001') {
      await this.prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt,
        },
      })
    }
    // For static user, we still generate the token but don't store it
    // JWT validation will work without database storage

    return {
      accessToken,
      refreshToken,
    }
  }
}
