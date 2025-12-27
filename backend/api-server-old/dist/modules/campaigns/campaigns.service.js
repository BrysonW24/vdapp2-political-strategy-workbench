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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let CampaignsService = class CampaignsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto, userId) {
        const campaign = await this.prisma.campaign.create({
            data: {
                ...createDto,
                startDate: new Date(createDto.startDate),
                endDate: createDto.endDate ? new Date(createDto.endDate) : null,
                ownerId: userId,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        return campaign;
    }
    async findAll(userId) {
        const campaigns = await this.prisma.campaign.findMany({
            where: userId ? { ownerId: userId } : undefined,
            orderBy: { createdAt: 'desc' },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                strategies: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        priority: true,
                    },
                },
            },
        });
        return campaigns;
    }
    async findOne(id) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { id },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                strategies: true,
            },
        });
        if (!campaign) {
            throw new common_1.NotFoundException(`Campaign with ID ${id} not found`);
        }
        return campaign;
    }
    async update(id, updateDto, userId) {
        const campaign = await this.findOne(id);
        if (campaign.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own campaigns');
        }
        return this.prisma.campaign.update({
            where: { id },
            data: {
                ...updateDto,
                ...(updateDto.startDate && { startDate: new Date(updateDto.startDate) }),
                ...(updateDto.endDate && { endDate: new Date(updateDto.endDate) }),
            },
        });
    }
    async remove(id, userId) {
        const campaign = await this.findOne(id);
        if (campaign.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own campaigns');
        }
        await this.prisma.campaign.delete({ where: { id } });
        return { message: 'Campaign deleted successfully' };
    }
    async createStrategy(campaignId, createDto, userId) {
        const campaign = await this.findOne(campaignId);
        if (campaign.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only add strategies to your own campaigns');
        }
        const strategy = await this.prisma.strategy.create({
            data: {
                ...createDto,
                campaignId,
            },
        });
        return strategy;
    }
    async updateStrategy(strategyId, updateDto, userId) {
        const strategy = await this.prisma.strategy.findUnique({
            where: { id: strategyId },
            include: { campaign: true },
        });
        if (!strategy) {
            throw new common_1.NotFoundException(`Strategy with ID ${strategyId} not found`);
        }
        if (strategy.campaign.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only update strategies in your own campaigns');
        }
        return this.prisma.strategy.update({
            where: { id: strategyId },
            data: updateDto,
        });
    }
    async removeStrategy(strategyId, userId) {
        const strategy = await this.prisma.strategy.findUnique({
            where: { id: strategyId },
            include: { campaign: true },
        });
        if (!strategy) {
            throw new common_1.NotFoundException(`Strategy with ID ${strategyId} not found`);
        }
        if (strategy.campaign.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only delete strategies from your own campaigns');
        }
        await this.prisma.strategy.delete({ where: { id: strategyId } });
        return { message: 'Strategy deleted successfully' };
    }
};
exports.CampaignsService = CampaignsService;
exports.CampaignsService = CampaignsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CampaignsService);
//# sourceMappingURL=campaigns.service.js.map