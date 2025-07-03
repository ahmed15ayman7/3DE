import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@shared/prisma';
import { CreateUserDto } from 'dtos/User.create.dto';
import { UpdateUserDto } from 'dtos/User.update.dto';
import { UpdateTwoFactorDto } from 'dtos/TwoFactor.update.dto';
@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateUserDto) {
        return this.prisma.user.create({
            data: {
                email: data.email,
                // password: await bcrypt.hash(data.password, 10),
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
                subRole: data.subRole,
                avatar: data.avatar,
                academyId: data.academyId,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            },
            include: {
                profile: true,
                academy: true,
            },
        });
    }

    async findAll() {
        return this.prisma.user.findMany({
            include: {
                profile: true,
                academy: true,
            },
        });
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                profile: true,
                academy: true,
                enrollments: {
                    include: {
                        course: true,
                    },
                },
                achievements: true,
            },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
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

    async update(id: string, data: UpdateUserDto) {
        const user = await this.findOne(id);
        if(data.password){
            data.password = await bcrypt.hash(data.password, 10);
        }
        return this.prisma.user.update({
            where: { id },
            data: {
                ...data,
                password: data.password ? await bcrypt.hash(data.password, 10) : user.password,
            },
            include: {
                profile: true,
                academy: true,
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.user.delete({
            where: { id },
        });
    }

    async updateProfile(userId: string, data: {
        bio?: string;
        phone?: string;
        address?: string;
        preferences?: any;
    }) {
        return this.prisma.profile.upsert({
            where: { userId },
            update: data,
            create: {
                ...data,
                userId,
            },
        });
    }

    async getEnrollments(userId: string) {
        return this.prisma.enrollment.findMany({
            where: { userId },
            include: {
                course: true,
            },
        });
    }

    async getAchievements(userId: string) {
        return this.prisma.achievement.findMany({
            where: { userId },
        });
    }

    async getCreatedCourses(userId: string) {
        return this.prisma.course.findMany({
            where: { academyId: userId },
        });
    }

    async getLoginHistory(userId: string) {
        return this.prisma.loginHistory.findMany({
            where: { userId },
        });
    }

    async getTwoFactor(userId: string) {
        return this.prisma.twoFactor.findFirst({
            where: { userId },
        });
    }
    async updateTwoFactor(userId: string, data: UpdateTwoFactorDto) {
        const twoFactor = await this.getTwoFactor(userId);
        if (!twoFactor) {
            if (data.authenticator || data.email || data.sms) {
                const secret = await bcrypt.hash(data.secret, 10);
                return this.prisma.twoFactor.create({
                    data: {
                        ...data,
                        userId,
                        secret,
                    },
                });
            }
        }
        return this.prisma.twoFactor.update({
            where: { id: twoFactor.id },
            data,
        });
    }

} 