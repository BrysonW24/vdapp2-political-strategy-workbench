import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { INewsProvider, NewsItem, FetchNewsOptions } from '../interfaces/news-provider.interface'

interface GuardianResponse {
  response: {
    status: string
    results: GuardianArticle[]
  }
}

interface GuardianArticle {
  id: string
  type: string
  sectionId: string
  sectionName: string
  webPublicationDate: string
  webTitle: string
  webUrl: string
  fields?: {
    headline: string
    trailText: string
    bodyText: string
    thumbnail?: string
    byline?: string
  }
}

@Injectable()
export class GuardianAustraliaProvider implements INewsProvider {
  private readonly logger = new Logger(GuardianAustraliaProvider.name)
  private readonly API_BASE_URL = 'https://content.guardianapis.com'
  private readonly apiKey: string

  constructor(private readonly httpService: HttpService) {
    this.apiKey = process.env.GUARDIAN_API_KEY || ''
    if (!this.apiKey) {
      this.logger.warn('Guardian API key not set. Please set GUARDIAN_API_KEY environment variable.')
    }
  }

  getName(): string {
    return 'The Guardian Australia'
  }

  async fetchNews(options?: FetchNewsOptions): Promise<NewsItem[]> {
    try {
      if (!this.apiKey) {
        throw new Error('Guardian API key is required')
      }

      const limit = options?.limit || 20
      const section = this.mapCategoryToSection(options?.category)

      this.logger.log(`Fetching news from The Guardian Australia - ${section}`)

      const params: any = {
        'api-key': this.apiKey,
        'page-size': limit,
        'show-fields': 'headline,trailText,bodyText,thumbnail,byline',
        'edition': 'au', // Australian edition
        'order-by': 'newest',
      }

      if (section && section !== 'all') {
        params.section = section
      }

      if (options?.fromDate) {
        params['from-date'] = options.fromDate.toISOString().split('T')[0]
      }

      const url = `${this.API_BASE_URL}/search`
      const response = await firstValueFrom(
        this.httpService.get<GuardianResponse>(url, { params })
      )

      const items: NewsItem[] = response.data.response.results.map((article) => ({
        title: article.fields?.headline || article.webTitle,
        content: article.fields?.bodyText || article.fields?.trailText || '',
        source: 'The Guardian Australia',
        sourceUrl: article.webUrl,
        publishedAt: new Date(article.webPublicationDate),
        category: this.mapSectionToCategory(article.sectionId),
        author: article.fields?.byline,
        imageUrl: article.fields?.thumbnail,
      }))

      this.logger.log(`Successfully fetched ${items.length} articles from The Guardian Australia`)
      return items
    } catch (error) {
      this.logger.error(`Error fetching Guardian Australia: ${error.message}`)
      throw error
    }
  }

  private mapCategoryToSection(category?: string): string {
    const mapping: Record<string, string> = {
      politics: 'australia-news/australian-politics',
      business: 'business',
      technology: 'technology',
      environment: 'environment',
      international: 'world',
    }

    return category ? (mapping[category.toLowerCase()] || 'australia-news') : 'australia-news'
  }

  private mapSectionToCategory(sectionId: string): string {
    if (sectionId.includes('politics')) return 'POLITICS'
    if (sectionId.includes('business')) return 'BUSINESS'
    if (sectionId.includes('technology')) return 'TECHNOLOGY'
    if (sectionId.includes('environment')) return 'ENVIRONMENT'
    if (sectionId.includes('world')) return 'INTERNATIONAL'
    return 'OTHER'
  }
}
