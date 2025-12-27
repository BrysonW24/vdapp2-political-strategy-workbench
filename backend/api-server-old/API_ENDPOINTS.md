# API Endpoints Documentation

**Political Strategy Workbench API** - Available Routes & Screens

---

## Access the API

- **Base URL:** `http://localhost:3001`
- **Swagger UI:** `http://localhost:3001/api/docs` - Interactive API documentation
- **Health Check:** `http://localhost:3001/api/health`
- **Database Admin:** `http://localhost:8080` (Adminer - development only)

---

## Authentication & Security

- **Global Protection:** All endpoints require JWT authentication by default
- **Public Endpoints:** Marked with `🌐` (no auth required)
- **Admin Only:** Marked with `👑` (requires ADMIN role)
- **Bearer Token:** Include in header: `Authorization: Bearer <token>`

---

## 📋 Table of Contents

1. [Health & Monitoring](#health--monitoring)
2. [Authentication](#authentication)
3. [User Management](#user-management)
4. [News Articles](#news-articles)
5. [News Aggregation](#news-aggregation)
6. [Analysis](#analysis)
7. [Campaigns](#campaigns)

---

## Health & Monitoring

### GET `/api/health` 🌐
**Check API server health**
- **Public:** Yes
- **Response:**
  ```json
  {
    "status": "ok",
    "timestamp": "2024-12-24T10:30:00.000Z"
  }
  ```

### GET `/api/docs` 🌐
**Interactive Swagger API documentation**
- **Public:** Yes
- **Access:** Open `http://localhost:3001/api/docs` in browser

---

## Authentication

### POST `/api/auth/register` 🌐
**Register a new user account**
- **Public:** Yes
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "createdAt": "2024-12-24T10:30:00.000Z"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
  ```
- **Triggers:** Welcome email sent to user

### POST `/api/auth/login` 🌐
**Login with email and password**
- **Public:** Yes
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "user": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
  ```

### POST `/api/auth/refresh` 🌐
**Refresh access token using refresh token**
- **Public:** Yes
- **Request Body:**
  ```json
  {
    "refreshToken": "eyJhbGc..."
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "user": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
  ```

### POST `/api/auth/logout` 🔐
**Logout and invalidate refresh token**
- **Protected:** Yes
- **Request Body:**
  ```json
  {
    "refreshToken": "eyJhbGc..."
  }
  ```
- **Response:** `204 No Content`

### POST `/api/auth/me` 🔐
**Get current authenticated user**
- **Protected:** Yes
- **Response:** `200 OK`
  ```json
  {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  }
  ```

---

## User Management

### POST `/api/users` 🔐
**Create a new user**
- **Protected:** Yes
- **Request Body:**
  ```json
  {
    "email": "newuser@example.com",
    "password": "SecurePassword123!",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "USER"
  }
  ```
- **Response:** `201 Created`

### GET `/api/users` 🔐👑
**Get all users (Admin only)**
- **Protected:** Yes (Admin role required)
- **Response:** `200 OK`
  ```json
  [
    {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "createdAt": "2024-12-24T10:30:00.000Z"
    }
  ]
  ```

### GET `/api/users/:id` 🔐
**Get user by ID**
- **Protected:** Yes
- **Params:** `id` - User UUID
- **Response:** `200 OK`

### PATCH `/api/users/:id` 🔐
**Update user information**
- **Protected:** Yes
- **Params:** `id` - User UUID
- **Request Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Updated"
  }
  ```
- **Response:** `200 OK`

### DELETE `/api/users/:id` 🔐👑
**Delete user (Admin only)**
- **Protected:** Yes (Admin role required)
- **Params:** `id` - User UUID
- **Response:** `200 OK`

---

## News Articles

### POST `/news-articles` 🔐
**Create a new news article**
- **Protected:** Yes
- **Request Body:**
  ```json
  {
    "title": "Breaking: Major Political Development",
    "content": "Full article content...",
    "source": "ABC News",
    "url": "https://example.com/article",
    "publishedAt": "2024-12-24T10:00:00.000Z",
    "category": "POLITICS"
  }
  ```
- **Response:** `201 Created`

### GET `/news-articles` 🔐
**Get all news articles with filtering**
- **Protected:** Yes
- **Query Params:**
  - `category` - Filter by category (optional)
  - `source` - Filter by source (optional)
  - `search` - Search in title/content (optional)
  - `limit` - Number of results (optional)
  - `offset` - Pagination offset (optional)
- **Example:** `/news-articles?category=POLITICS&limit=20`
- **Response:** `200 OK`

### GET `/news-articles/:id` 🔐
**Get a single news article by ID**
- **Protected:** Yes
- **Params:** `id` - Article UUID
- **Response:** `200 OK`

### PATCH `/news-articles/:id` 🔐
**Update a news article**
- **Protected:** Yes
- **Params:** `id` - Article UUID
- **Request Body:** Partial article data
- **Response:** `200 OK`

### DELETE `/news-articles/:id` 🔐
**Delete a news article**
- **Protected:** Yes
- **Params:** `id` - Article UUID
- **Response:** `200 OK`

---

## News Aggregation

### GET `/news-aggregation/sources` 🔐
**Get available Australian news sources**
- **Protected:** Yes
- **Response:** `200 OK`
  ```json
  {
    "sources": [
      {
        "id": "abc-news",
        "name": "ABC News",
        "categories": ["politics", "world", "business", "sport"]
      },
      {
        "id": "the-guardian",
        "name": "The Guardian Australia",
        "categories": ["australia-news", "world", "politics"]
      },
      {
        "id": "news-com-au",
        "name": "News.com.au",
        "categories": ["national", "world", "politics"]
      }
    ]
  }
  ```

### GET `/news-aggregation/fetch` 🔐
**Fetch latest news from all sources**
- **Protected:** Yes
- **Query Params:**
  - `category` - Filter by category (optional)
  - `limit` - Number of articles per source (default: 10)
- **Example:** `/news-aggregation/fetch?category=politics&limit=20`
- **Response:** `200 OK`
  ```json
  {
    "count": 60,
    "news": [
      {
        "title": "Article title",
        "description": "Article description",
        "url": "https://...",
        "source": "ABC News",
        "publishedAt": "2024-12-24T10:00:00.000Z",
        "category": "politics"
      }
    ]
  }
  ```

### GET `/news-aggregation/fetch/source` 🔐
**Fetch news from a specific source**
- **Protected:** Yes
- **Query Params:**
  - `source` - Source ID (required): `abc-news`, `the-guardian`, or `news-com-au`
  - `category` - Filter by category (optional)
  - `limit` - Number of articles (default: 10)
- **Example:** `/news-aggregation/fetch/source?source=abc-news&category=politics`
- **Response:** `200 OK`

### POST `/news-aggregation/fetch-and-store` 🔐
**Fetch and save news articles to database**
- **Protected:** Yes
- **Query Params:**
  - `category` - Filter by category (optional)
  - `limit` - Number of articles per source (default: 10)
- **Response:** `200 OK`
  ```json
  {
    "message": "News articles fetched and stored successfully",
    "stored": 45
  }
  ```

### POST `/news-aggregation/trigger-fetch` 🔐
**Manually trigger scheduled news fetch**
- **Protected:** Yes
- **Description:** Triggers the automated news aggregation job
- **Response:** `200 OK`
  ```json
  {
    "message": "Scheduled news fetch triggered successfully"
  }
  ```

---

## Analysis

### POST `/analysis` 🔐
**Create AI analysis for a news article**
- **Protected:** Yes
- **Request Body:**
  ```json
  {
    "articleId": "article-uuid",
    "analysisType": "SENTIMENT",
    "content": "This article shows strong positive sentiment...",
    "metadata": {
      "sentimentScore": 0.8,
      "keywords": ["election", "campaign", "victory"]
    }
  }
  ```
- **Response:** `201 Created`

### GET `/analysis/article/:articleId` 🔐
**Get all analyses for a specific article**
- **Protected:** Yes
- **Params:** `articleId` - Article UUID
- **Response:** `200 OK`
  ```json
  [
    {
      "id": "analysis-uuid",
      "articleId": "article-uuid",
      "analysisType": "SENTIMENT",
      "content": "Analysis content...",
      "createdAt": "2024-12-24T10:30:00.000Z"
    }
  ]
  ```

### GET `/analysis/:id` 🔐
**Get a single analysis by ID**
- **Protected:** Yes
- **Params:** `id` - Analysis UUID
- **Response:** `200 OK`

### DELETE `/analysis/:id` 🔐
**Delete an analysis**
- **Protected:** Yes
- **Params:** `id` - Analysis UUID
- **Response:** `200 OK`

---

## Campaigns

### POST `/campaigns` 🔐
**Create a new campaign**
- **Protected:** Yes
- **Request Body:**
  ```json
  {
    "name": "2024 Election Campaign",
    "description": "Main campaign strategy for 2024",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.000Z",
    "status": "ACTIVE"
  }
  ```
- **Response:** `201 Created`

### GET `/campaigns` 🔐
**Get all campaigns for current user**
- **Protected:** Yes
- **Response:** `200 OK`
  ```json
  [
    {
      "id": "campaign-uuid",
      "name": "2024 Election Campaign",
      "description": "Main campaign strategy",
      "status": "ACTIVE",
      "strategies": []
    }
  ]
  ```

### GET `/campaigns/:id` 🔐
**Get a single campaign by ID**
- **Protected:** Yes
- **Params:** `id` - Campaign UUID
- **Response:** `200 OK`

### PATCH `/campaigns/:id` 🔐
**Update a campaign**
- **Protected:** Yes
- **Params:** `id` - Campaign UUID
- **Request Body:** Partial campaign data
- **Response:** `200 OK`

### DELETE `/campaigns/:id` 🔐
**Delete a campaign**
- **Protected:** Yes
- **Params:** `id` - Campaign UUID
- **Response:** `200 OK`

### POST `/campaigns/:id/strategies` 🔐
**Add a strategy to a campaign**
- **Protected:** Yes
- **Params:** `id` - Campaign UUID
- **Request Body:**
  ```json
  {
    "name": "Social Media Outreach",
    "description": "Focus on Instagram and Facebook ads",
    "type": "DIGITAL_MARKETING",
    "priority": "HIGH"
  }
  ```
- **Response:** `201 Created`

### PATCH `/campaigns/strategies/:strategyId` 🔐
**Update a strategy**
- **Protected:** Yes
- **Params:** `strategyId` - Strategy UUID
- **Request Body:** Partial strategy data
- **Response:** `200 OK`

### DELETE `/campaigns/strategies/:strategyId` 🔐
**Delete a strategy**
- **Protected:** Yes
- **Params:** `strategyId` - Strategy UUID
- **Response:** `200 OK`

---

## Quick Start Guide

### 1. Start the API Server

**Using Docker (Recommended):**
```bash
docker-compose up
```

**Using npm:**
```bash
npm install
npm run db:setup
npm run start:dev
```

### 2. Access Swagger UI

Open `http://localhost:3001/api/docs` in your browser for interactive API documentation.

### 3. Register a User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

### 4. Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!"
  }'
```

**Save the `accessToken` from the response!**

### 5. Make Authenticated Requests

```bash
curl -X GET http://localhost:3001/news-articles \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 6. Fetch Australian News

```bash
curl -X POST http://localhost:3001/news-aggregation/fetch-and-store?limit=20 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Database Admin UI (Development)

**Adminer** is available in development mode:

1. Start services: `docker-compose -f docker-compose.dev.yml up`
2. Open `http://localhost:8080`
3. Login:
   - **System:** PostgreSQL
   - **Server:** postgres
   - **Username:** postgres
   - **Password:** postgres
   - **Database:** political_strategy_db

---

## Error Responses

All endpoints follow standard HTTP status codes:

### Success Codes
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Successful with no content (e.g., logout)

### Error Codes
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - Authenticated but lacking permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists (e.g., duplicate email)
- `500 Internal Server Error` - Server error

### Error Response Format
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "email must be a valid email"
    }
  ]
}
```

---

## Rate Limiting

- **Throttling:** 100 requests per 60 seconds per IP
- **Header:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Response:** `429 Too Many Requests` when limit exceeded

---

## Development Tools

### Health Check
```bash
curl http://localhost:3001/api/health
```

### View Logs
```bash
docker-compose logs -f api
```

### Database Migrations
```bash
npm run prisma:migrate dev
```

### Generate Prisma Client
```bash
npm run prisma:generate
```

---

## Production Deployment

### Environment Variables

See [`.env.example`](.env.example) for all required environment variables:

**Critical Production Settings:**
- `NODE_ENV=production`
- `JWT_SECRET` - Strong random string (min 32 chars)
- `DATABASE_URL` - Production PostgreSQL connection
- `REDIS_PASSWORD` - Strong Redis password
- `CORS_ORIGIN` - Your frontend domain
- `EMAIL_*` - SMTP credentials for transactional emails

### Deploy with Docker
```bash
docker-compose up -d
```

### Health Check
```bash
curl https://your-domain.com/api/health
```

---

## Support & Documentation

- **Swagger UI:** Interactive API testing at `/api/docs`
- **Source Code:** Full TypeScript source with JSDoc comments
- **Prisma Schema:** Database schema at `prisma/schema.prisma`
- **Boss Mode Features:** See [BOSS_MODE_FEATURES.md](BOSS_MODE_FEATURES.md)
- **Applied Fixes:** See [FIXES_APPLIED.md](FIXES_APPLIED.md)

---

**Generated:** December 25, 2024
**API Version:** 1.0.0
**Framework:** NestJS 10.x with TypeScript
