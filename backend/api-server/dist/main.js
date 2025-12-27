"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: process.env.CORS_ORIGIN?.split(',') || '*',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Political Strategy Workbench API')
        .setDescription('AI Strategy Intelligence Workbench for political and business news analysis')
        .setVersion('1.0.0')
        .addBearerAuth()
        .addTag('Auth', 'Authentication endpoints')
        .addTag('Users', 'User management endpoints')
        .addTag('News Articles', 'News article management')
        .addTag('News Aggregation', 'Australian news aggregation from ABC, Guardian, News.com.au')
        .addTag('Analysis', 'AI-powered analysis endpoints')
        .addTag('Campaigns', 'Campaign and strategy management')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Server running on http://localhost:${port}`);
}
bootstrap().catch((error) => {
    console.error('Bootstrap error:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map