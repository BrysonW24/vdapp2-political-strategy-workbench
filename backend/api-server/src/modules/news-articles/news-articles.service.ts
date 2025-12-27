import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { CreateNewsArticleDto } from './dto/create-news-article.dto'
import { UpdateNewsArticleDto } from './dto/update-news-article.dto'
import { QueryNewsArticleDto } from './dto/query-news-article.dto'

@Injectable()
export class NewsArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateNewsArticleDto) {
    const { tags, ...articleData } = createDto

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
    })

    return article
  }

  async findAll(query: QueryNewsArticleDto) {
    const { category, search, page, limit } = query
    const skip = (page - 1) * limit

    const where = {
      ...(category && { category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { content: { contains: search, mode: 'insensitive' as const } },
          { source: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    }

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
    ])

    return {
      data: articles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: string) {
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
    })

    if (!article) {
      throw new NotFoundException(`News article with ID ${id} not found`)
    }

    return article
  }

  async update(id: string, updateDto: UpdateNewsArticleDto) {
    await this.findOne(id)

    const { tags, ...articleData } = updateDto

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
    })
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.prisma.newsArticle.delete({ where: { id } })
    return { message: 'Article deleted successfully' }
  }
}
