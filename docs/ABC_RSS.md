# ABC News RSS Integration

## Overview

ABC News provides public RSS feeds for news consumption. This is **legal and encouraged** by ABC, as RSS feeds are explicitly published for syndication and consumption by news readers and applications.

## Legal Status

✅ **Safe to Use**:
- ABC News **provides RSS feeds publicly** for consumption
- RSS feeds are **intended for syndication** (that's their purpose)
- **Non-commercial use** is permitted under standard RSS practices
- We **attribute ABC News** as the source and **link back** to original articles
- We use **reasonable polling intervals** (every 15-30 minutes)
- We **don't republish full content** - only headlines and excerpts

## ABC News RSS Feeds

### Federal Politics
```
https://www.abc.net.au/news/topic/federal-politics/rss
```
Direct federal politics coverage - parliament, ministers, policies

### Politics (General)
```
https://www.abc.net.au/news/feed/51120/rss.xml
```
Broader political news including state politics

### Business
```
https://www.abc.net.au/news/feed/51638/rss.xml
```
Business and economic news relevant to government policy

### Latest News
```
https://www.abc.net.au/news/feed/45910/rss.xml
```
Breaking news from ABC

### More ABC RSS Feeds
Full list available at: https://www.abc.net.au/news/about/backstory/help/1948/rss-feeds/

## Best Practices

### 1. Reasonable Polling Intervals
```typescript
// Poll every 15-30 minutes (not every second!)
const POLLING_INTERVAL = 15 * 60 * 1000; // 15 minutes
```

### 2. Proper User-Agent
```typescript
const response = await fetch(feedUrl, {
  headers: {
    'User-Agent': 'Political-Strategy-Workbench/1.0 (Research Tool; +https://yoursite.com)',
  },
});
```

### 3. Error Handling
```typescript
try {
  const feed = await rssParser.parseURL(feedUrl);
} catch (error) {
  console.error('ABC RSS fetch failed:', error);
  // Fallback to cached data or other sources
}
```

### 4. Always Link Back
```typescript
// Always provide the original ABC article URL
article.url = item.link;
article.source = 'ABC News';
```

### 5. Caching
```typescript
// Cache RSS results to reduce requests
const cacheKey = `abc-rss-${category}-${new Date().toISOString().split('T')[0]}`;
const cached = await cache.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const fresh = await fetchABCRSS();
await cache.set(cacheKey, JSON.stringify(fresh), { ex: 900 }); // 15 min cache
```

## RSS Feed Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>ABC News - Federal Politics</title>
    <link>https://www.abc.net.au/news/topic/federal-politics</link>
    <description>Latest federal politics news from ABC News</description>
    <item>
      <title>Article Title</title>
      <link>https://www.abc.net.au/news/article-url</link>
      <description>Article summary or excerpt</description>
      <pubDate>Thu, 26 Dec 2025 03:00:00 GMT</pubDate>
      <guid>https://www.abc.net.au/news/article-url</guid>
      <media:thumbnail url="https://image-url.jpg"/>
      <media:content url="https://image-url.jpg"/>
    </item>
  </channel>
</rss>
```

## Implementation (Already Integrated)

The news aggregator at `src/lib/news-aggregator.ts` implements ABC RSS fetching with:

1. ✅ Proper attribution to ABC News
2. ✅ Links back to original articles
3. ✅ Reasonable request patterns
4. ✅ Error handling and fallbacks
5. ✅ Deduplication with other sources
6. ✅ Respects ABC's terms of use

## Why This Won't Get You In Trouble

### 1. **Published For Consumption**
ABC explicitly publishes RSS feeds for news readers, aggregators, and applications to consume.

### 2. **Standard Practice**
Every major news reader (Feedly, Inoreader, Apple News, Google News) uses RSS feeds this way.

### 3. **Drives Traffic Back**
You're linking to ABC's website, which **benefits ABC** by driving traffic.

### 4. **Non-Commercial Use**
Your political strategy workbench is a research/analysis tool, not competing with ABC.

### 5. **Industry Standard**
RSS syndication is a **standard web technology** specifically designed for this purpose.

## What NOT To Do

❌ **Don't**:
- Hammer their servers (keep polling intervals reasonable: 15+ minutes)
- Republish full articles without linking back
- Remove ABC attribution
- Use for commercial news republishing
- Bypass paywalls (RSS content is already free)
- Pretend content is your own

## Comparison: ABC RSS vs NewsData.io

| Feature | ABC RSS | NewsData.io |
|---------|---------|-------------|
| **Cost** | Free | Free tier limited, paid plans available |
| **Sources** | ABC News only | 87,000+ sources globally |
| **Australian Coverage** | Excellent (ABC authoritative) | Good (multiple AU sources) |
| **Legal Concerns** | None (public RSS) | None (licensed API) |
| **Rate Limits** | None (reasonable use) | 200 credits/day (free), more on paid |
| **Sentiment Analysis** | No | Yes (Professional plan) |
| **AI Tags** | No | Yes (Professional plan) |
| **Historical Data** | Limited to recent | Up to 5 years (Corporate plan) |
| **Setup Complexity** | Simple (just parse RSS) | Requires API key |

## Recommended Strategy

Use **both** for comprehensive coverage:

1. **ABC RSS**: Authoritative Australian government news (federal politics, parliament)
2. **NewsData.io**: Broader coverage including SMH, AFR, Guardian AU, regional news

This dual approach gives you:
- ✅ Maximum coverage of Australian political news
- ✅ High-quality authoritative ABC content
- ✅ Multiple perspectives from various sources
- ✅ Redundancy if one source fails
- ✅ All legal and properly licensed

## Monitoring and Compliance

### Check robots.txt
ABC's robots.txt allows RSS access:
```
https://www.abc.net.au/robots.txt
```

### Monitor Request Patterns
```typescript
// Log requests to ensure compliance
console.log(`ABC RSS request at ${new Date().toISOString()}`);
// Should see gaps of 15+ minutes between requests
```

### Track Attribution
Ensure every article shows:
- Source: "ABC News"
- Link: Original article URL
- Logo: ABC News logo (if displaying visually)

## Support

If ABC has concerns about your usage (extremely unlikely):
1. They'll contact you first
2. You can easily adjust polling intervals
3. RSS is designed for this - you're using it correctly

**In practice**: ABC wants their content distributed through RSS. That's why they provide the feeds.
