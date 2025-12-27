import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { CreateAnalysisDto } from './dto/create-analysis.dto'

@Injectable()
export class AnalysisService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateAnalysisDto, userId?: string) {
    const article = await this.prisma.newsArticle.findUnique({
      where: { id: createDto.articleId },
    })

    if (!article) {
      throw new NotFoundException(`Article with ID ${createDto.articleId} not found`)
    }

    const analysis = await this.prisma.analysis.create({
      data: {
        ...createDto,
        createdBy: userId,
      },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            source: true,
          },
        },
      },
    })

    return analysis
  }

  async findByArticle(articleId: string) {
    const analyses = await this.prisma.analysis.findMany({
      where: { articleId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return analyses
  }

  async findOne(id: string) {
    const analysis = await this.prisma.analysis.findUnique({
      where: { id },
      include: {
        article: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    if (!analysis) {
      throw new NotFoundException(`Analysis with ID ${id} not found`)
    }

    return analysis
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.prisma.analysis.delete({ where: { id } })
    return { message: 'Analysis deleted successfully' }
  }
}
