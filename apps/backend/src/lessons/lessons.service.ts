import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from 'dtos/Lesson.create.dto';
import { UpdateLessonDto } from 'dtos/Lesson.update.dto';

@Injectable()
export class LessonsService {
    constructor(private prisma: PrismaService) { }

    async create(createLessonInput: CreateLessonDto) {
        return this.prisma.lesson.create({
            data: createLessonInput,
            include: {
                course: true,
                completedBy: true,
            },
        });
    }

    async findAll() {
        return this.prisma.lesson.findMany({
            include: {
                course: true,
                completedBy: true,
                files:true
            },
        });
    }
    
    async findOne(id: string) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id },
            include: {
                course: true,
                completedBy: true,
                files:true
            },
        });

        if (!lesson) {
            throw new NotFoundException(`Lesson with ID ${id} not found`);
        }

        return lesson;
    }

    async update(id: string, updateLessonInput: UpdateLessonDto) {
        const lesson = await this.findOne(id);
        if (!lesson) {
            throw new NotFoundException(`Lesson with ID ${id} not found`);
        }

        return this.prisma.lesson.update({
            where: { id },
            data: updateLessonInput,
            include: {
                course: true,
            },
        });
    }
    async updateLessonWhiteList(lessonId: string, userId: string, isBlocked: boolean) {
        return this.prisma.lessonWhiteList.upsert({
            where: { id: lessonId },
            update: { isBlocked },
            create: { lessonId, userId, isBlocked },
        });
    }

    async remove(id: string) {
        const lesson = await this.findOne(id);

        return this.prisma.lesson.delete({
            where: { id },
        });
    }

    async markLessonAsCompleted(lessonId: string, userId: string) {
        const lesson = await this.findOne(lessonId);

        return this.prisma.lesson.update({
            where: { id: lessonId },
            data: {
                completedBy: {
                    connect: { id: userId },
                },
            },
            include: {
                course: true,
            },
        });
    }

    async markLessonAsIncomplete(lessonId: string, userId: string) {
        const lesson = await this.findOne(lessonId);

        return this.prisma.lesson.update({
            where: { id: lessonId },
            data: {
                completedBy: {
                    disconnect: { id: userId },
                },
            },
            include: {
                course: true,
            },
        });
    }

    async addWatchedLesson(lessonId: string, userId: string,progress:number) {
        return this.prisma.watchedLesson.create({
            data: {
                lessonId,
                progress,
                userId,
            },
        });
    }

    async updateWatchedLesson(lessonId: string, userId: string, progress: number) {
        const watchedLesson = await this.prisma.watchedLesson.findFirst({
            where: { lessonId, userId },
        });
        if (watchedLesson) {
        return this.prisma.watchedLesson.update({
                where: { id: watchedLesson.id },
                data: { progress },
            });
        }
        return this.addWatchedLesson(lessonId, userId,progress);
    }

} 