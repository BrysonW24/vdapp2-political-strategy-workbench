import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ScheduleModule } from '@nestjs/schedule'
import { NewsAggregationService } from './news-aggregation.service'
import { NewsAggregationController } from './news-aggregation.controller'
import { DatabaseModule } from '../../database/database.module'
import { ABCNewsProvider } from './providers/abc-news.provider'
import { GuardianAustraliaProvider } from './providers/guardian-au.provider'
import { NewsComAuProvider } from './providers/news-com-au.provider'

@Module({
  imports: [
    DatabaseModule,
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [NewsAggregationController],
  providers: [
    NewsAggregationService,
    ABCNewsProvider,
    GuardianAustraliaProvider,
    NewsComAuProvider,
  ],
  exports: [NewsAggregationService],
})
export class NewsAggregationModule {}
