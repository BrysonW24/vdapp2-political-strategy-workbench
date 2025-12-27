import { PrismaService } from '../../database/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CreateStrategyDto } from './dto/create-strategy.dto';
export declare class CampaignsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateCampaignDto, userId: string): Promise<any>;
    findAll(userId?: string): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateDto: Partial<CreateCampaignDto>, userId: string): Promise<any>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    createStrategy(campaignId: string, createDto: CreateStrategyDto, userId: string): Promise<any>;
    updateStrategy(strategyId: string, updateDto: Partial<CreateStrategyDto>, userId: string): Promise<any>;
    removeStrategy(strategyId: string, userId: string): Promise<{
        message: string;
    }>;
}
