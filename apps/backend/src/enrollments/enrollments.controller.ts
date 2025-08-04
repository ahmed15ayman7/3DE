import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from '../../dtos/Enrollment.create.dto';
import { UpdateEnrollmentDto } from '../../dtos/Enrollment.update.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Enrollment, EnrollmentCode } from '@shared/prisma';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateEnrollmentCodeDto } from 'dtos/EnrollmentCode.update.dto';
import { CreateEnrollmentCodeDto } from 'dtos/EnrollmentCode.create.dto';
@ApiTags('التسجيلات')
@Controller('enrollments')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class EnrollmentsController {
    constructor(private readonly enrollmentsService: EnrollmentsService) { }

    @Post()
    async create(@Body() createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
        return this.enrollmentsService.create(createEnrollmentDto);
    }

    @Get()
    async findAll(): Promise<Enrollment[]> {
        return this.enrollmentsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Enrollment> {
        return this.enrollmentsService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateEnrollmentDto: UpdateEnrollmentDto,
    ): Promise<Enrollment> {
        return this.enrollmentsService.update(id, updateEnrollmentDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Enrollment> {
        return this.enrollmentsService.remove(id);
    }

    @Get('user/:userId')
    async findByUserId(@Param('userId') userId: string): Promise<Enrollment[]> {
        return this.enrollmentsService.findByUserId(userId);
    }

    @Post('code')
    async createEnrollmentCode(@Body() createEnrollmentCodeDto: CreateEnrollmentCodeDto): Promise<EnrollmentCode> {
        return this.enrollmentsService.createEnrollmentCode(createEnrollmentCodeDto);
    }

    @Put('code/:code')
    async updateEnrollmentCode(
        @Param('code') code: string,
        @Body() updateEnrollmentCodeDto: UpdateEnrollmentCodeDto,
    ): Promise<EnrollmentCode> {
        return this.enrollmentsService.updateEnrollmentCode(code, updateEnrollmentCodeDto);
    }

    @Get('codes/all')
    async getAllEnrollmentCodes(
        @Query('search') search: string,
        @Query('take') take: number,
        @Query('skip') skip: number,
        @Query('courseId') courseId: string,
    ): Promise<{ data: EnrollmentCode[], total: number, totalPages: number }> {
        return this.enrollmentsService.getAllEnrollmentCodes(search, take, skip, courseId);
    }
} 