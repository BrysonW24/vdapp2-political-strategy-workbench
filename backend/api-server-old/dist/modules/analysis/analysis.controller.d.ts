import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
export declare class AnalysisController {
    private readonly analysisService;
    constructor(analysisService: AnalysisService);
    create(createAnalysisDto: CreateAnalysisDto, req: any): Promise<any>;
    findByArticle(articleId: string): Promise<any>;
    findOne(id: string): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
