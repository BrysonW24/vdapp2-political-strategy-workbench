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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsAggregationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const news_aggregation_service_1 = require("./news-aggregation.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let NewsAggregationController = class NewsAggregationController {
    constructor(newsAggregationService) {
        this.newsAggregationService = newsAggregationService;
    }
    getAvailableSources() {
        return {
            sources: this.newsAggregationService.getAvailableSources(),
        };
    }
    async fetchNews(category, limit) {
        const newsLimit = limit ? parseInt(limit, 10) : 10;
        const news = await this.newsAggregationService.fetchFromAllSources(category, newsLimit);
        return {
            count: news.length,
            news,
        };
    }
    async fetchFromSource(source, category, limit) {
        const newsLimit = limit ? parseInt(limit, 10) : 10;
        const news = await this.newsAggregationService.fetchFromSource(source, category, newsLimit);
        return {
            source,
            count: news.length,
            news,
        };
    }
    async fetchAndStore(category, limit) {
        const newsLimit = limit ? parseInt(limit, 10) : 10;
        const stored = await this.newsAggregationService.fetchAndStore(category, newsLimit);
        return {
            message: 'News articles fetched and stored successfully',
            stored,
        };
    }
    async triggerScheduledFetch() {
        await this.newsAggregationService.scheduledNewsFetch();
        return {
            message: 'Scheduled news fetch triggered successfully',
        };
    }
};
exports.NewsAggregationController = NewsAggregationController;
__decorate([
    (0, common_1.Get)('sources'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available news sources' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewsAggregationController.prototype, "getAvailableSources", null);
__decorate([
    (0, common_1.Get)('fetch'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch latest news from all sources' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NewsAggregationController.prototype, "fetchNews", null);
__decorate([
    (0, common_1.Get)('fetch/source'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch news from a specific source' }),
    (0, swagger_1.ApiQuery)({ name: 'source', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('source')),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], NewsAggregationController.prototype, "fetchFromSource", null);
__decorate([
    (0, common_1.Post)('fetch-and-store'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch and store news articles to database' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NewsAggregationController.prototype, "fetchAndStore", null);
__decorate([
    (0, common_1.Post)('trigger-fetch'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Manually trigger scheduled news fetch' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NewsAggregationController.prototype, "triggerScheduledFetch", null);
exports.NewsAggregationController = NewsAggregationController = __decorate([
    (0, swagger_1.ApiTags)('News Aggregation'),
    (0, common_1.Controller)('news-aggregation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [news_aggregation_service_1.NewsAggregationService])
], NewsAggregationController);
//# sourceMappingURL=news-aggregation.controller.js.map