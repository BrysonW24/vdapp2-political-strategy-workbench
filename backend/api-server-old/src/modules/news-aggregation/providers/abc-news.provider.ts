import { Injectable, Logger } from '@nestjs/common'
import Parser from 'rss-parser'
import { INewsProvider, NewsItem, FetchNewsOptions } from '../interfaces/news-provider.interface'

@Injectable()
export class ABCNewsProvider implements INewsProvider {
  private readonly logger = new Logger(ABCNewsProvider.name)
  private readonly parser: Parser
  private readonly RSS_FEEDS = {
    politics: 'https://www.abc.net.au/news/feed/2942460/rss.xml',
    news: 'https://www.abc.net.au/news/feed/51120/rss.xml',
    business: 'https://www.abc.net.au/news/feed/2908/rss.xml',
    world: 'https://www.abc.net.au/news/feed/2535500/rss.xml',
  }

  constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['description', 'content', 'media:thumbnail'],
      },
    })
  }

  getName(): string {
    return 'ABC News Australia'
  }

  async fetchNews(options?: FetchNewsOptions): Promise<NewsItem[]> {
    try {
      const category = options?.category?.toLowerCase() || 'politics'
      const feedUrl = this.RSS_FEEDS[category] || this.RSS_FEEDS.politics
      const limit = options?.limit || 20

      this.logger.log(`Fetching news from ABC News - ${category}`)

      const feed = await this.parser.parseURL(feedUrl)
      const items: NewsItem[] = []

      for (const item of feed.items.slice(0, limit)) {
        const newsItem: NewsItem = {
          title: item.title || '',
          content: this.extractContent(item),
          source: 'ABC News',
          sourceUrl: item.link || '',
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          category: category.toUpperCase(),
          author: item.creator || 'ABC News',
          imageUrl: this.extractImageUrl(item),
        }

        // Filter by date if provided
        if (options?.fromDate && newsItem.publishedAt < options.fromDate) {
          continue
        }

        items.push(newsItem)
      }

      this.logger.log(`Successfully fetched ${items.length} articles from ABC News`)
      return items
    } catch (error) {
      this.logger.error(`Error fetching ABC News: ${error.message}`)
      throw error
    }
  }

  private extractContent(item: any): string {
    // Try content:encoded first, then description, then summary
    return (
      item['content:encoded'] ||
      item.contentSnippet ||
      item.description ||
      item.summary ||
      ''
    ).substring(0, 5000) // Limit content length
  }

  private extractImageUrl(item: any): string | undefined {
    // Try different image fields
    if (item['media:thumbnail']) {
      return item['media:thumbnail'].$ ?.url || item['media:thumbnail']
    }
    if (item.enclosure?.url) {
      return item.enclosure.url
    }
    return undefined
  }
}
