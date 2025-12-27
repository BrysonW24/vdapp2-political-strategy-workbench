import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { NewsArticlesService } from './news-articles.service'
import { PrismaService } from '../../database/prisma.service'
import { ArticleCategory } from './dto/create-news-article.dto'

describe('NewsArticlesService', () => {
  let service: NewsArticlesService
  let prisma: PrismaService

  const mockPrismaService = {
    newsArticle: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsArticlesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    service = module.get<NewsArticlesService>(NewsArticlesService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a news article', async () => {
      const createDto = {
        title: 'Test Article',
        content: 'Test content',
        source: 'Test Source',
        publishedAt: '2024-01-01',
        category: ArticleCategory.POLITICS,
      }

      const expectedArticle = {
        id: '1',
        ...createDto,
        publishedAt: new Date(createDto.publishedAt),
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
      }

      mockPrismaService.newsArticle.create.mockResolvedValue(expectedArticle)

      const result = await service.create(createDto)

      expect(result).toEqual(expectedArticle)
      expect(mockPrismaService.newsArticle.create).toHaveBeenCalledTimes(1)
    })
  })

  describe('findOne', () => {
    it('should return a news article', async () => {
      const article = {
        id: '1',
        title: 'Test Article',
        tags: [],
        analyses: [],
      }

      mockPrismaService.newsArticle.findUnique.mockResolvedValue(article)

      const result = await service.findOne('1')

      expect(result).toEqual(article)
    })

    it('should throw NotFoundException if article not found', async () => {
      mockPrismaService.newsArticle.findUnique.mockResolvedValue(null)

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException)
    })
  })

  describe('remove', () => {
    it('should delete a news article', async () => {
      const article = { id: '1', title: 'Test' }
      mockPrismaService.newsArticle.findUnique.mockResolvedValue(article)
      mockPrismaService.newsArticle.delete.mockResolvedValue(article)

      const result = await service.remove('1')

      expect(result).toEqual({ message: 'Article deleted successfully' })
      expect(mockPrismaService.newsArticle.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })
  })
})
