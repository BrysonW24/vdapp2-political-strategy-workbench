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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var NewsComAuProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsComAuProvider = void 0;
const common_1 = require("@nestjs/common");
const rss_parser_1 = __importDefault(require("rss-parser"));
let NewsComAuProvider = NewsComAuProvider_1 = class NewsComAuProvider {
    constructor() {
        this.logger = new common_1.Logger(NewsComAuProvider_1.name);
        this.RSS_FEEDS = {
            politics: 'https://www.news.com.au/national/politics/rss',
            news: 'https://www.news.com.au/national/rss',
            business: 'https://www.news.com.au/finance/rss',
            technology: 'https://www.news.com.au/technology/rss',
            world: 'https://www.news.com.au/world/rss',
        };
        this.parser = new rss_parser_1.default({
            customFields: {
                item: [
                    'description',
                    'content:encoded',
                    'media:content',
                    'media:thumbnail',
                ],
            },
        });
    }
    getName() {
        return 'News.com.au';
    }
    async fetchNews(options) {
        try {
            const category = options?.category?.toLowerCase() || 'politics';
            const feedUrl = this.RSS_FEEDS[category] || this.RSS_FEEDS.politics;
            const limit = options?.limit || 20;
            this.logger.log(`Fetching news from News.com.au - ${category}`);
            const feed = await this.parser.parseURL(feedUrl);
            const items = [];
            for (const item of feed.items.slice(0, limit)) {
                const publishedDate = item.pubDate ? new Date(item.pubDate) : new Date();
                if (options?.fromDate && publishedDate < options.fromDate) {
                    continue;
                }
                const newsItem = {
                    title: item.title || '',
                    content: this.extractContent(item),
                    source: 'News.com.au',
                    sourceUrl: item.link || '',
                    publishedAt: publishedDate,
                    category: category.toUpperCase(),
                    author: item.creator || 'News.com.au',
                    imageUrl: this.extractImageUrl(item),
                };
                items.push(newsItem);
            }
            this.logger.log(`Successfully fetched ${items.length} articles from News.com.au`);
            return items;
        }
        catch (error) {
            this.logger.error(`Error fetching News.com.au: ${error.message}`);
            throw error;
        }
    }
    extractContent(item) {
        let content = '';
        if (item['content:encoded']) {
            content = item['content:encoded'];
        }
        else if (item.contentSnippet) {
            content = item.contentSnippet;
        }
        else if (item.description) {
            content = item.description;
        }
        else if (item.summary) {
            content = item.summary;
        }
        content = content.replace(/<[^>]*>/g, '');
        return content.substring(0, 5000);
    }
    extractImageUrl(item) {
        if (item['media:content']?.$?.url) {
            return item['media:content'].$.url;
        }
        if (item['media:thumbnail']?.$?.url) {
            return item['media:thumbnail'].$.url;
        }
        if (item.enclosure?.url) {
            return item.enclosure.url;
        }
        return undefined;
    }
};
exports.NewsComAuProvider = NewsComAuProvider;
exports.NewsComAuProvider = NewsComAuProvider = NewsComAuProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], NewsComAuProvider);
//# sourceMappingURL=news-com-au.provider.js.map