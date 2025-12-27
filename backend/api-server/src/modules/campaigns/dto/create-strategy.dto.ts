import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum StrategyStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export class CreateStrategyDto {
  @ApiProperty({ description: 'Strategy title' })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ description: 'Strategy description' })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({ enum: Priority, required: false, default: 'MEDIUM' })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority

  @ApiProperty({ enum: StrategyStatus, required: false, default: 'DRAFT' })
  @IsEnum(StrategyStatus)
  @IsOptional()
  status?: StrategyStatus

  @ApiProperty({ description: 'Strategy metrics and KPIs', required: false })
  @IsOptional()
  metrics?: Record<string, any>
}
