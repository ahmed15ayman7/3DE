import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from 'dtos/Enrollment.create.dto';
import { UpdateEnrollmentDto } from 'dtos/Enrollment.update.dto';

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
} 