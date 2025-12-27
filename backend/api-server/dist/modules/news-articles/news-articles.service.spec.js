"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const news_articles_service_1 = require("./news-articles.service");
const prisma_service_1 = require("../../database/prisma.service");
const create_news_article_dto_1 = require("./dto/create-news-article.dto");
describe('NewsArticlesService', () => {
    let service;
    let prisma;
    const mockPrismaService = {
        newsArticle: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                news_articles_service_1.NewsArticlesService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();
        service = module.get(news_articles_service_1.NewsArticlesService);
        prisma = module.get(prisma_service_1.PrismaService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('create', () => {
        it('should create a news article', async () => {
            const createDto = {
                title: 'Test Article',
                content: 'Test content',
                source: 'Test Source',
                publishedAt: '2024-01-01',
                category: create_news_article_dto_1.ArticleCategory.POLITICS,
            };
            const expectedArticle = {
                id: '1',
                ...createDto,
                publishedAt: new Date(createDto.publishedAt),
                createdAt: new Date(),
                updatedAt: new Date(),
                tags: [],
            };
            mockPrismaService.newsArticle.create.mockResolvedValue(expectedArticle);
            const result = await service.create(createDto);
            expect(result).toEqual(expectedArticle);
            expect(mockPrismaService.newsArticle.create).toHaveBeenCalledTimes(1);
        });
    });
    describe('findOne', () => {
        it('should return a news article', async () => {
            const article = {
                id: '1',
                title: 'Test Article',
                tags: [],
                analyses: [],
            };
            mockPrismaService.newsArticle.findUnique.mockResolvedValue(article);
            const result = await service.findOne('1');
            expect(result).toEqual(article);
        });
        it('should throw NotFoundException if article not found', async () => {
            mockPrismaService.newsArticle.findUnique.mockResolvedValue(null);
            await expect(service.findOne('999')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('remove', () => {
        it('should delete a news article', async () => {
            const article = { id: '1', title: 'Test' };
            mockPrismaService.newsArticle.findUnique.mockResolvedValue(article);
            mockPrismaService.newsArticle.delete.mockResolvedValue(article);
            const result = await service.remove('1');
            expect(result).toEqual({ message: 'Article deleted successfully' });
            expect(mockPrismaService.newsArticle.delete).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });
    });
});
//# sourceMappingURL=news-articles.service.spec.js.map