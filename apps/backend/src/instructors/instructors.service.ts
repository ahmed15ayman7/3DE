import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstructorDto } from 'dtos/Instructor.create.dto';
import { UpdateInstructorDto } from 'dtos/Instructor.update.dto';
@Injectable()
export class InstructorsService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateInstructorDto) {
        return this.prisma.instructor.create({
            data: {
                ...data,
            },
            include: {
                user: true,
                courses: true,
            },
        });
    }

    async findAll(skip: number, limit: number, search: string) {
        return this.prisma.instructor.findMany({
            skip,
            take: limit,
            where: {
                user: {
                    OR: [
                        { firstName: { contains: search, mode: 'insensitive' } },
                        { lastName: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                    ],
                },
            },
            include: {
                user: true,
                courses: true,
            },
        });
    }

    async findOne(id: string) {
        const user = await this.prisma.instructor.findUnique({
            where: { id },
            include: {
                user: true,
                courses: true,
            },
        });

        if (!user) {
            throw new NotFoundException(`Instructor with ID ${id} not found`);
        }

        return user;
    }

    async findByEmail(email: string) {
        console.log(email);
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                profile: true,
                academy: true,
            },
        });
    }

        async update(id: string, data: UpdateInstructorDto) {
        await this.findOne(id);
        return this.prisma.instructor.update({
            where: { id },
            data:{
                ...data,
            },
            include: {
                user: true,
                courses: true,
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.instructor.delete({
            where: { id },
        });
    }


   


    async getCourses(id: string) {
        const instructor = await this.prisma.instructor.findFirst({
            where: { userId: id },
        });
        if (!instructor) {
            throw new NotFoundException('Instructor not found');
        }
        return this.prisma.course.findMany({
            where: { instructors: { some: { id: instructor.id } } },
            include: {
                instructors: {
                    include: {
                        user: true,
                    },
                },
                enrollments: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }

    async findAllForStudents() {
        return this.prisma.instructor.findMany({
            include: {
                user: true,
                courses: {
                    include: {
                        lessons: true,
                        quizzes: true,
                    },
                },
            },
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


} 