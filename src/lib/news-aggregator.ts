// News aggregation from multiple Australian sources
import Parser from 'rss-parser';
import { getParliamentarianKeywords } from './parliamentarians';

const rssParser = new Parser({
  customFields: {
    item: ['media:thumbnail', 'media:content'],
  },
});

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  category: string;
  publishedAt: string;
  summary: string;
  url: string;
  relevanceScore: number;
  imageUrl?: string;
  sourceIcon?: string;
}

// ABC News RSS Feeds
const ABC_RSS_FEEDS = {
  politics: 'https://www.abc.net.au/news/feed/51120/rss.xml',
  federal: 'https://www.abc.net.au/news/feed/51120/rss.xml', // Use general politics feed
  business: 'https://www.abc.net.au/news/feed/51638/rss.xml',
  latest: 'https://www.abc.net.au/news/feed/45910/rss.xml',
};

// Priority Australian news sources for NewsData.io
// These are the most authoritative and reliable Australian news outlets
const PRIORITY_AU_DOMAINS = [
  'abc.net.au',           // Priority 3795 - ABC News (public broadcaster)
  'smh.com.au',           // Priority 2251 - Sydney Morning Herald
  'theage.com.au',        // Priority 44145 - The Age
  'afr.com',              // Priority 45911 - Australian Financial Review
  'theguardian.com',      // Priority 106 - The Guardian Australia
  '9news.com.au',         // Priority 19202 - Nine News
  '7news.com.au',         // Priority 23845 - Seven News
  'brisbanetimes.com.au', // Priority 22163 - Brisbane Times
  'theconversation.com',  // Priority 1694 - The Conversation (academic)
  'crikey.com.au',        // Priority 43327 - Crikey (investigative)
].join(',');

/**
 * Fetch news from ABC News RSS feeds
 * Respects ABC's terms of use - RSS feeds are publicly provided
 * Uses reasonable polling intervals to avoid server load
 */
export async function fetchABCNews(category: 'politics' | 'federal' | 'business' | 'latest' = 'politics'): Promise<NewsArticle[]> {
  try {
    const feedUrl = ABC_RSS_FEEDS[category];

    const feed = await rssParser.parseURL(feedUrl);

    // Get current parliamentarian surnames for keyword matching
    const parliamentarianKeywords = await getParliamentarianKeywords();

    const articles: NewsArticle[] = feed.items.map((item, index) => {
      // Extract image from media:content or media:thumbnail
      let imageUrl: string | undefined;
      if (item['media:content']) {
        imageUrl = (item['media:content'] as any)?.['$']?.url;
      } else if (item['media:thumbnail']) {
        imageUrl = (item['media:thumbnail'] as any)?.['$']?.url;
      }

      // Determine if article is political based on keywords
      const title = (item.title || '').toLowerCase();
      const summary = (item.contentSnippet || item.content || item.summary || '').toLowerCase();
      const content = `${title} ${summary}`;

      // Strong political indicators - must have at least one
      const strongPoliticalKeywords = [
        // Core Political Terms
        'parliament', 'minister', 'election', 'political', 'prime minister', 'pm ',
        'albanese', 'dutton', 'labor', 'liberal', 'greens', 'government',
        'senate', 'mp', 'federal', 'state', 'legislation', 'policy', 'council',
        'royal commission', 'budget', 'treasury', 'diplomacy', 'sanctions',
        'treaty', 'referendum', 'coalition', 'opposition', 'cabinet',

        // Policy Areas
        'energy policy', 'climate', 'renewable', 'environment', 'regulation',
        'environmental policy', 'climate change', 'emissions',

        // Elections & Campaigns
        'elections', 'electoral', 'campaign', 'candidate', 'voting', 'ballot',
        'political party', 'political parties', 'pre-selection', 'polling',

        // International/Security
        'israel', 'palestine', 'ukraine', 'china', 'military', 'defence',
        'foreign affairs', 'international relations', 'trade agreement',
        'national security', 'asio', 'intelligence', 'terrorism', 'security',

        // Emergency Services & Governance
        'firefighter', 'emergency services', 'volunteer', 'disaster relief',

        // Political Movements & Leadership
        'political leadership', 'political movement', 'political debate',
        'political donation', 'political ideology', 'political prisoner',

        // Government Functions
        'federal government', 'state government', 'government funding',
        'government policy', 'parliamentary', 'ministerial',

        // Specific Australian Context
        'aboriginal services', 'indigenous policy', 'constitutional',
        'health board', 'public service', 'government department',

        // Current Parliamentarians (dynamically updated from Parliament House)
        ...parliamentarianKeywords
      ];

      // Exclude sports/entertainment articles
      const nonPoliticalKeywords = [
        'cricket', 'football', 'rugby', 'sport', 'match', 'player', 'game',
        'wicket', 'innings', 'test', 'score', 'coach', 'team', 'race', 'horse'
      ];

      const hasStrongPolitical = strongPoliticalKeywords.some(keyword => content.includes(keyword));
      const hasNonPolitical = nonPoliticalKeywords.some(keyword => content.includes(keyword));

      const isPolitical = hasStrongPolitical && !hasNonPolitical;

      return {
        id: `abc-${item.guid || item.link || index}`,
        title: item.title || 'Untitled',
        source: 'ABC News',
        category: isPolitical ? (category === 'federal' ? 'federal-politics' : category) : 'latest',
        publishedAt: item.pubDate || new Date().toISOString(),
        summary: item.contentSnippet || item.content || item.summary || '',
        url: item.link || '',
        relevanceScore: 0.95, // ABC is highly authoritative
        imageUrl,
        sourceIcon: 'https://www.abc.net.au/res/sites/news-projects/global-foundation/1.26.3/images/abc-logo.svg',
      };
    });

    return articles;
  } catch (error) {
    console.error('Error fetching ABC RSS feed:', error);
    return [];
  }
}

/**
 * Fetch news from NewsData.io API
 * Requires API key in environment variables
 */
export async function fetchNewsDataIO(
  keywords?: string,
  category: string = 'politics'
): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWSDATA_API_KEY;

  if (!apiKey) {
    console.warn('NEWSDATA_API_KEY not configured, skipping NewsData.io');
    return [];
  }

  try {
    const params = new URLSearchParams({
      apikey: apiKey,
      country: 'au',
      language: 'en',
      category: category,
      // Note: prioritydomain requires paid plan, we use relevance scoring instead
    });

    if (keywords) {
      params.append('q', keywords);
    }

    const response = await fetch(
      `https://newsdata.io/api/1/latest?${params.toString()}`,
      {
        headers: {
          'User-Agent': 'Political-Strategy-Workbench/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`NewsData.io API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(`NewsData.io error: ${data.results?.message || 'Unknown error'}`);
    }

    const articles: NewsArticle[] = (data.results || []).map((item: any, index: number) => ({
      id: item.article_id || `newsdata-${index}`,
      title: item.title,
      source: item.source_name || item.source_id,
      category: item.category?.[0] || category,
      publishedAt: item.pubDate,
      summary: item.description || '',
      url: item.link,
      relevanceScore: calculateRelevanceScore(item),
      imageUrl: item.image_url,
      sourceIcon: item.source_icon,
    }));

    return articles;
  } catch (error) {
    console.error('Error fetching NewsData.io:', error);
    return [];
  }
}

/**
 * Calculate relevance score based on source priority and other factors
 * Prioritizes authoritative Australian news sources
 */
function calculateRelevanceScore(article: any): number {
  let score = 0.5; // Base score

  // Boost for high-priority Australian sources
  const sourceUrl = article.source_url?.toLowerCase() || '';
  const sourceName = article.source_name?.toLowerCase() || '';

  // Tier 1: Premium authoritative sources (0.9-0.95)
  if (sourceUrl.includes('abc.net.au') || sourceName.includes('abc')) {
    score = 0.93; // ABC News - public broadcaster, highest trust
  } else if (sourceUrl.includes('smh.com.au') || sourceName.includes('sydney morning herald')) {
    score = 0.92; // SMH - Fairfax flagship
  } else if (sourceUrl.includes('afr.com') || sourceName.includes('financial review')) {
    score = 0.91; // AFR - business/policy authority
  } else if (sourceUrl.includes('theguardian.com')) {
    score = 0.90; // Guardian - international quality
  }
  // Tier 2: Major network news (0.85-0.89)
  else if (sourceUrl.includes('theage.com.au') || sourceName.includes('the age')) {
    score = 0.88; // The Age - Melbourne Fairfax
  } else if (sourceUrl.includes('9news.com.au') || sourceName.includes('nine news')) {
    score = 0.87; // Nine News - major network
  } else if (sourceUrl.includes('7news.com.au') || sourceName.includes('seven news')) {
    score = 0.86; // Seven News - major network
  } else if (sourceUrl.includes('brisbanetimes.com.au')) {
    score = 0.85; // Brisbane Times - regional Fairfax
  }
  // Tier 3: Specialist & investigative (0.80-0.84)
  else if (sourceUrl.includes('theconversation.com')) {
    score = 0.83; // The Conversation - academic analysis
  } else if (sourceUrl.includes('crikey.com.au')) {
    score = 0.82; // Crikey - investigative journalism
  }
  // Tier 4: Other sources - calculate from priority
  else if (article.source_priority) {
    // Lower priority number = more authoritative
    // Map priority 0-50000 to score 0.5-0.8
    score = Math.max(0.5, Math.min(0.8, 0.8 - (article.source_priority / 50000) * 0.3));
  }

  // Bonus points for quality indicators
  if (article.sentiment) {
    score += 0.02; // Has sentiment analysis
  }

  if (article.ai_tag && Array.isArray(article.ai_tag) && article.ai_tag.length > 0) {
    score += 0.02; // Has AI tags

    // Extra boost for government/political tags
    const politicalTags = ['government', 'politics', 'parliament', 'minister', 'policy'];
    const hasPoliticalTag = politicalTags.some(tag =>
      article.ai_tag.some((t: string) => t.toLowerCase().includes(tag))
    );
    if (hasPoliticalTag) {
      score += 0.03;
    }
  }

  return Math.min(score, 0.94); // Cap below ABC RSS (0.95)
}

/**
 * Aggregate news from all sources
 * Combines ABC RSS + NewsData.io for comprehensive coverage
 */
export async function aggregateAustralianPoliticalNews(
  keywords?: string
): Promise<NewsArticle[]> {
  console.log('Fetching Australian political news from multiple sources...');

  // Fetch from both sources in parallel
  const [abcArticles, newsdataArticles] = await Promise.all([
    fetchABCNews('federal'),
    fetchNewsDataIO(keywords, 'politics'),
  ]);

  // Combine and filter out non-political articles
  const allArticles = [...abcArticles, ...newsdataArticles];

  // Filter to only political articles (exclude 'latest' category)
  const politicalArticles = allArticles.filter(article =>
    article.category !== 'latest'
  );

  // Remove duplicates based on title similarity
  const uniqueArticles = deduplicateArticles(politicalArticles);

  // Sort by relevance score and publish date
  uniqueArticles.sort((a, b) => {
    const scoreDiff = b.relevanceScore - a.relevanceScore;
    if (Math.abs(scoreDiff) > 0.1) {
      return scoreDiff;
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  console.log(`Aggregated ${uniqueArticles.length} unique articles (${abcArticles.length} from ABC, ${newsdataArticles.length} from NewsData.io)`);

  return uniqueArticles;
}

/**
 * Remove duplicate articles based on title similarity
 */
function deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Map<string, NewsArticle>();

  for (const article of articles) {
    const normalizedTitle = normalizeTitle(article.title);

    if (!seen.has(normalizedTitle)) {
      seen.set(normalizedTitle, article);
    } else {
      // Keep the one with higher relevance score
      const existing = seen.get(normalizedTitle)!;
      if (article.relevanceScore > existing.relevanceScore) {
        seen.set(normalizedTitle, article);
      }
    }
  }

  return Array.from(seen.values());
}

/**
 * Normalize title for deduplication
 */
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 50); // Compare first 50 chars
}

/**
 * Fetch historical news from NewsData.io Archive API
 * Allows searching by date range (requires paid plan)
 * Free tier: No archive access
 * Basic plan: 6 months of history
 * Professional plan: 2 years of history
 * Corporate plan: 5 years of history
 */
export async function fetchNewsDataArchive(
  keywords: string,
  fromDate: string, // Format: YYYY-MM-DD
  toDate?: string,   // Format: YYYY-MM-DD (defaults to today)
  category?: string
): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWSDATA_API_KEY;

  if (!apiKey) {
    console.warn('NEWSDATA_API_KEY not configured, skipping NewsData.io Archive');
    return [];
  }

  try {
    const params = new URLSearchParams({
      apikey: apiKey,
      q: keywords,
      country: 'au',
      language: 'en',
      from_date: fromDate,
    });

    if (toDate) {
      params.append('to_date', toDate);
    }

    if (category && category !== 'all') {
      params.append('category', category);
    }

    console.log(`Fetching archive from ${fromDate} to ${toDate || 'today'} for keywords: ${keywords}`);

    const response = await fetch(
      `https://newsdata.io/api/1/archive?${params.toString()}`,
      {
        headers: {
          'User-Agent': 'Political-Strategy-Workbench/1.0',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Check if it's a free tier limitation error
      if (response.status === 403 || response.status === 426) {
        console.warn('NewsData.io Archive API requires paid plan. Falling back to latest news.');
        return [];
      }

      throw new Error(`NewsData.io Archive API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(`NewsData.io Archive error: ${data.results?.message || 'Unknown error'}`);
    }

    const articles: NewsArticle[] = (data.results || []).map((item: any, index: number) => ({
      id: item.article_id || `archive-${index}`,
      title: item.title,
      source: item.source_name || item.source_id,
      category: item.category?.[0] || category || 'politics',
      publishedAt: item.pubDate,
      summary: item.description || item.content || '',
      url: item.link,
      relevanceScore: calculateRelevanceScore(item),
      imageUrl: item.image_url,
      sourceIcon: item.source_icon,
    }));

    console.log(`Retrieved ${articles.length} articles from archive`);
    return articles;
  } catch (error) {
    console.error('Error fetching NewsData.io Archive:', error);
    return [];
  }
}

/**
 * Search historical news with comprehensive filters
 * This is the main search function for the advanced search page
 */
export async function searchHistoricalNews(
  keywords?: string,
  fromDate?: string,
  toDate?: string,
  category?: string
): Promise<NewsArticle[]> {
  console.log('Searching historical news with filters:', { keywords, fromDate, toDate, category });

  // If no date range specified, fetch latest news
  if (!fromDate) {
    console.log('No date range specified, fetching latest news');
    if (keywords) {
      return fetchNewsDataIO(keywords, category || 'politics');
    }
    return fetchNewsByCategory((category as any) || 'all');
  }

  // If date range specified, use Archive API
  const archiveArticles = await fetchNewsDataArchive(
    keywords || 'parliament OR minister OR policy OR government',
    fromDate,
    toDate,
    category
  );

  // Deduplicate and sort
  const uniqueArticles = deduplicateArticles(archiveArticles);

  uniqueArticles.sort((a, b) => {
    const scoreDiff = b.relevanceScore - a.relevanceScore;
    if (Math.abs(scoreDiff) > 0.1) {
      return scoreDiff;
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return uniqueArticles;
}

/**
 * Fetch news by specific category
 */
export async function fetchNewsByCategory(
  category: 'all' | 'politics' | 'federal-politics' | 'business' | 'regulation'
): Promise<NewsArticle[]> {
  if (category === 'all') {
    return aggregateAustralianPoliticalNews();
  }

  if (category === 'federal-politics') {
    const [abcFederal, newsdataPolitics] = await Promise.all([
      fetchABCNews('federal'),
      fetchNewsDataIO('federal government OR parliament', 'politics'),
    ]);
    return deduplicateArticles([...abcFederal, ...newsdataPolitics]);
  }

  if (category === 'politics') {
    return aggregateAustralianPoliticalNews('parliament OR minister OR policy');
  }

  if (category === 'business') {
    const [abcBusiness, newsdataBusiness] = await Promise.all([
      fetchABCNews('business'),
      fetchNewsDataIO(undefined, 'business'),
    ]);
    return deduplicateArticles([...abcBusiness, ...newsdataBusiness]);
  }

  return aggregateAustralianPoliticalNews();
}
