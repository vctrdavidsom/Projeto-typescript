"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const config_1 = require("@nestjs/config");
const users_service_1 = require("./users/users.service");
const user_entity_1 = require("./users/entities/user.entity");
async function seedAdminUser(app) {
    const usersService = app.get(users_service_1.UsersService);
    const adminEmail = 'admin@zedafruta.com';
    const existing = await usersService.findByEmail(adminEmail);
    if (!existing) {
        await usersService.create({
            email: adminEmail,
            firstName: 'Admin',
            lastName: 'ZedaFruta',
            senha: '$2b$10$mAsvA0Il6yAmiYW1xugjA.BS4AcWe0QxzHD3fwNqACqoYl277NNCe',
            provider: 'local',
            role: user_entity_1.UserRole.ADMIN,
            profileType: user_entity_1.UserProfileType.CUSTOMER,
            isEmailVerified: true,
        });
        console.log('Usuário admin criado automaticamente.');
    }
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    // Enable security headers
    app.use((0, helmet_1.default)());
    // Enable CORS
    app.enableCors({
        origin: configService.get('FRONTEND_URL') || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    // Enable validation
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    // Swagger documentation
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API Documentation')
        .setDescription('API documentation for the e-commerce platform')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = configService.get('PORT') || 3000;
    await seedAdminUser(app);
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
