# The Guardian API Documentation

## Overview

This document provides context for using The Guardian API in the Political Strategy Workbench project.

## Authentication

- **API Key Required**: All requests must include your API key
- **Current API Key**: `1832cf61-dd4f-4794-a74c-5e38fe454d27`
- **Environment Variable**: `GUARDIAN_API_KEY` in `backend/api-server/.env`

## Base URL

```
https://content.guardianapis.com
```

## Key Endpoints Used in This Project

### 1. Content Search (`/search`)

Returns all pieces of content in the API.

**Example Request:**
```
GET https://content.guardianapis.com/search?api-key=YOUR_KEY&page-size=20&edition=au&order-by=newest&show-fields=headline,trailText,bodyText,thumbnail,byline
```

**Key Parameters:**
- `api-key`: Your API key (required)
- `page-size`: Number of results per page (default: 10, max: 50)
- `edition`: Edition to filter by (`au` for Australia)
- `order-by`: Sort order (`newest`, `oldest`, `relevance`)
- `show-fields`: Additional fields to include (comma-separated)
- `section`: Filter by section (e.g., `business`, `technology`)
- `from-date`: Filter from date (format: `YYYY-MM-DD`)
- `to-date`: Filter to date (format: `YYYY-MM-DD`)

**Available Fields:**
- `headline`: Article headline
- `trailText`: Article summary/trail text
- `bodyText`: Full article body text
- `thumbnail`: Thumbnail image URL
- `byline`: Author information
- `standfirst`: Article standfirst
- `shortUrl`: Short URL for the article
- `wordcount`: Word count

**Response Structure:**
```json
{
  "response": {
    "status": "ok",
    "total": 100,
    "startIndex": 1,
    "pageSize": 20,
    "currentPage": 1,
    "pages": 5,
    "orderBy": "newest",
    "results": [
      {
        "id": "world/2022/oct/21/article-id",
        "type": "article",
        "sectionId": "world",
        "sectionName": "World news",
        "webPublicationDate": "2022-10-21T14:06:14Z",
        "webTitle": "Article title",
        "webUrl": "https://www.theguardian.com/...",
        "apiUrl": "https://content.guardianapis.com/...",
        "fields": {
          "headline": "Article headline",
          "trailText": "Article summary",
          "bodyText": "Full article text...",
          "thumbnail": "https://...",
          "byline": "Author Name"
        }
      }
    ]
  }
}
```

## Sections Available

Common sections for Australian news:
- `australia-news` - General Australian news
- `australia-news/australian-politics` - Australian politics
- `business` - Business news
- `technology` - Technology news
- `environment` - Environment news
- `world` - International news

## Query Operators

The `q` parameter supports logical operators:

- **AND**: `debate AND economy` (both terms must be present)
- **OR**: `economy OR immigration` (either term present - default operator)
- **NOT**: `debate AND NOT immigration` (exclude terms)
- **Parentheses**: `debate AND (economy OR immigration)` (group expressions)
- **Phrase Search**: `"exact phrase"` (exact phrase match)

**Examples:**
```
q=climate%20change
q=climate%20AND%20(policy%20OR%20legislation)
q="renewable%20energy"
```

## Rate Limiting

- Free tier API keys have daily request limits
- Implement appropriate caching and request throttling
- Consider polling intervals (recommended: 30 minutes minimum)

## Implementation in This Project

### Location
`backend/api-server/src/modules/news-aggregation/providers/guardian-au.provider.ts`

### Key Features
1. **Category Mapping**: Maps internal categories to Guardian sections
   - `politics` → `australia-news/australian-politics`
   - `business` → `business`
   - `technology` → `technology`
   - `environment` → `environment`
   - `international` → `world`

2. **Fields Retrieved**:
   - `headline` - Article headline
   - `trailText` - Short summary
   - `bodyText` - Full article text
   - `thumbnail` - Image URL
   - `byline` - Author name

3. **Default Settings**:
   - Edition: `au` (Australian)
   - Order: `newest` first
   - Page size: 20 articles per request

### Example Usage

```typescript
// Fetch latest Australian political news
const news = await guardianProvider.fetchNews({
  category: 'politics',
  limit: 20
});

// Fetch business news from last week
const news = await guardianProvider.fetchNews({
  category: 'business',
  limit: 10,
  fromDate: new Date('2025-12-19')
});
```

## Error Handling

The provider handles:
- Missing API key (throws error with clear message)
- Network failures (logs error and throws)
- Invalid responses (logs and handles gracefully)

## Best Practices

1. **Always include API key**: Set `GUARDIAN_API_KEY` environment variable
2. **Use appropriate page sizes**: Don't request more than needed (max 50)
3. **Implement caching**: Store results to reduce API calls
4. **Handle rate limits**: Implement exponential backoff for retries
5. **Use specific sections**: Filter by section when possible for relevant results
6. **Request only needed fields**: Use `show-fields` to get only what you need

## Additional Resources

- Official API Documentation: https://open-platform.theguardian.com/documentation/
- API Explorer: https://open-platform.theguardian.com/explore/
- Get API Key: https://open-platform.theguardian.com/access/
- Support: https://groups.google.com/g/guardian-api-talk

## Common Issues

### Issue: "Guardian API key not set" warning
**Solution**: Ensure `GUARDIAN_API_KEY` is set in `backend/api-server/.env` file

### Issue: No results returned
**Solution**: Check that:
- API key is valid
- Section/category exists
- Date range is valid
- Edition is set correctly for Australian content

### Issue: Rate limit exceeded
**Solution**:
- Reduce polling frequency
- Implement caching
- Contact Guardian for higher rate limits if needed

## Testing

Test the Guardian API integration:

```bash
# Test with curl
curl "https://content.guardianapis.com/search?api-key=YOUR_KEY&edition=au&page-size=5&show-fields=headline,trailText"

# Test via backend endpoint
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3001/news-aggregation/fetch?category=politics
```
