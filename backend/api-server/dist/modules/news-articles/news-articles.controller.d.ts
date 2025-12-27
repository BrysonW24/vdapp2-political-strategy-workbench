import { NewsArticlesService } from './news-articles.service';
import { CreateNewsArticleDto } from './dto/create-news-article.dto';
import { UpdateNewsArticleDto } from './dto/update-news-article.dto';
import { QueryNewsArticleDto } from './dto/query-news-article.dto';
export declare class NewsArticlesController {
    private readonly newsArticlesService;
    constructor(newsArticlesService: NewsArticlesService);
    create(createNewsArticleDto: CreateNewsArticleDto): Promise<{
        tags: ({
            tag: {
                name: string;
                id: string;
                createdAt: Date;
            };
        } & {
            createdAt: Date;
            tagId: string;
            articleId: string;
        })[];
    } & {
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
    }>;
    findAll(query: QueryNewsArticleDto): Promise<{
        data: ({
            analyses: {
                id: string;
                sentiment: import(".prisma/client").$Enums.Sentiment;
                analysisType: import(".prisma/client").$Enums.AnalysisType;
            }[];
            tags: ({
                tag: {
                    name: string;
                    id: string;
                    createdAt: Date;
                };
            } & {
                createdAt: Date;
                tagId: string;
                articleId: string;
            })[];
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        analyses: {
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
        }[];
        tags: ({
            tag: {
                name: string;
                id: string;
                createdAt: Date;
            };
        } & {
            createdAt: Date;
            tagId: string;
            articleId: string;
        })[];
    } & {
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
    }>;
    update(id: string, updateNewsArticleDto: UpdateNewsArticleDto): Promise<{
        tags: ({
            tag: {
                name: string;
                id: string;
                createdAt: Date;
            };
        } & {
            createdAt: Date;
            tagId: string;
            articleId: string;
        })[];
    } & {
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
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
