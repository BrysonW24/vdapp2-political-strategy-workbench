import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { AnalysisService } from './analysis.service'
import { CreateAnalysisDto } from './dto/create-analysis.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('Analysis')
@Controller('analysis')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new analysis for an article' })
  create(@Body() createAnalysisDto: CreateAnalysisDto, @Request() req: any) {
    return this.analysisService.create(createAnalysisDto, req.user?.id)
  }

  @Get('article/:articleId')
  @ApiOperation({ summary: 'Get all analyses for a specific article' })
  findByArticle(@Param('articleId') articleId: string) {
    return this.analysisService.findByArticle(articleId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single analysis by ID' })
  findOne(@Param('id') id: string) {
    return this.analysisService.findOne(id)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an analysis' })
  remove(@Param('id') id: string) {
    return this.analysisService.remove(id)
  }
}
