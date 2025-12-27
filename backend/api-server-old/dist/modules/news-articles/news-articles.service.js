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
exports.NewsArticlesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let NewsArticlesService = class NewsArticlesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto) {
        const { tags, ...articleData } = createDto;
        const article = await this.prisma.newsArticle.create({
            data: {
                ...articleData,
                publishedAt: new Date(articleData.publishedAt),
                tags: tags
                    ? {
                        create: tags.map((tagName) => ({
                            tag: {
                                connectOrCreate: {
                                    where: { name: tagName },
                                    create: { name: tagName },
                                },
                            },
                        })),
                    }
                    : undefined,
            },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });
        return article;
    }
    async findAll(query) {
        const { category, search, page, limit } = query;
        const skip = (page - 1) * limit;
        const where = {
            ...(category && { category }),
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } },
                    { source: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [articles, total] = await Promise.all([
            this.prisma.newsArticle.findMany({
                where,
                skip,
                take: limit,
                orderBy: { publishedAt: 'desc' },
                include: {
                    tags: {
                        include: {
                            tag: true,
                        },
                    },
                    analyses: {
                        select: {
                            id: true,
                            analysisType: true,
                            sentiment: true,
                        },
                    },
                },
            }),
            this.prisma.newsArticle.count({ where }),
        ]);
        return {
            data: articles,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const article = await this.prisma.newsArticle.findUnique({
            where: { id },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
                analyses: true,
            },
        });
        if (!article) {
            throw new common_1.NotFoundException(`News article with ID ${id} not found`);
        }
        return article;
    }
    async update(id, updateDto) {
        await this.findOne(id);
        const { tags, ...articleData } = updateDto;
        return this.prisma.newsArticle.update({
            where: { id },
            data: {
                ...articleData,
                ...(articleData.publishedAt && {
                    publishedAt: new Date(articleData.publishedAt),
                }),
            },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.newsArticle.delete({ where: { id } });
        return { message: 'Article deleted successfully' };
    }
};
exports.NewsArticlesService = NewsArticlesService;
exports.NewsArticlesService = NewsArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NewsArticlesService);
//# sourceMappingURL=news-articles.service.js.map