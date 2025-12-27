# Political Strategy Workbench - API Server

AI Strategy Intelligence Workbench for political and business news analysis.

## Features

- **Authentication**: JWT-based authentication with refresh tokens
- **News Articles Management**: Create, read, update, and delete news articles
- **AI Analysis**: Generate and store AI-powered analyses of articles
- **Campaign Management**: Manage political/business campaigns and strategies
- **Role-Based Access Control**: Multiple user roles (USER, ADMIN, ANALYST, STRATEGIST)
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation

## Tech Stack

- **Framework**: NestJS 10
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Passport.js with JWT strategy
- **Validation**: class-validator and class-transformer
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14
- npm >= 9.0.0

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

4. Seed the database (optional):
```bash
npx prisma db seed
```

### Development

Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3001`
API Documentation: `http://localhost:3001/api/docs`

### Available Scripts

- `npm run start` - Start the production server
- `npm run start:dev` - Start development server with watch mode
- `npm run start:debug` - Start with debugging enabled
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests

### Prisma Commands

- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema without migrations

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout

### News Articles
- `GET /news-articles` - List all articles (with filtering)
- `GET /news-articles/:id` - Get article by ID
- `POST /news-articles` - Create new article
- `PATCH /news-articles/:id` - Update article
- `DELETE /news-articles/:id` - Delete article

### Analysis
- `POST /analysis` - Create analysis for an article
- `GET /analysis/article/:articleId` - Get all analyses for an article
- `GET /analysis/:id` - Get analysis by ID
- `DELETE /analysis/:id` - Delete analysis

### Campaigns
- `GET /campaigns` - List user's campaigns
- `GET /campaigns/:id` - Get campaign by ID
- `POST /campaigns` - Create new campaign
- `PATCH /campaigns/:id` - Update campaign
- `DELETE /campaigns/:id` - Delete campaign
- `POST /campaigns/:id/strategies` - Add strategy to campaign
- `PATCH /campaigns/strategies/:strategyId` - Update strategy
- `DELETE /campaigns/strategies/:strategyId` - Delete strategy

## Database Schema

### Models

- **User**: User accounts with authentication
- **NewsArticle**: Political and business news articles
- **Analysis**: AI-generated insights and analyses
- **Campaign**: Political/business campaigns
- **Strategy**: Campaign strategies and tactics
- **Tag**: Article categorization tags

See `prisma/schema.prisma` for complete schema definition.

## Security

- JWT token-based authentication
- Password hashing with bcrypt
- Helmet for HTTP headers security
- CORS configuration
- Input validation on all endpoints
- Role-based access control

## Testing

Run the test suite:
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Deployment

### Docker

Build and run with Docker:
```bash
docker build -t political-strategy-api .
docker run -p 3001:3001 political-strategy-api
```

### Environment Variables

Ensure all required environment variables are set in production:
- Use strong JWT secrets
- Configure production database
- Set appropriate CORS origins
- Enable production logging

## License

Private - All Rights Reserved
