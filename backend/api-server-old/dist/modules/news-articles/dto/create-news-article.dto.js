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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNewsArticleDto = exports.ArticleCategory = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var ArticleCategory;
(function (ArticleCategory) {
    ArticleCategory["POLITICS"] = "POLITICS";
    ArticleCategory["BUSINESS"] = "BUSINESS";
    ArticleCategory["TECHNOLOGY"] = "TECHNOLOGY";
    ArticleCategory["SOCIAL"] = "SOCIAL";
    ArticleCategory["ENVIRONMENT"] = "ENVIRONMENT";
    ArticleCategory["INTERNATIONAL"] = "INTERNATIONAL";
    ArticleCategory["OTHER"] = "OTHER";
})(ArticleCategory || (exports.ArticleCategory = ArticleCategory = {}));
class CreateNewsArticleDto {
}
exports.CreateNewsArticleDto = CreateNewsArticleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Article title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNewsArticleDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Article content' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNewsArticleDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Source name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNewsArticleDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Source URL', required: false }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsArticleDto.prototype, "sourceUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Published date' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateNewsArticleDto.prototype, "publishedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ArticleCategory, description: 'Article category' }),
    (0, class_validator_1.IsEnum)(ArticleCategory),
    __metadata("design:type", String)
], CreateNewsArticleDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Article tags', required: false, type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateNewsArticleDto.prototype, "tags", void 0);
//# sourceMappingURL=create-news-article.dto.js.map