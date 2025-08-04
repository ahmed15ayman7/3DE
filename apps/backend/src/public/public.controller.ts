import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicService } from './public.service';
import { BlogPost, Course, Event, Instructor, Post } from '@shared/prisma';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('العامة')
@Controller('public')
export class PublicController {
    constructor(private readonly publicService: PublicService) { }
    @Get('events')
    async getEventsPublic(@Query('search') search?: string, @Query('take') take?: number, @Query('skip') skip?: number): Promise<{events:Partial<Event>[],total:number,totalPages:number,hasNextPage:boolean,hasPreviousPage:boolean}> {
        return this.publicService.getEventsPublic(search ?? "", skip ?? 0, take ?? 10);
    }
    @Get('instructors')
    async getInstructorsPublic(@Query('search') search?: string, @Query('take') take?: number, @Query('skip') skip?: number): Promise<{instructors:Partial<Instructor>[],total:number,totalPages:number,hasNextPage:boolean,hasPreviousPage:boolean}> {
        return this.publicService.getPublicInstructors(search ?? "", take ?? 10, skip ?? 0);
    }
    @Get('posts')
    async getPostsPublic(@Query('search') search?: string, @Query('take') take?: number, @Query('skip') skip?: number): Promise<{posts:Partial<BlogPost>[],total:number,totalPages:number,hasNextPage:boolean,hasPreviousPage:boolean}> {
        return this.publicService.getPostsPublic(search ?? "", take ?? 10, skip ?? 0);
    }
    @Get('posts/:id')
    async getPostByIdPublic(@Param('id') id: string): Promise<Partial<BlogPost>> {
        return this.publicService.getPostById(id);
    }
    @Get('courses')
    async getCoursesPublic(@Query('search') search?: string, @Query('take') take?: number, @Query('skip') skip?: number): Promise<{courses:Partial<Course>[],total:number,totalPages:number,hasNextPage:boolean,hasPreviousPage:boolean}> {
        return this.publicService.getCoursesPublic(search ?? "", take ?? 10, skip ?? 0);
    }
} 