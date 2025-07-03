import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFileDto } from 'dtos/File.create.dto';
import { UpdateFileDto } from 'dtos/File.update.dto';

@Injectable()
export class FilesService {
    constructor(private prisma: PrismaService) { }

    async create(createFileInput: CreateFileDto) {
        let lesson = await this.prisma.lesson.findUnique({
            where: { id: createFileInput.lessonId }
        });
        if (!lesson) {
            throw new NotFoundException('Lesson not found');
        }
        return this.prisma.file.create({
            data: {...createFileInput,
                lessonId: lesson.id,
            }
        });
    }

    async findAll() {
        return this.prisma.file.findMany();
    }

    async findOne(id: string) {
        return this.prisma.file.findUnique({
            where: { id }
        });
    }

    async update(id: string, updateFileInput: UpdateFileDto) {
        return this.prisma.file.update({
            where: { id },
            data: updateFileInput
        });
    }

    async remove(id: string) {
        return this.prisma.file.delete({
            where: { id }
        });
    }
} 