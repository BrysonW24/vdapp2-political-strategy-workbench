import { IsString, IsNotEmpty, IsEnum, IsNumber, Min, Max, IsOptional, IsArray } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export enum AnalysisType {
  SUMMARY = 'SUMMARY',
  SENTIMENT = 'SENTIMENT',
  KEY_POINTS = 'KEY_POINTS',
  TREND = 'TREND',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  OPPORTUNITY = 'OPPORTUNITY',
}

export enum Sentiment {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL',
  MIXED = 'MIXED',
}

export class CreateAnalysisDto {
  @ApiProperty({ description: 'Article ID to analyze' })
  @IsString()
  @IsNotEmpty()
  articleId: string

  @ApiProperty({ enum: AnalysisType, description: 'Type of analysis' })
  @IsEnum(AnalysisType)
  analysisType: AnalysisType

  @ApiProperty({ description: 'Analysis summary' })
  @IsString()
  @IsNotEmpty()
  summary: string

  @ApiProperty({ description: 'Key points from analysis', type: [String] })
  @IsArray()
  @IsString({ each: true })
  keyPoints: string[]

  @ApiProperty({ enum: Sentiment, description: 'Sentiment of the analysis' })
  @IsEnum(Sentiment)
  sentiment: Sentiment

  @ApiProperty({ description: 'Confidence score (0-1)', minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  metadata?: Record<string, any>
}
