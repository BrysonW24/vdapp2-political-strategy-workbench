import { PrismaService } from '../../database/prisma.service';
import { ABCNewsProvider } from './providers/abc-news.provider';
import { GuardianAustraliaProvider } from './providers/guardian-au.provider';
import { NewsComAuProvider } from './providers/news-com-au.provider';
import { NewsItem } from './interfaces/news-provider.interface';
export declare class NewsAggregationService {
    private readonly prisma;
    private readonly abcNewsProvider;
    private readonly guardianProvider;
    private readonly newsComAuProvider;
    private readonly logger;
    private readonly providers;
    constructor(prisma: PrismaService, abcNewsProvider: ABCNewsProvider, guardianProvider: GuardianAustraliaProvider, newsComAuProvider: NewsComAuProvider);
    fetchFromAllSources(category?: string, limit?: number): Promise<NewsItem[]>;
    fetchAndStore(category?: string, limit?: number): Promise<number>;
    scheduledNewsFetch(): Promise<void>;
    fetchFromSource(source: string, category?: string, limit?: number): Promise<NewsItem[]>;
    getAvailableSources(): string[];
    private mapCategoryToEnum;
}
