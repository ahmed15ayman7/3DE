import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

    // Global pipes
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
    });

    // Security
    app.use(helmet({ contentSecurityPolicy: false }));

    // Swagger setup
    const config = new DocumentBuilder()
        .setTitle('3DE Academy API')
        .setDescription('The 3DE Academy API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT || 3000);
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// async function bootstrap() {
//     const app = await NestFactory.create(AppModule);

//     // Enable CORS
//     app.enableCors();

//     // Global validation pipe
//     app.useGlobalPipes(new ValidationPipe({
//         whitelist: true,
//         transform: true,
//     }));

//     // Swagger documentation
//     const config = new DocumentBuilder()
//         .setTitle('3DE Academy API')
//         .setDescription('توثيق واجهة برمجة التطبيقات لأكاديمية 3DE')
//         .setVersion('1.0')
//         .addBearerAuth()
//         .build();
//     const document = SwaggerModule.createDocument(app, config);
//     SwaggerModule.setup('api', app, document);

//     await app.listen(3000);
// } 
// bootstrap(); 