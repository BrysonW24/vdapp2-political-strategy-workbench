"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNewsArticleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_news_article_dto_1 = require("./create-news-article.dto");
class UpdateNewsArticleDto extends (0, swagger_1.PartialType)(create_news_article_dto_1.CreateNewsArticleDto) {
}
exports.UpdateNewsArticleDto = UpdateNewsArticleDto;
//# sourceMappingURL=update-news-article.dto.js.map