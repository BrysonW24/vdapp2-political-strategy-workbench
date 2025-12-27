import { PrismaService } from '../../database/prisma.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
export declare class AnalysisService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateAnalysisDto, userId?: string): Promise<{
        article: {
            title: string;
            id: string;
            source: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        summary: string;
        sentiment: import(".prisma/client").$Enums.Sentiment;
        articleId: string;
        analysisType: import(".prisma/client").$Enums.AnalysisType;
        keyPoints: string[];
        confidence: number;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdBy: string | null;
    }>;
    findByArticle(articleId: string): Promise<({
        user: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        summary: string;
        sentiment: import(".prisma/client").$Enums.Sentiment;
        articleId: string;
        analysisType: import(".prisma/client").$Enums.AnalysisType;
        keyPoints: string[];
        confidence: number;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdBy: string | null;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
        article: {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            source: string;
            sourceUrl: string | null;
            publishedAt: Date;
            category: import(".prisma/client").$Enums.ArticleCategory;
            sentiment: import(".prisma/client").$Enums.Sentiment | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        summary: string;
        sentiment: import(".prisma/client").$Enums.Sentiment;
        articleId: string;
        analysisType: import(".prisma/client").$Enums.AnalysisType;
        keyPoints: string[];
        confidence: number;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdBy: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
