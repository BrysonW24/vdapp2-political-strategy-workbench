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
var ABCNewsProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABCNewsProvider = void 0;
const common_1 = require("@nestjs/common");
const rss_parser_1 = __importDefault(require("rss-parser"));
let ABCNewsProvider = ABCNewsProvider_1 = class ABCNewsProvider {
    constructor() {
        this.logger = new common_1.Logger(ABCNewsProvider_1.name);
        this.RSS_FEEDS = {
            politics: 'https://www.abc.net.au/news/feed/2942460/rss.xml',
            news: 'https://www.abc.net.au/news/feed/51120/rss.xml',
            business: 'https://www.abc.net.au/news/feed/2908/rss.xml',
            world: 'https://www.abc.net.au/news/feed/2535500/rss.xml',
        };
        this.parser = new rss_parser_1.default({
            customFields: {
                item: ['description', 'content', 'media:thumbnail'],
            },
        });
    }
    getName() {
        return 'ABC News Australia';
    }
    async fetchNews(options) {
        try {
            const category = options?.category?.toLowerCase() || 'politics';
            const feedUrl = this.RSS_FEEDS[category] || this.RSS_FEEDS.politics;
            const limit = options?.limit || 20;
            this.logger.log(`Fetching news from ABC News - ${category}`);
            const feed = await this.parser.parseURL(feedUrl);
            const items = [];
            for (const item of feed.items.slice(0, limit)) {
                const title = item.title || '';
                const content = this.extractContent(item);
                const newsItem = {
                    title,
                    content,
                    source: 'ABC News',
                    sourceUrl: item.link || '',
                    publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
                    category: this.categorizeContent(title, content, category),
                    author: item.creator || 'ABC News',
                    imageUrl: this.extractImageUrl(item),
                };
                if (options?.fromDate && newsItem.publishedAt < options.fromDate) {
                    continue;
                }
                items.push(newsItem);
            }
            this.logger.log(`Successfully fetched ${items.length} articles from ABC News`);
            return items;
        }
        catch (error) {
            this.logger.error(`Error fetching ABC News: ${error.message}`);
            throw error;
        }
    }
    extractContent(item) {
        return (item['content:encoded'] ||
            item.contentSnippet ||
            item.description ||
            item.summary ||
            '').substring(0, 5000);
    }
    extractImageUrl(item) {
        if (item['media:thumbnail']) {
            return item['media:thumbnail'].$?.url || item['media:thumbnail'];
        }
        if (item.enclosure?.url) {
            return item.enclosure.url;
        }
        return undefined;
    }
    categorizeContent(title, content, requestedCategory) {
        const text = (title + ' ' + content).toLowerCase();
        const sportsKeywords = ['cricket', 'test', 'ashes', 'wicket', 'batting', 'bowling', 'innings', 'mcg',
            'football', 'soccer', 'rugby', 'tennis', 'atp', 'australian open', 'sport', 'match', 'game',
            'team', 'player', 'coach', 'sydney to hobart', 'yacht', 'race', 'championship'];
        const politicsKeywords = ['government', 'parliament', 'minister', 'prime minister', 'election',
            'policy', 'legislation', 'labor', 'liberal', 'coalition', 'senate', 'mp', 'politician',
            'vote', 'political', 'politics'];
        const businessKeywords = ['economy', 'market', 'business', 'company', 'stock', 'trade',
            'investment', 'financial', 'revenue', 'profit', 'bank', 'corporate', 'industry'];
        const technologyKeywords = ['technology', 'tech', 'ai', 'artificial intelligence', 'software',
            'digital', 'cyber', 'computer', 'internet', 'app', 'platform'];
        if (sportsKeywords.some(keyword => text.includes(keyword))) {
            return 'OTHER';
        }
        if (politicsKeywords.some(keyword => text.includes(keyword))) {
            return 'POLITICS';
        }
        if (businessKeywords.some(keyword => text.includes(keyword))) {
            return 'BUSINESS';
        }
        if (technologyKeywords.some(keyword => text.includes(keyword))) {
            return 'TECHNOLOGY';
        }
        const validCategories = ['BUSINESS', 'TECHNOLOGY', 'POLITICS'];
        return validCategories.includes(requestedCategory.toUpperCase()) ? requestedCategory.toUpperCase() : 'OTHER';
    }
};
exports.ABCNewsProvider = ABCNewsProvider;
exports.ABCNewsProvider = ABCNewsProvider = ABCNewsProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ABCNewsProvider);
//# sourceMappingURL=abc-news.provider.js.map