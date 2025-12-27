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
var GuardianAustraliaProvider_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardianAustraliaProvider = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let GuardianAustraliaProvider = GuardianAustraliaProvider_1 = class GuardianAustraliaProvider {
    constructor(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(GuardianAustraliaProvider_1.name);
        this.API_BASE_URL = 'https://content.guardianapis.com';
        this.apiKey = process.env.GUARDIAN_API_KEY || '';
        if (!this.apiKey) {
            this.logger.warn('Guardian API key not set. Please set GUARDIAN_API_KEY environment variable.');
        }
    }
    getName() {
        return 'The Guardian Australia';
    }
    async fetchNews(options) {
        try {
            if (!this.apiKey) {
                throw new Error('Guardian API key is required');
            }
            const limit = options?.limit || 20;
            const section = this.mapCategoryToSection(options?.category);
            this.logger.log(`Fetching news from The Guardian Australia - ${section}`);
            const params = {
                'api-key': this.apiKey,
                'page-size': limit,
                'show-fields': 'headline,trailText,bodyText,thumbnail,byline',
                'edition': 'au',
                'order-by': 'newest',
            };
            if (section && section !== 'all') {
                params.section = section;
            }
            if (options?.fromDate) {
                params['from-date'] = options.fromDate.toISOString().split('T')[0];
            }
            const url = `${this.API_BASE_URL}/search`;
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { params }));
            const items = response.data.response.results.map((article) => ({
                title: article.fields?.headline || article.webTitle,
                content: article.fields?.bodyText || article.fields?.trailText || '',
                source: 'The Guardian Australia',
                sourceUrl: article.webUrl,
                publishedAt: new Date(article.webPublicationDate),
                category: this.mapSectionToCategory(article.sectionId),
                author: article.fields?.byline,
                imageUrl: article.fields?.thumbnail,
            }));
            this.logger.log(`Successfully fetched ${items.length} articles from The Guardian Australia`);
            return items;
        }
        catch (error) {
            this.logger.error(`Error fetching Guardian Australia: ${error.message}`);
            throw error;
        }
    }
    mapCategoryToSection(category) {
        const mapping = {
            politics: 'australia-news/australian-politics',
            business: 'business',
            technology: 'technology',
            environment: 'environment',
            international: 'world',
        };
        return category ? (mapping[category.toLowerCase()] || 'australia-news') : 'australia-news';
    }
    mapSectionToCategory(sectionId) {
        if (sectionId.includes('politics'))
            return 'POLITICS';
        if (sectionId.includes('business'))
            return 'BUSINESS';
        if (sectionId.includes('technology'))
            return 'TECHNOLOGY';
        if (sectionId.includes('environment'))
            return 'ENVIRONMENT';
        if (sectionId.includes('world'))
            return 'INTERNATIONAL';
        return 'OTHER';
    }
};
exports.GuardianAustraliaProvider = GuardianAustraliaProvider;
exports.GuardianAustraliaProvider = GuardianAustraliaProvider = GuardianAustraliaProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _a : Object])
], GuardianAustraliaProvider);
//# sourceMappingURL=guardian-au.provider.js.map