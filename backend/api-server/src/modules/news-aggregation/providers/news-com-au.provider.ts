import { Injectable, Logger } from '@nestjs/common'
import Parser from 'rss-parser'
import { INewsProvider, NewsItem, FetchNewsOptions } from '../interfaces/news-provider.interface'

@Injectable()
export class NewsComAuProvider implements INewsProvider {
  private readonly logger = new Logger(NewsComAuProvider.name)
  private readonly parser: Parser
  private readonly RSS_FEEDS = {
    politics: 'https://www.news.com.au/national/politics/rss',
    news: 'https://www.news.com.au/national/rss',
    business: 'https://www.news.com.au/finance/rss',
    technology: 'https://www.news.com.au/technology/rss',
    world: 'https://www.news.com.au/world/rss',
  }

  constructor() {
    this.parser = new Parser({
      customFields: {
        item: [
          'description',
          'content:encoded',
          'media:content',
          'media:thumbnail',
        ],
      },
    })
  }

  getName(): string {
    return 'News.com.au'
  }

  async fetchNews(options?: FetchNewsOptions): Promise<NewsItem[]> {
    try {
      const category = options?.category?.toLowerCase() || 'politics'
      const feedUrl = this.RSS_FEEDS[category] || this.RSS_FEEDS.politics
      const limit = options?.limit || 20

      this.logger.log(`Fetching news from News.com.au - ${category}`)

      const feed = await this.parser.parseURL(feedUrl)
      const items: NewsItem[] = []

      for (const item of feed.items.slice(0, limit)) {
        const publishedDate = item.pubDate ? new Date(item.pubDate) : new Date()

        // Filter by date if provided
        if (options?.fromDate && publishedDate < options.fromDate) {
          continue
        }

        const newsItem: NewsItem = {
          title: item.title || '',
          content: this.extractContent(item),
          source: 'News.com.au',
          sourceUrl: item.link || '',
          publishedAt: publishedDate,
          category: category.toUpperCase(),
          author: item.creator || 'News.com.au',
          imageUrl: this.extractImageUrl(item),
        }

        items.push(newsItem)
      }

      this.logger.log(`Successfully fetched ${items.length} articles from News.com.au`)
      return items
    } catch (error) {
      this.logger.error(`Error fetching News.com.au: ${error.message}`)
      throw error
    }
  }

  private extractContent(item: any): string {
    let content = ''

    // Try different content fields
    if (item['content:encoded']) {
      content = item['content:encoded']
    } else if (item.contentSnippet) {
      content = item.contentSnippet
    } else if (item.description) {
      content = item.description
    } else if (item.summary) {
      content = item.summary
    }

    // Strip HTML tags if present
    content = content.replace(/<[^>]*>/g, '')
    
    // Limit content length
    return content.substring(0, 5000)
  }

  private extractImageUrl(item: any): string | undefined {
    // Try different image fields
    if (item['media:content']?.$ ?.url) {
      return item['media:content'].$.url
    }
    if (item['media:thumbnail']?.$ ?.url) {
      return item['media:thumbnail'].$.url
    }
    if (item.enclosure?.url) {
      return item.enclosure.url
    }
    return undefined
  }
}
