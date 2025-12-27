import { IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export enum CampaignStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export class CreateCampaignDto {
  @ApiProperty({ description: 'Campaign name' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Campaign description' })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({ description: 'Campaign start date' })
  @IsDateString()
  startDate: string

  @ApiProperty({ description: 'Campaign end date', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string

  @ApiProperty({ enum: CampaignStatus, required: false, default: 'ACTIVE' })
  @IsEnum(CampaignStatus)
  @IsOptional()
  status?: CampaignStatus
}
