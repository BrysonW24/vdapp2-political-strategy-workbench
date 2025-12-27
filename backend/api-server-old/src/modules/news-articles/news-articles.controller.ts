import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { NewsArticlesService } from './news-articles.service'
import { CreateNewsArticleDto } from './dto/create-news-article.dto'
import { UpdateNewsArticleDto } from './dto/update-news-article.dto'
import { QueryNewsArticleDto } from './dto/query-news-article.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('News Articles')
@Controller('news-articles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NewsArticlesController {
  constructor(private readonly newsArticlesService: NewsArticlesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new news article' })
  create(@Body() createNewsArticleDto: CreateNewsArticleDto) {
    return this.newsArticlesService.create(createNewsArticleDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all news articles with filtering' })
  findAll(@Query() query: QueryNewsArticleDto) {
    return this.newsArticlesService.findAll(query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single news article by ID' })
  findOne(@Param('id') id: string) {
    return this.newsArticlesService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a news article' })
  update(
    @Param('id') id: string,
    @Body() updateNewsArticleDto: UpdateNewsArticleDto,
  ) {
    return this.newsArticlesService.update(id, updateNewsArticleDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a news article' })
  remove(@Param('id') id: string) {
    return this.newsArticlesService.remove(id)
  }
}
