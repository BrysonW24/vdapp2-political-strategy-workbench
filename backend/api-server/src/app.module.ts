import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { AuthModule } from './modules/auth/auth.module'
import { HealthModule } from './modules/health/health.module'
import { NewsArticlesModule } from './modules/news-articles/news-articles.module'
import { NewsAggregationModule } from './modules/news-aggregation/news-aggregation.module'
import { DatabaseModule } from './database/database.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard'

// SIMPLIFIED BACKEND - Removed unused modules:
// - UsersModule: Using static auth, no user management needed
// - EmailModule: Not used by frontend
// - AnalysisModule: Frontend uses mock AI data in Next.js API routes
// - CampaignsModule: Not used by frontend
// - LoggingInterceptor: Simplified logging to console only

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    HealthModule,
    NewsArticlesModule,
    NewsAggregationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
