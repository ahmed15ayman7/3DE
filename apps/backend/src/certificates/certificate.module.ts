import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { CertificateController } from './certificate.controller';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
    imports: [PrismaModule,
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'apps/backend/public'), // هذا المسار الثابت
            serveRoot: '/', // يجعل الملفات في public متاحة مباشرة من /
          }),
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_ACCESS_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_ACCESS_EXPIRATION'),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [CertificateController],
    providers: [CertificateService],
    exports: [CertificateService],
})
export class CertificateModule { } 