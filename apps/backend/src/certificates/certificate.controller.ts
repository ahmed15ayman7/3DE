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
export class CertificateController {
    constructor(private readonly certificateService: CertificateService) { }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async create(@Body() createAcademyDto: CreateCertificateDto): Promise<Certificate> {
        return this.certificateService.create(createAcademyDto);
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async findAll(): Promise<Certificate[]> {
        return this.certificateService.findAll();
    }

    @Get('student')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async findByStudent(@Query('userId') userId: string): Promise<Certificate[]> {
        return this.certificateService.findByStudent(userId);
    }

    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async findOne(@Param('id') id: string): Promise<Certificate> {
        return this.certificateService.findOne(id);
    }

    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateAcademyDto: UpdateCertificateDto,
    ): Promise<Certificate> {
        return this.certificateService.update(id, updateAcademyDto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async remove(@Param('id') id: string): Promise<Certificate> {
        return this.certificateService.remove(id);
    }
    @Get("file/:id")
    async getFile(@Param('id') id: string, @Res() res: Response): Promise<string> {
        return this.certificateService.getFile(id, res);
    }
} 