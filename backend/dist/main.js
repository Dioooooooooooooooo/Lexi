"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
const request_context_middleware_1 = require("./common/middlewares/request-context.middleware");
const global_exception_filter_1 = require("./filters/global-exception-filter");
const seed_service_1 = require("./seed/seed/seed.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const seeder = app.get(seed_service_1.SeedService);
    await seeder.run();
    app.enableCors({
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.use((0, cookie_parser_1.default)());
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.use(new request_context_middleware_1.RequestContextMiddleware().use);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('LexiLearner API')
        .setVersion('1.0')
        .addServer('http://localhost:3000', 'Development server')
        .setLicense('MIT', 'https://opensource.org/licenses/MIT')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document, {
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
    app.getHttpAdapter().get('/docs-json', (req, res) => {
        res.json(document);
    });
    const port = Number(process.env.PORT) || 3000;
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📚 API Documentation available at http://localhost:${port}/docs`);
    console.log(`📋 API JSON Spec available at http://localhost:${port}/api/swagger.json`);
    try {
        await app.listen(port, '0.0.0.0');
    }
    catch (err) {
        if (err && err.code === 'EADDRINUSE') {
            console.error(`Port ${port} is already in use. Please stop the process using it or set a different PORT environment variable.`);
            process.exit(1);
        }
        throw err;
    }
}
bootstrap().catch(console.error);
//# sourceMappingURL=main.js.map