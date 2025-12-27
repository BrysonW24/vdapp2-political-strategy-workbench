import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Security
  app.use(helmet())

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  })

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  // Swagger
  const config = new DocumentBuilder()
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
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = process.env.PORT || 3001
  await app.listen(port)
  console.log(`Server running on http://localhost:${port}`)
}

bootstrap().catch((error) => {
  console.error('Bootstrap error:', error)
  process.exit(1)
})
