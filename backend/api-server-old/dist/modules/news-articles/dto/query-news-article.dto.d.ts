import { ArticleCategory } from './create-news-article.dto';
export declare class QueryNewsArticleDto {
    category?: ArticleCategory;
    search?: string;
    page: number;
    limit: number;
}
