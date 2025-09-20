// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { RequestContextMiddleware } from './common/middlewares/request-context.middleware';
import { GlobalExceptionFilter } from './filters/global-exception-filter';
import { SeedService } from './seed/seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const seeder = app.get(SeedService);

  // Reading materials seed. RUN ONLY ONCE
  await seeder.run();

  // Enable CORS for development
  app.enableCors({
    // origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // Enable validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(cookieParser());

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.use(new RequestContextMiddleware().use);

  const config = new DocumentBuilder()
    .setTitle('LexiLearner API')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Development server')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'api/docs-json',
    customSiteTitle: 'LexiLearner API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .info .title { color: #2c3e50 }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0 }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      docExpansion: 'list',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
  });

  // giadd kay idk what happened to docs-json :((
  app.getHttpAdapter().get('/docs-json', (req, res) => {
    res.json(document);
  });

  const port = Number(process.env.PORT) || 3000;
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(
    `📚 API Documentation available at http://localhost:${port}/docs`,
  );
  console.log(
    `📋 API JSON Spec available at http://localhost:${port}/api/swagger.json`,
  );

  try {
    await app.listen(port, '0.0.0.0');
  } catch (err: any) {
    if (err && err.code === 'EADDRINUSE') {
      console.error(
        `Port ${port} is already in use. Please stop the process using it or set a different PORT environment variable.`,
      );
      process.exit(1);
    }
    throw err;
  }
}
bootstrap().catch(console.error);
