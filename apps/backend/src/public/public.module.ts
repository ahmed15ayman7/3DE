import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { PublicController } from './public.controller';
@Module({
    imports: [PrismaModule],
    controllers: [PublicController],
    providers: [PublicService],
    exports: [PublicService]
})
export class PublicModule { } 