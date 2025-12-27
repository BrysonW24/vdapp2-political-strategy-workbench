import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { CampaignsService } from './campaigns.service'
import { CreateCampaignDto } from './dto/create-campaign.dto'
import { CreateStrategyDto } from './dto/create-strategy.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('Campaigns')
@Controller('campaigns')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new campaign' })
  create(@Body() createCampaignDto: CreateCampaignDto, @Request() req: any) {
    return this.campaignsService.create(createCampaignDto, req.user.id)
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaigns for the current user' })
  findAll(@Request() req: any) {
    return this.campaignsService.findAll(req.user.id)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single campaign by ID' })
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a campaign' })
  update(
    @Param('id') id: string,
    @Body() updateCampaignDto: Partial<CreateCampaignDto>,
    @Request() req: any,
  ) {
    return this.campaignsService.update(id, updateCampaignDto, req.user.id)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a campaign' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.campaignsService.remove(id, req.user.id)
  }

  @Post(':id/strategies')
  @ApiOperation({ summary: 'Add a strategy to a campaign' })
  createStrategy(
    @Param('id') id: string,
    @Body() createStrategyDto: CreateStrategyDto,
    @Request() req: any,
  ) {
    return this.campaignsService.createStrategy(id, createStrategyDto, req.user.id)
  }

  @Patch('strategies/:strategyId')
  @ApiOperation({ summary: 'Update a strategy' })
  updateStrategy(
    @Param('strategyId') strategyId: string,
    @Body() updateStrategyDto: Partial<CreateStrategyDto>,
    @Request() req: any,
  ) {
    return this.campaignsService.updateStrategy(strategyId, updateStrategyDto, req.user.id)
  }

  @Delete('strategies/:strategyId')
  @ApiOperation({ summary: 'Delete a strategy' })
  removeStrategy(@Param('strategyId') strategyId: string, @Request() req: any) {
    return this.campaignsService.removeStrategy(strategyId, req.user.id)
  }
}
