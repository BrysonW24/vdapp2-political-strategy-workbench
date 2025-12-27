import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { CreateCampaignDto } from './dto/create-campaign.dto'
import { CreateStrategyDto } from './dto/create-strategy.dto'

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateCampaignDto, userId: string) {
    const campaign = await this.prisma.campaign.create({
      data: {
        ...createDto,
        startDate: new Date(createDto.startDate),
        endDate: createDto.endDate ? new Date(createDto.endDate) : null,
        ownerId: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return campaign
  }

  async findAll(userId?: string) {
    const campaigns = await this.prisma.campaign.findMany({
      where: userId ? { ownerId: userId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        strategies: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          },
        },
      },
    })

    return campaigns
  }

  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        strategies: true,
      },
    })

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`)
    }

    return campaign
  }

  async update(id: string, updateDto: Partial<CreateCampaignDto>, userId: string) {
    const campaign = await this.findOne(id)

    if (campaign.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own campaigns')
    }

    return this.prisma.campaign.update({
      where: { id },
      data: {
        ...updateDto,
        ...(updateDto.startDate && { startDate: new Date(updateDto.startDate) }),
        ...(updateDto.endDate && { endDate: new Date(updateDto.endDate) }),
      },
    })
  }

  async remove(id: string, userId: string) {
    const campaign = await this.findOne(id)

    if (campaign.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own campaigns')
    }

    await this.prisma.campaign.delete({ where: { id } })
    return { message: 'Campaign deleted successfully' }
  }

  async createStrategy(campaignId: string, createDto: CreateStrategyDto, userId: string) {
    const campaign = await this.findOne(campaignId)

    if (campaign.ownerId !== userId) {
      throw new ForbiddenException('You can only add strategies to your own campaigns')
    }

    const strategy = await this.prisma.strategy.create({
      data: {
        ...createDto,
        campaignId,
      },
    })

    return strategy
  }

  async updateStrategy(strategyId: string, updateDto: Partial<CreateStrategyDto>, userId: string) {
    const strategy = await this.prisma.strategy.findUnique({
      where: { id: strategyId },
      include: { campaign: true },
    })

    if (!strategy) {
      throw new NotFoundException(`Strategy with ID ${strategyId} not found`)
    }

    if (strategy.campaign.ownerId !== userId) {
      throw new ForbiddenException('You can only update strategies in your own campaigns')
    }

    return this.prisma.strategy.update({
      where: { id: strategyId },
      data: updateDto,
    })
  }

  async removeStrategy(strategyId: string, userId: string) {
    const strategy = await this.prisma.strategy.findUnique({
      where: { id: strategyId },
      include: { campaign: true },
    })

    if (!strategy) {
      throw new NotFoundException(`Strategy with ID ${strategyId} not found`)
    }

    if (strategy.campaign.ownerId !== userId) {
      throw new ForbiddenException('You can only delete strategies from your own campaigns')
    }

    await this.prisma.strategy.delete({ where: { id: strategyId } })
    return { message: 'Strategy deleted successfully' }
  }
}
