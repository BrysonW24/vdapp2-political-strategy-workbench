import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ArticleCategory } from './create-news-article.dto'

export class QueryNewsArticleDto {
  @ApiPropertyOptional({ enum: ArticleCategory })
  @IsOptional()
  @IsEnum(ArticleCategory)
  category?: ArticleCategory

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  @ApiPropertyOptional({ default: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 20
}
