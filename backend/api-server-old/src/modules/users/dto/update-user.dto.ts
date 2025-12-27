import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator'
import { Role } from '@prisma/client'

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User email address',
    example: 'newemail@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiPropertyOptional({
    description: 'User password (minimum 8 characters)',
    example: 'NewSecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string

  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  firstName?: string

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  lastName?: string

  @ApiPropertyOptional({
    description: 'User role',
    enum: Role,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role

  @ApiPropertyOptional({
    description: 'Whether user account is active',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}
