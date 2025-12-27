"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let AnalysisService = class AnalysisService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto, userId) {
        const article = await this.prisma.newsArticle.findUnique({
            where: { id: createDto.articleId },
        });
        if (!article) {
            throw new common_1.NotFoundException(`Article with ID ${createDto.articleId} not found`);
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
        });
        return analysis;
    }
    async findByArticle(articleId) {
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
        });
        return analyses;
    }
    async findOne(id) {
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
        });
        if (!analysis) {
            throw new common_1.NotFoundException(`Analysis with ID ${id} not found`);
        }
        return analysis;
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.analysis.delete({ where: { id } });
        return { message: 'Analysis deleted successfully' };
    }
};
exports.AnalysisService = AnalysisService;
exports.AnalysisService = AnalysisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalysisService);
//# sourceMappingURL=analysis.service.js.map