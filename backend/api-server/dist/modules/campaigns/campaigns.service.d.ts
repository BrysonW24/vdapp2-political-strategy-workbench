import { PrismaService } from '../../database/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CreateStrategyDto } from './dto/create-strategy.dto';
export declare class CampaignsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateCampaignDto, userId: string): Promise<{
        owner: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        name: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date | null;
        status: import(".prisma/client").$Enums.CampaignStatus;
        ownerId: string;
    }>;
    findAll(userId?: string): Promise<({
        owner: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
        strategies: {
            title: string;
            id: string;
            status: import(".prisma/client").$Enums.StrategyStatus;
            priority: import(".prisma/client").$Enums.Priority;
        }[];
    } & {
        name: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date | null;
        status: import(".prisma/client").$Enums.CampaignStatus;
        ownerId: string;
    })[]>;
    findOne(id: string): Promise<{
        owner: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
        strategies: {
            description: string;
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.StrategyStatus;
            priority: import(".prisma/client").$Enums.Priority;
            metrics: import("@prisma/client/runtime/library").JsonValue | null;
            campaignId: string;
        }[];
    } & {
        name: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date | null;
        status: import(".prisma/client").$Enums.CampaignStatus;
        ownerId: string;
    }>;
    update(id: string, updateDto: Partial<CreateCampaignDto>, userId: string): Promise<{
        name: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date | null;
        status: import(".prisma/client").$Enums.CampaignStatus;
        ownerId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    createStrategy(campaignId: string, createDto: CreateStrategyDto, userId: string): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StrategyStatus;
        priority: import(".prisma/client").$Enums.Priority;
        metrics: import("@prisma/client/runtime/library").JsonValue | null;
        campaignId: string;
    }>;
    updateStrategy(strategyId: string, updateDto: Partial<CreateStrategyDto>, userId: string): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StrategyStatus;
        priority: import(".prisma/client").$Enums.Priority;
        metrics: import("@prisma/client/runtime/library").JsonValue | null;
        campaignId: string;
    }>;
    removeStrategy(strategyId: string, userId: string): Promise<{
        message: string;
    }>;
}
