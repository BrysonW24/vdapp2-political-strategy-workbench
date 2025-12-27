"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../database/prisma.service");
const user_entity_1 = require("../users/entities/user.entity");
const uuid_1 = require("uuid");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(registerDto) {
        const staticUsername = this.configService.get('STATIC_USERNAME') || 'admin';
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
        };
        const { accessToken, refreshToken } = await this.generateTokens(user);
        return {
            accessToken,
            refreshToken,
            user,
        };
    }
    async login(user) {
        const { accessToken, refreshToken } = await this.generateTokens(user);
        return {
            accessToken,
            refreshToken,
            user,
        };
    }
    async validateUser(email, password) {
        const staticUsername = this.configService.get('STATIC_USERNAME') || 'admin';
        const staticPassword = this.configService.get('STATIC_PASSWORD') || 'password123';
        if (email === staticUsername && password === staticPassword) {
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
            };
        }
        return null;
    }
    async refreshToken(token) {
        const refreshToken = await this.prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true },
        });
        if (!refreshToken) {
            const staticUsername = this.configService.get('STATIC_USERNAME') || 'admin';
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
            };
            const tokens = await this.generateTokens(staticUser);
            return {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: staticUser,
            };
        }
        if (new Date() > refreshToken.expiresAt) {
            await this.prisma.refreshToken.delete({
                where: { id: refreshToken.id },
            });
            throw new common_1.UnauthorizedException('Refresh token expired');
        }
        if (!refreshToken.user.isActive) {
            throw new common_1.UnauthorizedException('User is inactive');
        }
        await this.prisma.refreshToken.delete({
            where: { id: refreshToken.id },
        });
        const user = new user_entity_1.UserEntity(refreshToken.user);
        const tokens = await this.generateTokens(user);
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user,
        };
    }
    async logout(token) {
        await this.prisma.refreshToken.deleteMany({
            where: { token },
        });
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get('JWT_EXPIRES_IN') || '15m',
        });
        const refreshToken = (0, uuid_1.v4)();
        const refreshTokenExpiresIn = this.configService.get('REFRESH_TOKEN_EXPIRES_IN') || '7d';
        const expiresAt = new Date();
        const days = parseInt(refreshTokenExpiresIn.replace('d', ''));
        expiresAt.setDate(expiresAt.getDate() + days);
        if (user.id !== 'static-user-001') {
            await this.prisma.refreshToken.create({
                data: {
                    token: refreshToken,
                    userId: user.id,
                    expiresAt,
                },
            });
        }
        return {
            accessToken,
            refreshToken,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map