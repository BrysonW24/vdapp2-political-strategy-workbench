import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CreateStrategyDto } from './dto/create-strategy.dto';
export declare class CampaignsController {
    private readonly campaignsService;
    constructor(campaignsService: CampaignsService);
    create(createCampaignDto: CreateCampaignDto, req: any): Promise<{
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
    findAll(req: any): Promise<({
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
    update(id: string, updateCampaignDto: Partial<CreateCampaignDto>, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
    createStrategy(id: string, createStrategyDto: CreateStrategyDto, req: any): Promise<{
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
    updateStrategy(strategyId: string, updateStrategyDto: Partial<CreateStrategyDto>, req: any): Promise<{
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
    removeStrategy(strategyId: string, req: any): Promise<{
        message: string;
    }>;
}
