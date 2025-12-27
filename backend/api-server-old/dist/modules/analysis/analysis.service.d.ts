import { PrismaService } from '../../database/prisma.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
export declare class AnalysisService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateAnalysisDto, userId?: string): Promise<any>;
    findByArticle(articleId: string): Promise<any>;
    findOne(id: string): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
