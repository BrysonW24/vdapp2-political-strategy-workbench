import { INewsProvider, NewsItem, FetchNewsOptions } from '../interfaces/news-provider.interface';
export declare class NewsComAuProvider implements INewsProvider {
    private readonly logger;
    private readonly parser;
    private readonly RSS_FEEDS;
    constructor();
    getName(): string;
    fetchNews(options?: FetchNewsOptions): Promise<NewsItem[]>;
    private extractContent;
    private extractImageUrl;
}
