import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFileDto } from 'dtos/File.create.dto';
import { UpdateFileDto } from 'dtos/File.update.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as jwt from 'jsonwebtoken';

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
        // 1- جيب الفايل من الـ DB
        const file = await this.prisma.file.findUnique({
          where: { id },
        });
    
        if (!file) {
          throw new NotFoundException(`File with id ${id} not found`);
        }
        let filename = file.url.split('videos/')[1].split('/')[0];
    
        // 2- امسح الفايل من المسار
        const filePath = path.join('/var/www/videos', filename); // filename هو اسم الفايل المخزن
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // حذف الفايل فعلياً
        }
    
        // 3- امسح السجل من DB
        return this.prisma.file.delete({
          where: { id },
        });
      }
      async getVideoLink(id: string) {
        const token = jwt.sign({ id }, process.env.VIDEO_SECRET, { expiresIn: '5m' });
        return { url: `https://3de.school/secure/videos/${id}/index.m3u8?token=${token}` };
      }
} 