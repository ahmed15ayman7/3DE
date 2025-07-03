import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, Res } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from '../../dtos/Certificate.create.dto';
import { UpdateCertificateDto } from '../../dtos/Certificate.update.dto';
import { Certificate } from '@shared/prisma';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Response } from 'express';
@ApiTags('الشهادات')
@Controller('certificates')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class CertificateController {
    constructor(private readonly certificateService: CertificateService) { }

    @Post()
    async create(@Body() createAcademyDto: CreateCertificateDto): Promise<Certificate> {
        return this.certificateService.create(createAcademyDto);
    }

    @Get()
    async findAll(): Promise<Certificate[]> {
        return this.certificateService.findAll();
    }

    @Get('student')
    async findByStudent(@Query('userId') userId: string): Promise<Certificate[]> {
        return this.certificateService.findByStudent(userId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Certificate> {
        return this.certificateService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateAcademyDto: UpdateCertificateDto,
    ): Promise<Certificate> {
        return this.certificateService.update(id, updateAcademyDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Certificate> {
        return this.certificateService.remove(id);
    }
    @Get("file/:id")
    async getFile(@Param('id') id: string, @Res() res: Response): Promise<string> {
        return this.certificateService.getFile(id, res);
    }
} 