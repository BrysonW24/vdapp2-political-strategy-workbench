import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { PrismaService } from '../../database/prisma.service'
import { ABCNewsProvider } from './providers/abc-news.provider'
import { GuardianAustraliaProvider } from './providers/guardian-au.provider'
import { NewsComAuProvider } from './providers/news-com-au.provider'
import { INewsProvider, NewsItem } from './interfaces/news-provider.interface'
import { ArticleCategory } from '@prisma/client'

@Injectable()
export class NewsAggregationService {
  private readonly logger = new Logger(NewsAggregationService.name)
  private readonly providers: INewsProvider[]

  constructor(
    private readonly prisma: PrismaService,
    private readonly abcNewsProvider: ABCNewsProvider,
    private readonly guardianProvider: GuardianAustraliaProvider,
    private readonly newsComAuProvider: NewsComAuProvider,
  ) {
    this.providers = [
      this.abcNewsProvider,
      this.guardianProvider,
      this.newsComAuProvider,
    ]
  }

  async fetchFromAllSources(category?: string, limit: number = 10): Promise<NewsItem[]> {
    const allNews: NewsItem[] = []

    for (const provider of this.providers) {
      try {
        this.logger.log('Fetching from provider')
        const news = await provider.fetchNews({ category, limit })
        allNews.push(...news)
      } catch (error) {
        this.logger.error('Failed to fetch from provider')
      }
    }

    return allNews
  }

  async fetchAndStore(category?: string, limit: number = 10): Promise<number> {
    this.logger.log('Fetching and storing news articles')

    const newsItems = await this.fetchFromAllSources(category, limit)
    let stored = 0

    for (const item of newsItems) {
      try {
        const existing = await this.prisma.newsArticle.findFirst({
          where: {
            OR: [
              { sourceUrl: item.sourceUrl },
              {
                title: item.title,
                source: item.source,
              },
            ],
          },
        })

        if (existing) {
          continue
        }

        const categoryEnum = this.mapCategoryToEnum(item.category)

        await this.prisma.newsArticle.create({
          data: {
            title: item.title,
            content: item.content,
            source: item.source,
            sourceUrl: item.sourceUrl,
            publishedAt: item.publishedAt,
            category: categoryEnum,
          },
        })

        stored++
      } catch (error) {
        this.logger.error('Error storing article')
      }
    }

    this.logger.log('Completed storing articles')
    return stored
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async scheduledNewsFetch() {
    this.logger.log('Starting scheduled news fetch')
    
    try {
      const categories = ['politics', 'business', 'technology']
      
      for (const category of categories) {
        await this.fetchAndStore(category, 5)
      }
      
      this.logger.log('Scheduled news fetch completed')
    } catch (error) {
      this.logger.error('Scheduled news fetch failed')
    }
  }

  async fetchFromSource(source: string, category?: string, limit: number = 10): Promise<NewsItem[]> {
    const provider = this.providers.find(
      (p) => p.getName().toLowerCase().includes(source.toLowerCase())
    )

    if (!provider) {
      throw new Error('News provider not found')
    }

    return provider.fetchNews({ category, limit })
  }

  getAvailableSources(): string[] {
    return this.providers.map((p) => p.getName())
  }

  private mapCategoryToEnum(category: string): ArticleCategory {
    const mapping: Record<string, ArticleCategory> = {
      POLITICS: 'POLITICS',
      BUSINESS: 'BUSINESS',
      TECHNOLOGY: 'TECHNOLOGY',
      SOCIAL: 'SOCIAL',
      ENVIRONMENT: 'ENVIRONMENT',
      INTERNATIONAL: 'INTERNATIONAL',
    }

    return mapping[category.toUpperCase()] || 'OTHER'
  }
}
