import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString, IsUrl } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export enum ArticleCategory {
  POLITICS = 'POLITICS',
  BUSINESS = 'BUSINESS',
  TECHNOLOGY = 'TECHNOLOGY',
  SOCIAL = 'SOCIAL',
  ENVIRONMENT = 'ENVIRONMENT',
  INTERNATIONAL = 'INTERNATIONAL',
  OTHER = 'OTHER',
}

export class CreateNewsArticleDto {
  @ApiProperty({ description: 'Article title' })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ description: 'Article content' })
  @IsString()
  @IsNotEmpty()
  content: string

  @ApiProperty({ description: 'Source name' })
  @IsString()
  @IsNotEmpty()
  source: string

  @ApiProperty({ description: 'Source URL', required: false })
  @IsUrl()
  @IsOptional()
  sourceUrl?: string

  @ApiProperty({ description: 'Published date' })
  @IsDateString()
  publishedAt: string

  @ApiProperty({ enum: ArticleCategory, description: 'Article category' })
  @IsEnum(ArticleCategory)
  category: ArticleCategory

  @ApiProperty({ description: 'Article tags', required: false, type: [String] })
  @IsOptional()
  @IsString({ each: true })
  tags?: string[]
}
