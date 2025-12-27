"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsAggregationModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const schedule_1 = require("@nestjs/schedule");
const news_aggregation_service_1 = require("./news-aggregation.service");
const news_aggregation_controller_1 = require("./news-aggregation.controller");
const database_module_1 = require("../../database/database.module");
const abc_news_provider_1 = require("./providers/abc-news.provider");
const guardian_au_provider_1 = require("./providers/guardian-au.provider");
const news_com_au_provider_1 = require("./providers/news-com-au.provider");
let NewsAggregationModule = class NewsAggregationModule {
};
exports.NewsAggregationModule = NewsAggregationModule;
exports.NewsAggregationModule = NewsAggregationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            axios_1.HttpModule,
            schedule_1.ScheduleModule.forRoot(),
        ],
        controllers: [news_aggregation_controller_1.NewsAggregationController],
        providers: [
            news_aggregation_service_1.NewsAggregationService,
            abc_news_provider_1.ABCNewsProvider,
            guardian_au_provider_1.GuardianAustraliaProvider,
            news_com_au_provider_1.NewsComAuProvider,
        ],
        exports: [news_aggregation_service_1.NewsAggregationService],
    })
], NewsAggregationModule);
//# sourceMappingURL=news-aggregation.module.js.map