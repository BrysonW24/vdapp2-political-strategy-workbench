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
exports.NewsArticlesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const news_articles_service_1 = require("./news-articles.service");
const create_news_article_dto_1 = require("./dto/create-news-article.dto");
const update_news_article_dto_1 = require("./dto/update-news-article.dto");
const query_news_article_dto_1 = require("./dto/query-news-article.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let NewsArticlesController = class NewsArticlesController {
    constructor(newsArticlesService) {
        this.newsArticlesService = newsArticlesService;
    }
    create(createNewsArticleDto) {
        return this.newsArticlesService.create(createNewsArticleDto);
    }
    findAll(query) {
        return this.newsArticlesService.findAll(query);
    }
    findOne(id) {
        return this.newsArticlesService.findOne(id);
    }
    update(id, updateNewsArticleDto) {
        return this.newsArticlesService.update(id, updateNewsArticleDto);
    }
    remove(id) {
        return this.newsArticlesService.remove(id);
    }
};
exports.NewsArticlesController = NewsArticlesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new news article' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_news_article_dto_1.CreateNewsArticleDto]),
    __metadata("design:returntype", void 0)
], NewsArticlesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all news articles with filtering' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_news_article_dto_1.QueryNewsArticleDto]),
    __metadata("design:returntype", void 0)
], NewsArticlesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single news article by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsArticlesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a news article' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_news_article_dto_1.UpdateNewsArticleDto]),
    __metadata("design:returntype", void 0)
], NewsArticlesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a news article' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsArticlesController.prototype, "remove", null);
exports.NewsArticlesController = NewsArticlesController = __decorate([
    (0, swagger_1.ApiTags)('News Articles'),
    (0, common_1.Controller)('news-articles'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [news_articles_service_1.NewsArticlesService])
], NewsArticlesController);
//# sourceMappingURL=news-articles.controller.js.map