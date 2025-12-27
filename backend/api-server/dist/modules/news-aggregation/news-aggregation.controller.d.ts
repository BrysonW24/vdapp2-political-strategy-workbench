import { NewsAggregationService } from './news-aggregation.service';
export declare class NewsAggregationController {
    private readonly newsAggregationService;
    constructor(newsAggregationService: NewsAggregationService);
    getAvailableSources(): {
        sources: string[];
    };
    fetchNews(category?: string, limit?: string): Promise<{
        count: number;
        news: import("./interfaces/news-provider.interface").NewsItem[];
    }>;
    fetchFromSource(source: string, category?: string, limit?: string): Promise<{
        source: string;
        count: number;
        news: import("./interfaces/news-provider.interface").NewsItem[];
    }>;
    fetchAndStore(category?: string, limit?: string): Promise<{
        message: string;
        stored: number;
    }>;
    triggerScheduledFetch(): Promise<{
        message: string;
    }>;
}
