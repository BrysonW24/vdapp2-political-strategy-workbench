export declare enum ArticleCategory {
    POLITICS = "POLITICS",
    BUSINESS = "BUSINESS",
    TECHNOLOGY = "TECHNOLOGY",
    SOCIAL = "SOCIAL",
    ENVIRONMENT = "ENVIRONMENT",
    INTERNATIONAL = "INTERNATIONAL",
    OTHER = "OTHER"
}
export declare class CreateNewsArticleDto {
    title: string;
    content: string;
    source: string;
    sourceUrl?: string;
    publishedAt: string;
    category: ArticleCategory;
    tags?: string[];
}
