import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from 'dtos/Event.create.dto';
import { UpdateEventDto } from 'dtos/Event.update.dto';
import { Course, Event, Post } from '@shared/prisma';

@Injectable()
export class PublicService {
    constructor(private prisma: PrismaService) { }

    async getEventsPublic(search: string): Promise<Partial<Event>[]> {
        return this.prisma.event.findMany({
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
    academyId: true,
    createdAt: true,
    updatedAt: true,
    academy: {
        select: {
            id: true,
            name: true,
        },
    }
    },take:10
        });
    }
    async getPublicInstructors(search: string) {
        return this.prisma.instructor.findMany({
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
    }
    async getPostsPublic(search: string): Promise<Partial<Post>[]> {
        return this.prisma.post.findMany({
            where: {
                publicRelationsRecordId: { not: null },
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
                title: true,
                content: true,
                likesCount: true,
                createdAt: true,
                comments: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                    },
                },
            },
            take: 10,
        });
    }
    async getCoursesPublic(search: string): Promise<Course[]> {
        const maybeDate = new Date(search);
const isValidDate = !isNaN(maybeDate.getTime());
        return this.prisma.course.findMany({
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
            take: 6,
        });
    }

} 