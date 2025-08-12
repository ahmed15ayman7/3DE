import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UploadedFile,
  Query,
} from '@nestjs/common';
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
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('الملفات')
@Controller('files')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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
    @Body() updateFileDto: UpdateFileDto
  ): Promise<File> {
    return this.filesService.update(id, updateFileDto);
  }

  @Post('upload/video')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
      storage: diskStorage({
        destination: '/var/www/videos/temp',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('video/')) {
          return cb(new Error('Only video files are allowed!'), false);
        }
        cb(null, true);
      },
    })
  )
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Query('videoId') videoId: string
  ) {
    const outputDir = `/var/www/videos/${videoId}`;
    fs.mkdirSync(outputDir, { recursive: true });

    await new Promise((resolve, reject) => {
      ffmpeg(file.path)
        .outputOptions([
          '-vf scale=-1:720',
          '-c:v libx264',
          '-preset fast',
          '-crf 28',
          '-c:a aac',
          '-b:a 128k',
          '-f hls',
          '-hls_time 5', // كل جزء مدته 5 ثواني
          '-hls_list_size 0', // احفظ كل الأجزاء
          '-hls_segment_filename',
          path.join(outputDir, 'segment_%03d.ts'),
        ])
        .save(path.join(outputDir, 'index.m3u8'))
        .on('end', () => {
          fs.unlinkSync(file.path);
          resolve(true);
        })
        .on('error', reject);
    });

    return {
      success: true,
      url: `https://3de.school/videos/${videoId}/index.m3u8`,
    };
  }
  @Get('video/:id')
  async getVideoLink(@Param('id') id: string) {
    return this.filesService.getVideoLink(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<File> {
    return this.filesService.remove(id);
  }
}
