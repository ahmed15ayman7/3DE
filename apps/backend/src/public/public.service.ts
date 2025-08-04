import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from 'dtos/Event.create.dto';
import { UpdateEventDto } from 'dtos/Event.update.dto';
import { BlogPost, Course, Event, Post, Prisma } from '@shared/prisma';

@Injectable()
export class PublicService {
    constructor(private prisma: PrismaService) { }

    async getEventsPublic(search: string,skip:number,take:number): Promise<{events:Partial<Event>[],total:number,totalPages:number,hasNextPage:boolean,hasPreviousPage:boolean}> {
        let events = await this.prisma.event.findMany({
            where: {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
    title: true,
    description: true,
    startTime: true,
    endTime: true,
    createdAt: true,
    updatedAt: true,
    },take:+take,skip:+skip
        });
        let total = await this.prisma.event.count();
        let totalPages = Math.ceil(total / take);
        let hasNextPage = +skip + take < total;
        let hasPreviousPage = +skip - take >= 0;
        return {events,total,totalPages,hasNextPage,hasPreviousPage}
    }
    async getPublicInstructors(search: string,take:number,skip:number) {
        let instructors = await this.prisma.instructor.findMany({
            where: {
                user: {
                    OR: [
                        { firstName: { contains: search, mode: 'insensitive' } },
                        { lastName: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                    ],
                },
            },
            select: {
                id: true,
                title: true,
                bio: true,
                rating: true,
                experienceYears: true,
                skills: true,
                location: true,
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                courses: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        image: true,
                        price: true,
                        duration: true,
                        level: true,
                    },
                },
            },
            take: 3,
        });
        let total = await this.prisma.instructor.count();
        let totalPages = Math.ceil(total / take);
        let hasNextPage = +skip + take < total;
        let hasPreviousPage = +skip - take >= 0;
        return {instructors,total,totalPages,hasNextPage,hasPreviousPage}
    }
    async getPostsPublic(search: string,take:number,skip:number): Promise<{posts:Partial<BlogPost>[],total:number,totalPages:number,hasNextPage:boolean,hasPreviousPage:boolean}> {
        let posts = await this.prisma.blogPost.findMany({
            where: {
                OR: [
                    { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
                    { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
                ],
            },
            select: {
                id: true,
                title: true,
                content: true,
                image: true,
                publishDate: true,
                isPublished: true,
                createdAt: true,
            },
            take: +take,
            skip: +skip,
        });
        let total = await this.prisma.blogPost.count();
        let totalPages = Math.ceil(total / take);
        let hasNextPage = +skip + take < total;
        let hasPreviousPage = +skip - take >= 0;
        return {posts,total,totalPages,hasNextPage,hasPreviousPage}
    
    }
    async getPostById(id: string): Promise<Partial<BlogPost>> {
        return this.prisma.blogPost.findUnique({
            where: { id },
        });
    }
    async getCoursesPublic(search: string,take:number,skip:number): Promise<{courses:Partial<Course>[],total:number,totalPages:number,hasNextPage:boolean,hasPreviousPage:boolean}> {
        const maybeDate = new Date(search);
const isValidDate = !isNaN(maybeDate.getTime());
        let courses = await this.prisma.course.findMany({
            where: {
                OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                  { level: { contains: search, mode: 'insensitive' } },
                //   { price: !isNaN(parseFloat(search)) ? { equals: parseFloat(search) } : undefined },
                //   { duration: !isNaN(parseInt(search)) ? { equals: parseInt(search) } : undefined },
                //   isValidDate ? { startDate: { equals: maybeDate } } : undefined,
                ], // لإزالة undefined
              },
            
            select: {
                id: true,
                title: true,
                description: true,
                image: true,
                level: true,
                price: true,
                duration: true,
                startDate: true,
                createdAt: true,
                updatedAt: true,
                academyId: true,
                status: true,
                progress: true,
                enrollments: {
                    select: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            },
                        },
                    },
                },
                instructors: {
                    select: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            },
                        },
                    },
                },
                lessons: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
            take: +take,
            skip: +skip,
        });
        let total = await this.prisma.course.count();
        let totalPages = Math.ceil(total / take);
        let hasNextPage = +skip + take < total;
        let hasPreviousPage = +skip - take >= 0;
        return {courses,total,totalPages,hasNextPage,hasPreviousPage}
    }

}