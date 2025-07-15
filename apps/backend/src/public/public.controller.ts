import { Controller, Get, Query } from '@nestjs/common';
import { PublicService } from './public.service';
import { Course, Event, Instructor, Post } from '@shared/prisma';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('العامة')
@Controller('public')
export class PublicController {
    constructor(private readonly publicService: PublicService) { }
    @Get('events')
    async getEventsPublic(@Query('search') search?: string): Promise<Partial<Event>[]> {
        return this.publicService.getEventsPublic(search ?? "");
    }
    @Get('instructors')
    async getInstructorsPublic(@Query('search') search?: string): Promise<Partial<Instructor>[]> {
        return this.publicService.getPublicInstructors(search ?? "");
    }
    @Get('posts')
    async getPostsPublic(@Query('search') search?: string): Promise<Partial<Post>[]> {
        return this.publicService.getPostsPublic(search ?? "");
    }
    @Get('courses')
    async getCoursesPublic(@Query('search') search?: string): Promise<Course[]> {
        return this.publicService.getCoursesPublic(search ?? "");
    }
} 