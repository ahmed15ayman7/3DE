import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from 'dtos/Enrollment.create.dto';
import { UpdateEnrollmentDto } from 'dtos/Enrollment.update.dto';
import { CreateEnrollmentCodeDto } from 'dtos/EnrollmentCode.create.dto';
import { UpdateEnrollmentCodeDto } from 'dtos/EnrollmentCode.update.dto';

@Injectable()
export class EnrollmentsService {
    constructor(private prisma: PrismaService) { }

    async create(createEnrollmentInput: CreateEnrollmentDto) {
        return this.prisma.enrollment.create({
            data: createEnrollmentInput,include:{
                course:true,
                user:true
            }
        });
    }

    async findAll() {
        return this.prisma.enrollment.findMany({
            include:{
                course:true,
                user:true
            }
        });
    }

    async findOne(id: string) {
        return this.prisma.enrollment.findUnique({
            where: { id },include:{
                course:true,
                user:true
            }
        });
    }

    async update(id: string, updateEnrollmentInput: UpdateEnrollmentDto) {
        return this.prisma.enrollment.update({
            where: { id },
            data: updateEnrollmentInput
        ,include:{
            course:true,
            user:true
    }});
    }

    async remove(id: string) {
        return this.prisma.enrollment.delete({
            where: { id },include:{
                course:true,
                user:true
            }
        });
    }

    async findByUserId(userId: string) {
        return this.prisma.enrollment.findMany({
            where: { userId },include:{
                course:true,
                user:true
            }
        });
    }
    async createEnrollmentCode(data: CreateEnrollmentCodeDto) {
        const course = await this.prisma.course.findUnique({
            where: { id: data.courseId }
        });
        if (!course) {
            throw new NotFoundException('Enrollment not found');
        }
        let admin = await this.prisma.admin.findFirst({
            where: {
                userId: data.createdById
            }
        });
        if (!admin) {
            throw new NotFoundException('Admin not found');
        }
        return this.prisma.enrollmentCode.create({
            data: {
                ...data,
                createdById: admin.id,
                courseId: course.id,
            }
        });
    }
    async updateEnrollmentCode(id: string, data: UpdateEnrollmentCodeDto) {
        if (data.isUsed && !data.usedById) {
            throw new BadRequestException('Used by is required');
        }
        if (data.usedById) {
            const user = await this.prisma.user.findUnique({
                where: { id: data.usedById }
            });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            data.usedById = user.id;
        }
        if (data.code) {
            const enrollmentCode = await this.prisma.enrollmentCode.findUnique({
                where: { code: data.code }
            });
            if (!enrollmentCode) {
                throw new BadRequestException('Invalid code');
            }
        }
        return this.prisma.enrollmentCode.update({
            where: { id,code:data.code },
            data: data
        });
    }
    async getAllEnrollmentCodes(search:string,take:number,skip:number,courseId:string) {
        let enrollmentCodes = await this.prisma.enrollmentCode.findMany({
            where: {
                OR: [
                    { code: { contains: search, mode: 'insensitive' } },
                    { course: { title: { contains: search, mode: 'insensitive' } } },
                    { usedBy: { firstName: { contains: search, mode: 'insensitive' } } },
                    { usedBy: { lastName: { contains: search, mode: 'insensitive' } } }
                ],
                courseId: courseId ? courseId : undefined
            },
            take:+take,
                skip:+skip
            });
        let total = await this.prisma.enrollmentCode.count({
                where: {
                    OR: [
                        { code: { contains: search, mode: 'insensitive' } },
                        { course: { title: { contains: search, mode: 'insensitive' } } }
                    ],
                    courseId: courseId ? courseId : undefined
                }
            })
        ;
        return { data: enrollmentCodes, total,totalPages:Math.ceil(total/take) };
    }
} 