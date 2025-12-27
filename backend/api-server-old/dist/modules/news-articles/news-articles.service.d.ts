import { PrismaService } from '../../database/prisma.service';
import { CreateNewsArticleDto } from './dto/create-news-article.dto';
import { UpdateNewsArticleDto } from './dto/update-news-article.dto';
import { QueryNewsArticleDto } from './dto/query-news-article.dto';
export declare class NewsArticlesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateNewsArticleDto): Promise<any>;
    findAll(query: QueryNewsArticleDto): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, updateDto: UpdateNewsArticleDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
