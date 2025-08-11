import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UploadedFile } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from '../../dtos/File.create.dto';
import { UpdateFileDto } from '../../dtos/File.update.dto';
import { FileDto } from '../../dtos/File.dto';
import { AuthGuard } from '../auth/auth.guard';
import { File } from '@shared/prisma';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';

@ApiTags('الملفات')
@Controller('files')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Post()
    async create(@Body() createFileDto: CreateFileDto): Promise<File> {
        return this.filesService.create(createFileDto);
    }

    @Get()
    async findAll(): Promise<File[]> {
        return this.filesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<File> {
        return this.filesService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateFileDto: UpdateFileDto,
    ): Promise<File> {
        return this.filesService.update(id, updateFileDto);
    }
    @Post('upload/video')
    @UseInterceptors(
        FileInterceptor('file', {
          limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
          storage: diskStorage({
            destination: '/var/www/videos/temp', // رفع مؤقت
            filename: (req, file, cb) => {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
              cb(null, uniqueSuffix + extname(file.originalname));
            },
          }),
          fileFilter: (req, file, cb) => {
            if (!file.mimetype.startsWith('video/')) {
              return cb(new Error('Only video files are allowed!'), false);
            }
            cb(null, true);
          },
        }),
      )
      async uploadVideo(@UploadedFile() file: Express.Multer.File,url:string) {
        const finalFilename = url.split('/').pop();
        const finalPath = `/var/www/videos/${finalFilename}`;
    
        // ضغط وتحويل الفيديو
        await new Promise((resolve, reject) => {
          ffmpeg(file.path)
            .outputOptions([
              '-vf scale=-1:720',       // أقصى ارتفاع 720
              '-c:v libx264',           // كوديك فيديو سريع وفعال
              '-preset fast',           // سرعة الترميز
              '-crf 28',                 // جودة وضغط (كلما قل الرقم زادت الجودة والحجم)
              '-c:a aac',                // كوديك الصوت
              '-b:a 128k',               // معدل البت للصوت
            ])
            .save(finalPath)
            .on('end', () => {
              fs.unlinkSync(file.path); // حذف الملف المؤقت
              resolve(true);
            })
            .on('error', (err) => {
              reject(err);
            });
        });
    
        return { success: true, url: `https://3de.school/videos/${finalFilename}` };
      }
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<File> {
        return this.filesService.remove(id);
    }
} 