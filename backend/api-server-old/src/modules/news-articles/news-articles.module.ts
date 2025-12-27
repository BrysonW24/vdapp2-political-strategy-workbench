import { Module } from '@nestjs/common'
import { NewsArticlesService } from './news-articles.service'
import { NewsArticlesController } from './news-articles.controller'
import { DatabaseModule } from '../../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [NewsArticlesController],
  providers: [NewsArticlesService],
  exports: [NewsArticlesService],
})
export class NewsArticlesModule {}
