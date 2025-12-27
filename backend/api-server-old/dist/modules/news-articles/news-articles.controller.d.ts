import { NewsArticlesService } from './news-articles.service';
import { CreateNewsArticleDto } from './dto/create-news-article.dto';
import { UpdateNewsArticleDto } from './dto/update-news-article.dto';
import { QueryNewsArticleDto } from './dto/query-news-article.dto';
export declare class NewsArticlesController {
    private readonly newsArticlesService;
    constructor(newsArticlesService: NewsArticlesService);
    create(createNewsArticleDto: CreateNewsArticleDto): Promise<any>;
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
    update(id: string, updateNewsArticleDto: UpdateNewsArticleDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
