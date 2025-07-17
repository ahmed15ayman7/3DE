import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from '../../dtos/Lesson.create.dto';
import { UpdateLessonDto } from '../../dtos/Lesson.update.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Lesson, LessonWhiteList, WatchedLesson } from '@shared/prisma';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateLessonWhiteListDto } from '../../dtos/LessonWhiteList.update.dto';
import { UpdateWatchedLessonDto } from 'dtos/WatchedLesson.update.dto';
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
    async updateLessonWhiteList(@Body() updateLessonWhiteListDto: UpdateLessonWhiteListDto): Promise<LessonWhiteList> {
        return this.lessonsService.updateLessonWhiteList(updateLessonWhiteListDto.lessonId, updateLessonWhiteListDto.userId, updateLessonWhiteListDto.isBlocked);
    }

    @Post('watched-lesson')
    async updateWatchedLesson(@Body() updateWatchedLessonDto: UpdateWatchedLessonDto): Promise<WatchedLesson> {
        return this.lessonsService.updateWatchedLesson(updateWatchedLessonDto.lessonId, updateWatchedLessonDto.userId, updateWatchedLessonDto.progress);
    }
    @Put('watched-lesson/:lessonId/:userId')
    async updateWatchedLessonProgress(@Param('lessonId') lessonId: string, @Param('userId') userId: string, @Body() updateWatchedLessonDto: UpdateWatchedLessonDto): Promise<WatchedLesson> {
        return this.lessonsService.updateWatchedLesson(lessonId, userId, updateWatchedLessonDto.progress);
    }
} 