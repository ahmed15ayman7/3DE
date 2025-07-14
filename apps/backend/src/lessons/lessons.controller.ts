import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from '../../dtos/Lesson.create.dto';
import { UpdateLessonDto } from '../../dtos/Lesson.update.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Lesson, LessonBlockList } from '@shared/prisma';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateLessonBlockListDto } from '../../dtos/LessonBlockList.update.dto';
@ApiTags('الدروس')
@Controller('lessons')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) { }

    @Post()
    async create(@Body() createLessonDto: CreateLessonDto): Promise<Lesson> {
        return this.lessonsService.create(createLessonDto);
    }

    @Get()
    async findAll(): Promise<Lesson[]> {
        return this.lessonsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Lesson> {
        return this.lessonsService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateLessonDto: UpdateLessonDto,
    ): Promise<Lesson> {
        return this.lessonsService.update(id, updateLessonDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Lesson> {
        return this.lessonsService.remove(id);
    }
    @Post('block-list')
    async updateLessonBlockList(@Body() updateLessonBlockListDto: UpdateLessonBlockListDto): Promise<LessonBlockList> {
        return this.lessonsService.updateLessonBlockList(updateLessonBlockListDto.lessonId, updateLessonBlockListDto.userId, updateLessonBlockListDto.isBlocked);
    }
} 