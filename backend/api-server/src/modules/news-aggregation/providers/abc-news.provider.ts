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
        const title = item.title || ''
        const content = this.extractContent(item)

        const newsItem: NewsItem = {
          title,
          content,
          source: 'ABC News',
          sourceUrl: item.link || '',
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          category: this.categorizeContent(title, content, category),
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

  private categorizeContent(title: string, content: string, requestedCategory: string): string {
    const text = (title + ' ' + content).toLowerCase()

    // Sports keywords
    const sportsKeywords = ['cricket', 'test', 'ashes', 'wicket', 'batting', 'bowling', 'innings', 'mcg',
      'football', 'soccer', 'rugby', 'tennis', 'atp', 'australian open', 'sport', 'match', 'game',
      'team', 'player', 'coach', 'sydney to hobart', 'yacht', 'race', 'championship']

    // Politics keywords
    const politicsKeywords = ['government', 'parliament', 'minister', 'prime minister', 'election',
      'policy', 'legislation', 'labor', 'liberal', 'coalition', 'senate', 'mp', 'politician',
      'vote', 'political', 'politics']

    // Business keywords
    const businessKeywords = ['economy', 'market', 'business', 'company', 'stock', 'trade',
      'investment', 'financial', 'revenue', 'profit', 'bank', 'corporate', 'industry']

    // Technology keywords
    const technologyKeywords = ['technology', 'tech', 'ai', 'artificial intelligence', 'software',
      'digital', 'cyber', 'computer', 'internet', 'app', 'platform']

    // Check for sports content first (to avoid miscategorization)
    if (sportsKeywords.some(keyword => text.includes(keyword))) {
      return 'OTHER'
    }

    // Check for politics
    if (politicsKeywords.some(keyword => text.includes(keyword))) {
      return 'POLITICS'
    }

    // Check for business
    if (businessKeywords.some(keyword => text.includes(keyword))) {
      return 'BUSINESS'
    }

    // Check for technology
    if (technologyKeywords.some(keyword => text.includes(keyword))) {
      return 'TECHNOLOGY'
    }

    // If we can't categorize based on content, use the requested category if it makes sense
    // Otherwise default to OTHER
    const validCategories = ['BUSINESS', 'TECHNOLOGY', 'POLITICS']
    return validCategories.includes(requestedCategory.toUpperCase()) ? requestedCategory.toUpperCase() : 'OTHER'
  }
}
