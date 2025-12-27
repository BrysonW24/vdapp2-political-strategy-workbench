import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { NewsAggregationService } from './news-aggregation.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('News Aggregation')
@Controller('news-aggregation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NewsAggregationController {
  constructor(private readonly newsAggregationService: NewsAggregationService) {}

  @Get('sources')
  @ApiOperation({ summary: 'Get available news sources' })
  getAvailableSources() {
    return {
      sources: this.newsAggregationService.getAvailableSources(),
    }
  }

  @Get('fetch')
  @ApiOperation({ summary: 'Fetch latest news from all sources' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async fetchNews(
    @Query('category') category?: string,
    @Query('limit') limit?: string,
  ) {
    const newsLimit = limit ? parseInt(limit, 10) : 10
    const news = await this.newsAggregationService.fetchFromAllSources(
      category,
      newsLimit,
    )

    return {
      count: news.length,
      news,
    }
  }

  @Get('fetch/source')
  @ApiOperation({ summary: 'Fetch news from a specific source' })
  @ApiQuery({ name: 'source', required: true })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async fetchFromSource(
    @Query('source') source: string,
    @Query('category') category?: string,
    @Query('limit') limit?: string,
  ) {
    const newsLimit = limit ? parseInt(limit, 10) : 10
    const news = await this.newsAggregationService.fetchFromSource(
      source,
      category,
      newsLimit,
    )

    return {
      source,
      count: news.length,
      news,
    }
  }

  @Post('fetch-and-store')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fetch and store news articles to database' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async fetchAndStore(
    @Query('category') category?: string,
    @Query('limit') limit?: string,
  ) {
    const newsLimit = limit ? parseInt(limit, 10) : 10
    const stored = await this.newsAggregationService.fetchAndStore(
      category,
      newsLimit,
    )

    return {
      message: 'News articles fetched and stored successfully',
      stored,
    }
  }

  @Post('trigger-fetch')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manually trigger scheduled news fetch' })
  async triggerScheduledFetch() {
    await this.newsAggregationService.scheduledNewsFetch()

    return {
      message: 'Scheduled news fetch triggered successfully',
    }
  }
}
