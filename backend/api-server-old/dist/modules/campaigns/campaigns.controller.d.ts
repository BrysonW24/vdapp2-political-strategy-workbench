import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CreateStrategyDto } from './dto/create-strategy.dto';
export declare class CampaignsController {
    private readonly campaignsService;
    constructor(campaignsService: CampaignsService);
    create(createCampaignDto: CreateCampaignDto, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateCampaignDto: Partial<CreateCampaignDto>, req: any): Promise<any>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
    createStrategy(id: string, createStrategyDto: CreateStrategyDto, req: any): Promise<any>;
    updateStrategy(strategyId: string, updateStrategyDto: Partial<CreateStrategyDto>, req: any): Promise<any>;
    removeStrategy(strategyId: string, req: any): Promise<{
        message: string;
    }>;
}
