# NewsData.io API Documentation

## Overview

NewsData.io is a comprehensive News API that provides access to news articles from around the world, including extensive Australian news coverage. The platform aggregates news from over 87,287 sources across 206 countries in 89 languages, with access to over 100 million articles from 2018 to present.

**Official Documentation**: https://newsdata.io/documentation

## Australian Political News Coverage

NewsData.io provides excellent coverage for Australian political news with:
- Major Australian news sources (ABC, SMH, The Age, Australian Financial Review, etc.)
- Federal and state government news
- Parliamentary proceedings coverage
- Policy announcements and analysis
- Regional Australian news

## Pricing Plans

| Plan | Free | Basic | Professional | Corporate |
|------|------|-------|--------------|-----------|
| **Price** | Free | $199.99/month | $349.99/month | $1,299.99/month |
| **API Credits** | 200/day | 20,000/month | 50,000/month | 1,000,000/month |
| **Articles per Credit** | 10 | 50 | 50 | 50 |
| **Latest News API** | ✅ | ✅ | ✅ | ✅ |
| **News Archive API** | ❌ | ✅ (6 months) | ✅ (2 years) | ✅ (5 years) |
| **AI Summary** | ❌ | ✅ | ✅ | ✅ |
| **AI Tags** | ❌ | ❌ | ✅ | ✅ |
| **Sentiment Analysis** | ❌ | ❌ | ✅ | ✅ |
| **Full Content** | ❌ | ✅ | ✅ | ✅ |
| **Character Limit** | 100 | 100 | 256 | 512 |

**Recommendation for Political Strategy Workbench**: Basic or Professional plan
- Basic: Good for prototype and moderate usage (20K credits = 1M articles/month)
- Professional: Includes AI tags and sentiment analysis for better political content categorisation

## Authentication

NewsData.io uses API key authentication. Include your API key in every request:

**Method 1: Query Parameter**
```
https://newsdata.io/api/1/latest?apikey=YOUR_API_KEY&q=australia
```

**Method 2: Request Header**
```
X-ACCESS-KEY: YOUR_API_KEY
```

## Key Endpoints

### 1. Latest News API
Retrieves the most recent news articles.

```
GET https://newsdata.io/api/1/latest
```

**Parameters for Australian Political News:**
- `apikey` (required): Your API key
- `country`: `au` (Australia)
- `language`: `en` (English)
- `category`: `politics`, `business`, `top`
- `q`: Search keywords (e.g., "parliament", "minister", "policy")
- `qInTitle`: Search in titles only
- `domain`: Specific Australian domains
- `prioritydomain`: Priority domains for Australian sources
- `timeframe`: Time range in hours (e.g., `24` for last 24 hours)
- `page`: Pagination token from previous response

### 2. News Archive API
Access historical news (requires paid plan).

```
GET https://newsdata.io/api/1/archive
```

**Additional Parameters:**
- `from_date`: Start date (YYYY-MM-DD format)
- `to_date`: End date (YYYY-MM-DD format)

### 3. News Count API
Get article count matching criteria (requires paid plan).

```
GET https://newsdata.io/api/1/count
```

## Example Requests for Australian Political News

### Latest Australian Politics News
```bash
https://newsdata.io/api/1/latest?apikey=YOUR_API_KEY&country=au&category=politics&language=en
```

### Search for Specific Policy Topics
```bash
https://newsdata.io/api/1/latest?apikey=YOUR_API_KEY&country=au&q=digital%20government%20OR%20AI%20policy&language=en
```

### Recent Federal Government Announcements
```bash
https://newsdata.io/api/1/latest?apikey=YOUR_API_KEY&country=au&qInTitle=federal%20government&timeframe=48
```

### Historical Archive Search (Paid Plans)
```bash
https://newsdata.io/api/1/archive?apikey=YOUR_API_KEY&country=au&q=parliament&language=en&from_date=2025-12-01&to_date=2025-12-27
```

## Response Object

```json
{
  "status": "success",
  "totalResults": 185,
  "results": [
    {
      "article_id": "unique_article_id",
      "title": "Article Title",
      "link": "https://article-url.com",
      "keywords": ["politics", "government"],
      "creator": ["Author Name"],
      "video_url": null,
      "description": "Article description",
      "content": "Full article content (paid plans only)",
      "pubDate": "2025-12-27 03:00:00",
      "pubDateTZ": "UTC",
      "image_url": "https://image-url.com/image.jpg",
      "source_id": "source_identifier",
      "source_name": "Source Name",
      "source_priority": 5603,
      "source_url": "https://source.com",
      "source_icon": "https://icon-url.com/icon.png",
      "country": ["australia"],
      "category": ["politics"],
      "language": "english",
      "ai_tag": ["government"],  // Professional/Corporate only
      "sentiment": "neutral",    // Professional/Corporate only
      "sentiment_stats": {       // Professional/Corporate only
        "positive": 45.2,
        "neutral": 50.3,
        "negative": 4.5
      },
      "ai_region": ["australia, australia/oceania"],  // Corporate only
      "ai_org": ["Australian Parliament"],            // Corporate only
      "ai_summary": "AI-generated article summary",   // Paid plans only
      "duplicate": false,
      "fetched_at": "2025-12-27 03:05:31"
    }
  ],
  "nextPage": "next_page_token_here"
}
```

## Australian News Sources

NewsData.io provides access to **1,712 Australian news sources** as part of its global network of 87,287+ publishers across 206 countries.

### Coverage Statistics
- **Total Sources**: 87,287+ globally
- **Australian Sources**: 1,712
- **Countries Covered**: 206
- **Last Tracked**: December 21, 2025

### Global News Source Distribution (Top Countries)
1. **United States**: 21,219 sources
2. **India**: 8,384 sources
3. **Spain**: 6,321 sources
4. **United Kingdom**: 5,181 sources
5. **Italy**: 5,011 sources
6. **Germany**: 3,100 sources
7. **France**: 2,862 sources
8. **Canada**: 2,558 sources
9. **Mexico**: 2,068 sources
10. **Australia**: 1,712 sources

### Major Australian News Sources

NewsData.io includes these major Australian sources (lower `source_priority` = more authoritative):

| Priority | Source | Articles Fetched | Tracking Since | Domain |
|----------|--------|------------------|----------------|---------|
| 14 | Google News | 5,037,496 | March 2021 | news.google.com |
| 17 | Yahoo News | 3,062,599 | March 2021 | news.yahoo.com |
| 106 | The Guardian | 167,630 | February 2021 | theguardian.com |
| 341 | ESPN | 61,782 | February 2021 | espn.com |
| 2,251 | Sydney Morning Herald | — | — | smh.com.au |
| 3,795 | ABC News | — | — | abc.net.au |
| 22,163 | Brisbane Times | — | — | brisbanetimes.com.au |
| 23,845 | 7News | — | — | 7news.com.au |
| 44,145 | The Age | — | — | theage.com.au |
| 45,911 | Australian Financial Review | — | — | afr.com |
| 49,457 | PerthNow | — | — | perthnow.com.au |
| 88,737 | Canberra Times | — | — | canberratimes.com.au |
| 98,849 | The Nightly | — | — | thenightly.com.au |
| 106,740 | The West | — | — | thewest.com.au |

### Australian News Categories

When querying Australian news, use these category parameters:

- **politics**: Federal and state politics, government announcements
- **business**: Economic policy, business news, corporate affairs
- **top**: Breaking news and top headlines
- **environment**: Climate policy, environmental regulations
- **crime**: Law enforcement, court proceedings
- **sports**: Sports news (often includes political sports policy)
- **education**: Education policy, school funding
- **world**: International news with Australian angle

### Country Parameter
Use `country=AU` to filter for Australian news sources only.

### Example API Query for Australian Sources
```bash
# Get list of all Australian news sources
https://newsdata.io/api/1/sources?country=AU&apikey=pub_405548928a5144f5a9dedcda861e79da

# Get latest Australian political news
https://newsdata.io/api/1/latest?country=au&apikey=pub_405548928a5144f5a9dedcda861e79da
```

### Live Example Response
```json
{
  "status": "success",
  "totalResults": 4782,
  "results": [
    {
      "article_id": "7d0cf88eb728cafa983fdab3581cb6f5",
      "title": "Israel becomes first country to recognise Somaliland as sovereign state",
      "source_name": "Afr",
      "source_priority": 45911,
      "source_url": "https://www.afr.com",
      "source_icon": "https://n.bytvi.com/afr.png",
      "category": ["politics", "top"],
      "country": ["australia"],
      "sentiment": "positive",
      "sentiment_stats": {
        "negative": 0.13,
        "neutral": 2.17,
        "positive": 97.7
      },
      "ai_tag": ["government"],
      "pubDate": "2025-12-26 23:41:38"
    }
  ]
}
```

## Best Practices for Political Strategy Workbench

### 1. Efficient Querying
```javascript
// Combine multiple keywords with OR
const query = 'parliament OR minister OR policy OR "federal government"';

// Filter by category for political news
const category = 'politics';

// Use Australian country filter
const country = 'au';
```

### 2. Pagination
```javascript
let allArticles = [];
let nextPage = null;

do {
  const url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&country=au&category=politics${nextPage ? `&page=${nextPage}` : ''}`;
  const response = await fetch(url);
  const data = await response.json();

  allArticles = [...allArticles, ...data.results];
  nextPage = data.nextPage;
} while (nextPage && allArticles.length < 100);
```

### 3. Rate Limiting
```javascript
// Free tier: 200 credits/day = 2,000 articles/day max
// Basic tier: 20,000 credits/month ≈ 1M articles/month
// Implement request tracking
const requestsToday = getRequestCount();
const maxRequests = isPaidPlan ? 20000 : 200;

if (requestsToday >= maxRequests) {
  throw new Error('Daily/monthly limit reached');
}
```

### 4. Caching Strategy
```javascript
// Cache articles to reduce API calls
const cacheKey = `newsdata_${country}_${category}_${date}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const articles = await fetchFromNewsDataAPI();
await redis.setex(cacheKey, 3600, JSON.stringify(articles)); // Cache 1 hour
```

## Error Handling

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | Success | Request successful |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid or missing API key |
| 403 | Forbidden | Rate limit exceeded or restricted access |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

### Error Response Format
```json
{
  "status": "error",
  "results": {
    "message": "Error description",
    "code": "error_code"
  }
}
```

## Integration Example (TypeScript)

```typescript
// lib/newsdata.ts
interface NewsDataArticle {
  article_id: string;
  title: string;
  link: string;
  description: string;
  content?: string;
  pubDate: string;
  source_name: string;
  source_url: string;
  country: string[];
  category: string[];
  language: string;
  sentiment?: string;
  ai_summary?: string;
}

interface NewsDataResponse {
  status: 'success' | 'error';
  totalResults?: number;
  results?: NewsDataArticle[];
  nextPage?: string;
}

export async function fetchAustralianPoliticalNews(
  keywords?: string,
  timeframe?: number
): Promise<NewsDataArticle[]> {
  const params = new URLSearchParams({
    apikey: process.env.NEWSDATA_API_KEY!,
    country: 'au',
    category: 'politics',
    language: 'en',
  });

  if (keywords) {
    params.append('q', keywords);
  }

  if (timeframe) {
    params.append('timeframe', timeframe.toString());
  }

  const response = await fetch(
    `https://newsdata.io/api/1/latest?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`NewsData API error: ${response.status}`);
  }

  const data: NewsDataResponse = await response.json();

  if (data.status === 'error') {
    throw new Error('NewsData API returned error status');
  }

  return data.results || [];
}
```

## Environment Variables

```bash
# .env.local
NEWSDATA_API_KEY=your_api_key_here
NEWSDATA_PLAN=free  # or basic, professional, corporate
```

## Next Steps

1. **Sign up**: https://newsdata.io/register
2. **Get API key**: Access dashboard after email verification
3. **Test endpoint**: Start with free tier (200 credits/day)
4. **Integrate**: Use the example code above
5. **Monitor usage**: Track credits via dashboard
6. **Upgrade**: Move to Basic/Professional for production use

## Useful Links

- Official API Documentation: https://newsdata.io/documentation
- API Status Page: https://newsdata.io/status
- Support: https://newsdata.io/contact
- Dashboard: https://newsdata.io/dashboard

## Notes for Political Strategy Workbench

- Free tier (200 credits/day) is sufficient for prototyping and testing
- Basic tier ($199.99/month) recommended for production with moderate usage
- Professional tier ($349.99/month) adds AI sentiment analysis valuable for political content
- Use `category=politics` filter for government-focused content
- Combine with `country=au` for Australian-specific news
- Store articles locally to avoid repeated API calls for same content
- Monitor `source_priority` field to prioritise authoritative sources (ABC, SMH, etc.)
