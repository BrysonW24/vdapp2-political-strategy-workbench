# News Integration - Political Strategy Workbench

## Overview

The Political Strategy Workbench aggregates Australian political news from multiple authoritative sources to provide comprehensive coverage for government policy analysis.

## News Sources

### 1. ABC News (via RSS) ✅ **Active**
- **Source**: Australian Broadcasting Corporation
- **Method**: Public RSS feeds
- **Cost**: Free
- **Legal Status**: ✅ Fully legal - RSS feeds are publicly provided
- **Coverage**: Federal politics, parliament, government announcements
- **Update Frequency**: Real-time (polling every 15 minutes)
- **Authoritative**: Highest credibility for Australian government news

**Documentation**: [ABC_RSS.md](./ABC_RSS.md)

### 2. NewsData.io (via API) ✅ **Active**
- **Source**: 87,000+ global news sources
- **Method**: Licensed news aggregation API
- **Cost**: Free tier (200 credits/day), Paid plans from $199.99/month
- **Legal Status**: ✅ Fully legal - licensed content
- **Coverage**: Multiple Australian sources (SMH, AFR, Guardian AU, etc.)
- **Features**: AI sentiment analysis, tags, summaries (paid plans)
- **Australian Sources**: ABC, SMH, The Age, AFR, Guardian AU, News.com.au, etc.

**Documentation**: [NEWSDATA_API.md](./NEWSDATA_API.md)

### 3. The Guardian (via API) 📋 **Documented**
- **Source**: The Guardian Australia
- **Method**: Official Guardian API
- **Cost**: Free (500 requests/day)
- **Legal Status**: ✅ Fully legal - official API
- **Coverage**: Australian politics, international with AU angle
- **Features**: Excellent search, filtering, and metadata

**Documentation**: [GUARDIAN_API.md](./GUARDIAN_API.md)

## Current Implementation

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    News API Route                       │
│              /api/news?category=politics                │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│            News Aggregator Service                      │
│         (src/lib/news-aggregator.ts)                    │
└─────┬─────────────────────┬─────────────────────────────┘
      │                     │
      ▼                     ▼
┌────────────────┐    ┌─────────────────────────────────┐
│   ABC RSS      │    │      NewsData.io API            │
│   (Free)       │    │   (Optional - Paid/Free tier)   │
└────────────────┘    └─────────────────────────────────┘
      │                     │
      └──────────┬──────────┘
                 │
                 ▼
         ┌───────────────┐
         │ Deduplication │
         │ & Ranking     │
         └───────┬───────┘
                 │
                 ▼
         ┌───────────────┐
         │ News Articles │
         └───────────────┘
```

### Features

1. **Dual-Source Aggregation**
   - Combines ABC RSS (always available) + NewsData.io (optional)
   - Falls back to ABC-only if NewsData.io key not configured

2. **Smart Deduplication**
   - Removes duplicate articles across sources
   - Keeps highest-quality version (by relevance score)

3. **Relevance Scoring** (tiered system prioritizing authoritative sources)
   - **Tier 0**: ABC RSS: 0.95 (public broadcaster, highest trust)
   - **Tier 1**: Premium sources: 0.90-0.93
     - ABC News (NewsData.io): 0.93
     - Sydney Morning Herald: 0.92
     - Australian Financial Review: 0.91
     - The Guardian Australia: 0.90
   - **Tier 2**: Major networks: 0.85-0.89
     - The Age: 0.88
     - Nine News: 0.87
     - Seven News: 0.86
     - Brisbane Times: 0.85
   - **Tier 3**: Specialist/investigative: 0.80-0.84
     - The Conversation: 0.83
     - Crikey: 0.82
   - **Tier 4**: Other sources: 0.50-0.80 (based on NewsData.io source_priority)
   - **Bonus**: +0.02 for sentiment data, +0.02 for AI tags, +0.03 for political tags

4. **Category Filtering**
   - `all`: All Australian political news
   - `politics`: General political news
   - `federal-politics`: Federal government specific
   - `business`: Business/economic policy news
   - `regulation`: Regulatory and compliance news

## Setup

### 1. Install Dependencies
```bash
npm install rss-parser
```
✅ Already installed

### 2. Configure API Keys (Optional)

Copy the example environment file:
```bash
cp .env.local.example .env.local
```

Add your API keys to `.env.local`:
```bash
# Optional - NewsData.io for broader coverage
NEWSDATA_API_KEY=your_key_here

# Optional - Guardian API for additional sources
GUARDIAN_API_KEY=your_key_here
```

**Note**: ABC RSS works without any API keys!

### 3. Test the Integration

Visit the news page:
```
http://localhost:3000/news
```

Or test the API directly:
```
http://localhost:3000/api/news?category=federal-politics
```

## Usage

### Fetch News by Category

```typescript
// In your component or API route
import { fetchNewsByCategory } from '@/lib/news-aggregator';

// Get federal politics news
const articles = await fetchNewsByCategory('federal-politics');

// Get all political news
const allNews = await fetchNewsByCategory('all');
```

### Fetch from Specific Source

```typescript
import { fetchABCNews, fetchNewsDataIO } from '@/lib/news-aggregator';

// ABC only
const abcArticles = await fetchABCNews('federal');

// NewsData.io only (requires API key)
const newsdataArticles = await fetchNewsDataIO('parliament', 'politics');
```

### Aggregate from All Sources

```typescript
import { aggregateAustralianPoliticalNews } from '@/lib/news-aggregator';

// Get news from all sources with deduplication
const news = await aggregateAustralianPoliticalNews('digital government');
```

## API Response Format

```typescript
interface NewsArticle {
  id: string;
  title: string;
  source: string;           // e.g., "ABC News", "The Guardian"
  category: string;          // e.g., "politics", "federal-politics"
  publishedAt: string;       // ISO 8601 date
  summary: string;           // Article excerpt/description
  url: string;               // Original article URL
  relevanceScore: number;    // 0.0 - 1.0 (higher = more relevant)
  imageUrl?: string;         // Optional article image
  sourceIcon?: string;       // Optional source logo
}
```

## Legal Compliance

### ABC RSS ✅
- **Legal**: Yes - publicly provided RSS feeds
- **Terms**: Standard RSS usage (reasonable polling, attribution, linking back)
- **Commercial Use**: Non-commercial research/analysis is permitted
- **Attribution**: Always credit "ABC News" and link to original article

### NewsData.io ✅
- **Legal**: Yes - licensed API with commercial terms
- **Terms**: Based on subscription plan (Free/Basic/Professional/Corporate)
- **Commercial Use**: Allowed per plan terms
- **Attribution**: Source names and links provided in API response

### The Guardian ✅
- **Legal**: Yes - official public API
- **Terms**: Free tier (500 requests/day), attribution required
- **Commercial Use**: Permitted under API terms
- **Attribution**: "Powered by Guardian" + link to article

## Monitoring

### Check API Usage

**NewsData.io Dashboard**:
```
https://newsdata.io/dashboard
```

**The Guardian Dashboard**:
```
https://open-platform.theguardian.com/access/
```

### Server Logs

```bash
# Check news aggregation logs
tail -f logs/news-aggregator.log

# You'll see:
# "Fetching Australian political news from multiple sources..."
# "Aggregated 42 unique articles (15 from ABC, 27 from NewsData.io)"
```

## Cost Analysis

### Free Tier (No API Keys)
- **ABC RSS**: Unlimited, free
- **Cost**: $0/month
- **Articles**: ~50-100 new articles/day from ABC
- **Best For**: Development, testing, small-scale use

### Basic Plan (NewsData.io)
- **ABC RSS**: Unlimited, free
- **NewsData.io**: $199.99/month (20,000 credits = ~1M articles)
- **Cost**: $199.99/month
- **Articles**: Unlimited from ABC + ~1M articles/month from NewsData.io
- **Best For**: Production use with moderate traffic

### Professional Plan (NewsData.io)
- **ABC RSS**: Unlimited, free
- **NewsData.io**: $349.99/month (50,000 credits)
- **Features**: +AI sentiment analysis, +AI tags, +2 year archives
- **Cost**: $349.99/month
- **Best For**: Advanced political analysis requiring sentiment data

## Troubleshooting

### No Articles Returned

**Check**:
1. ABC RSS feed accessible: `curl https://www.abc.net.au/news/feed/51120/rss.xml`
2. NewsData.io API key valid (if configured)
3. Network connectivity
4. Server logs for errors

### Duplicate Articles

The deduplication algorithm compares title similarity. If you see duplicates:
- Check `normalizeTitle()` function in `news-aggregator.ts`
- Adjust similarity threshold if needed

### Low Relevance Scores

Relevance scores are based on:
- Source authority (ABC = 0.95, others vary)
- Source priority from NewsData.io
- Presence of AI tags and sentiment

To adjust scoring, modify `calculateRelevanceScore()` in `news-aggregator.ts`.

### AFR Articles Not Appearing

**Issue**: Australian Financial Review (AFR) articles don't appear in news results despite being listed in NewsData.io sources.

**Cause**:
- AFR is available in NewsData.io (source_id: `afr`, priority: 45,911)
- Free tier returns only 10 results per query
- AFR priority is too low to make top 10 in free tier results
- AFR does not provide public RSS feeds (all endpoints return 404)

**Solutions**:

1. **Upgrade to NewsData.io Basic Plan** ($199.99/month)
   - 20,000 credits/month (~1M articles)
   - Can use `prioritydomain` parameter to filter for AFR specifically
   - Full article content available
   - **Recommended for production use**

2. **Accept Current Coverage** (Free)
   - Current sources (ABC, SMH, The Age, 9News) cover same political stories as AFR
   - AFR scoring already implemented (0.91 relevance) - will work when articles appear
   - No additional cost

3. **Third-Party RSS Generators** (Not Recommended)
   - Services like FeedSpot can create AFR feeds
   - May violate AFR terms of service
   - Unreliable for production use

## Historical Search with Archive API

### Overview

The advanced search page now supports historical news searching using the NewsData.io Archive API. This allows you to search through months or years of historical articles based on your subscription plan.

### How It Works

**Free Tier (No Archive Access):**
- Searches only the latest ~35 articles from current feeds
- Date range filters are ignored
- Falls back to regular latest news API
- Best for: Real-time news monitoring

**Paid Plans (Archive Access):**
- **Basic Plan** ($199.99/month): 6 months of historical data
- **Professional Plan** ($349.99/month): 2 years of historical data
- **Corporate Plan** ($899.99/month): 5 years of historical data
- Search by keywords, date range, category, and source
- Returns hundreds of results per query

### Using Advanced Search

Navigate to `/news/search` and:

1. **Quick Search (No Dates):**
   - Leave date fields blank
   - Searches latest ~35 articles (free tier)
   - Works with all filters (keywords, category, source)

2. **Historical Search (With Dates):**
   - Enter "From Date" and "To Date" (format: YYYY-MM-DD)
   - Requires paid NewsData.io plan
   - Searches archive between those dates
   - Example: Search "china" from 2024-01-01 to 2025-12-26

3. **Automatic Fallback:**
   - If Archive API is not available (free tier or API error)
   - Automatically falls back to latest news search
   - Console logs will indicate whether archive was used

### API Endpoints

**Latest News (Free Tier):**
```bash
GET /api/news?category=politics&limit=50
```

**Historical Search (Paid Plan):**
```bash
GET /api/news/search?keywords=china&from_date=2024-01-01&to_date=2025-12-26&category=politics
```

### Code Example

```typescript
import { searchHistoricalNews } from '@/lib/news-aggregator';

// Search with date range (uses Archive API if available)
const articles = await searchHistoricalNews(
  'china',           // keywords
  '2024-01-01',      // from_date
  '2025-12-26',      // to_date
  'politics'         // category
);

// Search without dates (uses latest news API)
const latestArticles = await searchHistoricalNews(
  'parliament',      // keywords
  undefined,         // no from_date
  undefined,         // no to_date
  'politics'         // category
);
```

## Future Enhancements

- [x] Add NewsData.io Archive API for historical search
- [ ] Add Guardian API integration
- [ ] Implement caching layer (Redis/memory)
- [ ] Sentiment trend analysis dashboard
- [ ] Real-time websocket updates for breaking news
- [ ] Topic clustering and categorisation
- [ ] Ministerial mentions tracking
- [ ] Policy keyword extraction

## Support

- **ABC RSS Issues**: Check [ABC_RSS.md](./ABC_RSS.md)
- **NewsData.io Issues**: Check [NEWSDATA_API.md](./NEWSDATA_API.md)
- **Guardian API Issues**: Check [GUARDIAN_API.md](./GUARDIAN_API.md)
