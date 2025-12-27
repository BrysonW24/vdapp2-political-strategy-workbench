"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NewsAggregationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsAggregationService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../database/prisma.service");
const abc_news_provider_1 = require("./providers/abc-news.provider");
const guardian_au_provider_1 = require("./providers/guardian-au.provider");
const news_com_au_provider_1 = require("./providers/news-com-au.provider");
let NewsAggregationService = NewsAggregationService_1 = class NewsAggregationService {
    constructor(prisma, abcNewsProvider, guardianProvider, newsComAuProvider) {
        this.prisma = prisma;
        this.abcNewsProvider = abcNewsProvider;
        this.guardianProvider = guardianProvider;
        this.newsComAuProvider = newsComAuProvider;
        this.logger = new common_1.Logger(NewsAggregationService_1.name);
        this.providers = [
            this.abcNewsProvider,
            this.guardianProvider,
            this.newsComAuProvider,
        ];
    }
    async fetchFromAllSources(category, limit = 10) {
        const allNews = [];
        for (const provider of this.providers) {
            try {
                this.logger.log('Fetching from provider');
                const news = await provider.fetchNews({ category, limit });
                allNews.push(...news);
            }
            catch (error) {
                this.logger.error('Failed to fetch from provider');
            }
        }
        return allNews;
    }
    async fetchAndStore(category, limit = 10) {
        this.logger.log('Fetching and storing news articles');
        const newsItems = await this.fetchFromAllSources(category, limit);
        let stored = 0;
        for (const item of newsItems) {
            try {
                const existing = await this.prisma.newsArticle.findFirst({
                    where: {
                        OR: [
                            { sourceUrl: item.sourceUrl },
                            {
                                title: item.title,
                                source: item.source,
                            },
                        ],
                    },
                });
                if (existing) {
                    continue;
                }
                const categoryEnum = this.mapCategoryToEnum(item.category);
                await this.prisma.newsArticle.create({
                    data: {
                        title: item.title,
                        content: item.content,
                        source: item.source,
                        sourceUrl: item.sourceUrl,
                        publishedAt: item.publishedAt,
                        category: categoryEnum,
                    },
                });
                stored++;
            }
            catch (error) {
                this.logger.error('Error storing article');
            }
        }
        this.logger.log('Completed storing articles');
        return stored;
    }
    async scheduledNewsFetch() {
        this.logger.log('Starting scheduled news fetch');
        try {
            const categories = ['politics', 'business', 'technology'];
            for (const category of categories) {
                await this.fetchAndStore(category, 5);
            }
            this.logger.log('Scheduled news fetch completed');
        }
        catch (error) {
            this.logger.error('Scheduled news fetch failed');
        }
    }
    async fetchFromSource(source, category, limit = 10) {
        const provider = this.providers.find((p) => p.getName().toLowerCase().includes(source.toLowerCase()));
        if (!provider) {
            throw new Error('News provider not found');
        }
        return provider.fetchNews({ category, limit });
    }
    getAvailableSources() {
        return this.providers.map((p) => p.getName());
    }
    mapCategoryToEnum(category) {
        const mapping = {
            POLITICS: 'POLITICS',
            BUSINESS: 'BUSINESS',
            TECHNOLOGY: 'TECHNOLOGY',
            SOCIAL: 'SOCIAL',
            ENVIRONMENT: 'ENVIRONMENT',
            INTERNATIONAL: 'INTERNATIONAL',
        };
        return mapping[category.toUpperCase()] || 'OTHER';
    }
};
exports.NewsAggregationService = NewsAggregationService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NewsAggregationService.prototype, "scheduledNewsFetch", null);
exports.NewsAggregationService = NewsAggregationService = NewsAggregationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        abc_news_provider_1.ABCNewsProvider,
        guardian_au_provider_1.GuardianAustraliaProvider,
        news_com_au_provider_1.NewsComAuProvider])
], NewsAggregationService);
//# sourceMappingURL=news-aggregation.service.js.map