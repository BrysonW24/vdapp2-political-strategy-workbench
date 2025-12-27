# The Guardian Open Platform API Documentation

## Overview

The Guardian's Open Platform is a public web service that allows access to content from The Guardian, Observer, and guardian.co.uk. This document provides comprehensive information about using the Guardian API with the Political Strategy Workbench.

## API Key Information

**Your API Key**: `1832cf61-dd4f-4794-a74c-5e38fe454d27`

**Important**:
- Keep this key secure and don't commit it to version control
- Store it in the `.env` file as `GUARDIAN_API_KEY`
- The key is for development use - register for a production key at https://open-platform.theguardian.com/access/ before going live

## Base URL

```
https://content.guardianapis.com
```

## Endpoints

### 1. Content Search
Search for content with various filters.

**Endpoint**: `/search`

**Method**: GET

**Parameters**:
- `api-key` (required): Your API key
- `q`: Search query term
- `section`: Filter by section (e.g., politics, business)
- `tag`: Filter by tag
- `from-date`: Start date (YYYY-MM-DD)
- `to-date`: End date (YYYY-MM-DD)
- `page`: Page number (default: 1)
- `page-size`: Results per page (max: 50, default: 10)
- `order-by`: newest, oldest, relevance (default: relevance)
- `show-fields`: Comma-separated fields (headline,trailText,bodyText,thumbnail,byline)
- `edition`: au, uk, us, int (for Australian content use 'au')

**Example**:
```bash
curl "https://content.guardianapis.com/search?q=australian%20politics&edition=au&show-fields=headline,trailText,bodyText&api-key=YOUR_API_KEY"
```

### 2. Tags
Retrieve tags (keywords, contributors, etc.)

**Endpoint**: `/tags`

**Method**: GET

**Parameters**:
- `api-key` (required)
- `q`: Search term
- `type`: keyword, contributor, tone, etc.
- `page`: Page number
- `page-size`: Results per page

### 3. Sections
Get all sections available

**Endpoint**: `/sections`

**Method**: GET

**Parameters**:
- `api-key` (required)
- `q`: Search term

### 4. Editions
Get available editions

**Endpoint**: `/editions`

**Method**: GET

### 5. Single Item
Get a specific content item

**Endpoint**: `/{item-id}`

**Method**: GET

**Parameters**:
- `api-key` (required)
- `show-fields`: Fields to include

## Query Parameters Reference

### Show Fields
Control which fields are returned:

- `headline`: Article headline
- `trailText`: Short summary/standfirst
- `bodyText`: Full article text
- `body`: HTML body
- `thumbnail`: Thumbnail image URL
- `byline`: Author information
- `wordcount`: Word count
- `publication`: Publication date
- `lastModified`: Last modification date

**Example**:
```
show-fields=headline,trailText,bodyText,thumbnail,byline
```

### Filtering by Section

Common Australian sections:
- `australia-news`
- `australia-news/australian-politics`
- `business`
- `environment`
- `technology`
- `world`

### Filtering by Tags

Example tags for Australian content:
- `australia-news/australian-politics`
- `australia-news/coalition`
- `australia-news/labor`
- `australia-news/greens`
- `business/australia-business`
- `environment/climate-change`

## Response Structure

```json
{
  "response": {
    "status": "ok",
    "userTier": "developer",
    "total": 54717,
    "startIndex": 1,
    "pageSize": 10,
    "currentPage": 1,
    "pages": 5472,
    "orderBy": "newest",
    "results": [
      {
        "id": "politics/2024/...",
        "type": "article",
        "sectionId": "politics",
        "sectionName": "Politics",
        "webPublicationDate": "2024-01-15T10:30:00Z",
        "webTitle": "Article Title",
        "webUrl": "https://www.theguardian.com/...",
        "apiUrl": "https://content.guardianapis.com/...",
        "fields": {
          "headline": "Article Headline",
          "trailText": "Summary text",
          "bodyText": "Full article content...",
          "thumbnail": "https://media.guim.co.uk/...",
          "byline": "Author Name"
        },
        "isHosted": false,
        "pillarId": "pillar/news",
        "pillarName": "News"
      }
    ]
  }
}
```

## Australian Content - Specific Sections and Tags

### Key Sections for Australian Political News
- `australia-news` - General Australian news
- `australia-news/australian-politics` - Federal politics
- `australia-news/australian-immigration-and-asylum` - Immigration policy
- `australia-news/indigenous-australians` - Indigenous affairs
- `business/australia-business` - Australian business news
- `environment/australia-environment` - Environmental issues

### Political Tags
- `australia-news/labor` - Labor Party
- `australia-news/coalition` - Coalition
- `australia-news/greens` - Greens Party
- `australia-news/australian-election-2025` - Election coverage

## Rate Limits

**Development Tier**:
- 500 calls per day
- 5 calls per second

**Note**: Monitor your usage and implement caching to stay within limits. The News Aggregation service in this project is configured to fetch every 30 minutes to conserve API calls.

## Best Practices

1. **Cache Results**: Store fetched articles in the database to reduce API calls
2. **Use Specific Queries**: Filter by section, tags, and dates to get relevant content
3. **Request Only Needed Fields**: Use `show-fields` to minimize response size
4. **Handle Rate Limits**: Implement exponential backoff and retry logic
5. **Edition Parameter**: Always use `edition=au` for Australian content
6. **Date Filtering**: Use `from-date` to only fetch new content since last check

## Example Queries for Political Strategy Workbench

### Fetch Latest Australian Political News
```bash
curl "https://content.guardianapis.com/search?section=australia-news/australian-politics&edition=au&page-size=20&show-fields=headline,trailText,bodyText,thumbnail,byline&order-by=newest&api-key=YOUR_API_KEY"
```

### Search for Specific Topic
```bash
curl "https://content.guardianapis.com/search?q=climate%20policy&section=australia-news&edition=au&show-fields=headline,trailText,bodyText&api-key=YOUR_API_KEY"
```

### Fetch Business News
```bash
curl "https://content.guardianapis.com/search?section=business&edition=au&page-size=20&show-fields=headline,trailText,bodyText&order-by=newest&api-key=YOUR_API_KEY"
```

### Get Content Since Specific Date
```bash
curl "https://content.guardianapis.com/search?section=australia-news&from-date=2024-01-01&edition=au&show-fields=headline,bodyText&api-key=YOUR_API_KEY"
```

## Integration with Political Strategy Workbench

The Guardian API is integrated into the News Aggregation module at:
- **Provider**: `src/modules/news-aggregation/providers/guardian-au.provider.ts`
- **Service**: `src/modules/news-aggregation/news-aggregation.service.ts`

### How It Works

1. **Scheduled Fetching**: The service runs every 30 minutes via Cron job
2. **Category-Based Queries**: Fetches content for politics, business, and technology
3. **Field Selection**: Retrieves headline, bodyText, thumbnail, and byline
4. **Edition Filter**: Uses Australian edition for relevant content
5. **Deduplication**: Checks existing articles by sourceUrl and title before storing
6. **Database Storage**: Stores articles in `news_articles` table via Prisma

### Testing the Integration

```bash
# Set the API key in .env file
echo "GUARDIAN_API_KEY=1832cf61-dd4f-4794-a74c-5e38fe454d27" >> .env

# Test the Guardian provider directly
curl -X GET "http://localhost:3001/api/news-aggregation/fetch?source=guardian&category=politics&limit=5"

# Fetch from all sources
curl -X GET "http://localhost:3001/api/news-aggregation/fetch?category=politics&limit=10"

# Check recent articles
curl -X GET "http://localhost:3001/api/news-aggregation/recent?hours=24"
```

## Error Handling

Common errors and solutions:

### 401 Unauthorized
- **Cause**: Invalid or missing API key
- **Solution**: Check that `GUARDIAN_API_KEY` is correctly set in `.env`

### 403 Forbidden
- **Cause**: Rate limit exceeded
- **Solution**: Reduce frequency of requests, implement caching

### 400 Bad Request
- **Cause**: Invalid parameters
- **Solution**: Check date formats (YYYY-MM-DD), valid section names, parameter values

### 404 Not Found
- **Cause**: Invalid endpoint or content ID
- **Solution**: Verify the endpoint URL and content ID

## Resources

- **Official Documentation**: https://open-platform.theguardian.com/documentation/
- **API Explorer**: https://open-platform.theguardian.com/explore/
- **Register for API Key**: https://open-platform.theguardian.com/access/
- **Content API GitHub**: https://github.com/guardian/content-api-scala-client

## Support

For issues with the Guardian API:
- **Email**: api.support@theguardian.com
- **Google Group**: https://groups.google.com/forum/#!forum/guardian-api-talk

For issues with this integration:
- Check the logs in the News Aggregation service
- Review the provider implementation in `guardian-au.provider.ts`
- Verify environment variables are correctly set
