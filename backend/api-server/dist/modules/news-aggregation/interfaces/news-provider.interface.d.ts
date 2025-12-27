export interface NewsItem {
    title: string;
    content: string;
    source: string;
    sourceUrl: string;
    publishedAt: Date;
    category: string;
    author?: string;
    imageUrl?: string;
}
export interface INewsProvider {
    getName(): string;
    fetchNews(options?: FetchNewsOptions): Promise<NewsItem[]>;
}
export interface FetchNewsOptions {
    category?: string;
    limit?: number;
    fromDate?: Date;
}
