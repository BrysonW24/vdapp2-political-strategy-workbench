import { HttpService } from '@nestjs/axios';
import { INewsProvider, NewsItem, FetchNewsOptions } from '../interfaces/news-provider.interface';
export declare class GuardianAustraliaProvider implements INewsProvider {
    private readonly httpService;
    private readonly logger;
    private readonly API_BASE_URL;
    private readonly apiKey;
    constructor(httpService: HttpService);
    getName(): string;
    fetchNews(options?: FetchNewsOptions): Promise<NewsItem[]>;
    private mapCategoryToSection;
    private mapSectionToCategory;
}
