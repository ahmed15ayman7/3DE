import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { AdminRoleType, CourseStatus, UserRole } from '@shared/prisma';
import { CreateAdminDto } from 'dtos/Admin.create.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminAuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateAdmin(email: string, password: string) {
        const admin = await this.prisma.admin.findFirst({
            where: {
                user: {
                    email,
                },
            },
            include: {
                user: true,
                assignments: {
                    include: {
                        role: {
                            include: {
                                permissions: true,
                            },
                        },
                    },
                },
                AdminRole: true,
            },
        });

        if (!admin) {
            throw new UnauthorizedException('بيانات الدخول غير صحيحة');
        }

        const isPasswordValid = await bcrypt.compare(password, admin.user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('بيانات الدخول غير صحيحة');
        }

        return admin;
    }

    async login(email: string, password: string) {
        const admin = await this.validateAdmin(email, password);

        const permissions = admin.assignments
            .flatMap((assignment) => assignment.role.permissions)
            .map((permission) => permission.name);

        const roles = admin.AdminRole;

        const payload = {
            sub: admin.id,
            email: admin.user.email,
            permissions,
            roles,
        };

        return {
            access_token: this.jwtService.sign(payload),
            refreshToken: this.generateRefreshToken(payload),
            admin: {
                id: admin.id,
                email: admin.user.email,
                firstName: admin.user.firstName,
                lastName: admin.user.lastName,
                permissions,
                roles,
            },
        };
    }
    async refreshToken(token: string) {
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            });
            const user = await this.prisma.admin.findUnique({
                where: {
                    id: payload.sub,
                },
                include: {
                    user: true,
                },
            });
            if (!user) {
                throw new UnauthorizedException();
            }
            return this.login(user.user.email, user.user.password);
        } catch {
            throw new UnauthorizedException();
        }
    }

    private generateRefreshToken(payload: any): string {
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
        });
    }
    async createAdmin(admin: CreateAdminDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: admin.userId,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (user.role !== UserRole.ADMIN) {
            throw new NotFoundException('User not role Admin');
        }


        const createdAdmin = await this.prisma.admin.create({
            data: admin,
        });
        return createdAdmin;
    }

    async getProfile(adminId: string) {
        const admin = await this.prisma.admin.findUnique({
            where: { id: adminId },
            include: {
                user: true,
                assignments: {
                    include: {
                        role: {
                            include: {
                                permissions: true,
                            },
                        },
                    },
                },
            },
        });

        if (!admin) {
            throw new UnauthorizedException('المسؤول غير موجود');
        }

        const permissions = admin.assignments
            .flatMap((assignment) => assignment.role.permissions)
            .map((permission) => permission.name);

        const roles = admin.assignments.map((assignment) => assignment.role.name);

        return {
            id: admin.id,
            email: admin.user.email,
            firstName: admin.user.firstName,
            lastName: admin.user.lastName,
            permissions,
            roles,
        };
    }

    private getDateRange(timeRange: 'day' | 'week' | 'month' | 'year') {
        const now = new Date();
        const startDate = new Date();

        switch (timeRange) {
            case 'day':
                startDate.setDate(now.getDate() - 1);
                break;
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
        }

        return {
            startDate,
            endDate: now,
        };
    }

    async getDashboardStats(adminId: string, timeRange: 'day' | 'week' | 'month' | 'year' = 'month') {
        try {
            const admin = await this.prisma.admin.findUnique({
                where: { id: adminId },
                include: {
                    AdminRole: true,
                    assignments: {
                        include: {
                            role: {
                                include: {
                                    permissions: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!admin) {
                throw new UnauthorizedException('المسؤول غير موجود');
            }

            const permissions = admin.assignments
                .flatMap((assignment) => assignment.role.permissions)
                .map((permission) => permission.name);

            const { startDate, endDate } = this.getDateRange(timeRange);

            const stats: any = {};

            // إحصائيات المستخدمين
            if (permissions.includes('VIEW_USERS') || admin.AdminRole?.[0].name === AdminRoleType.SUPER_ADMIN) {
                stats.users = {
                    total: await this.prisma.user.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    students: await this.prisma.user.count({
                        where: {
                            role: 'STUDENT',
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    instructors: await this.prisma.user.count({
                        where: {
                            role: 'INSTRUCTOR',
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    admins: await this.prisma.user.count({
                        where: {
                            role: 'ADMIN',
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    online: await this.prisma.user.count({
                        where: {
                            isOnline: true,
                            updatedAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    verified: await this.prisma.user.count({
                        where: {
                            isVerified: true,
                            updatedAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                };
            }

            // إحصائيات المواد
            if (permissions.includes('VIEW_COURSES') || admin.AdminRole?.[0].name === AdminRoleType.SUPER_ADMIN) {
                stats.courses = {
                    total: await this.prisma.course.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    enrollments: await this.prisma.enrollment.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    lessons: await this.prisma.lesson.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    quizzes: await this.prisma.quiz.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    active: await this.prisma.course.count({
                        where: {
                            status: CourseStatus.ACTIVE,
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    completed: await this.prisma.course.count({
                        where: {
                            status: CourseStatus.COMPLETED,
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    pending: await this.prisma.course.count({
                        where: {
                            status: CourseStatus.PENDING,
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                };
            }

            // إحصائيات المسارات التعليمية
            if (permissions.includes('VIEW_PATHS') || admin.AdminRole?.[0].name === AdminRoleType.SUPER_ADMIN) {
                stats.paths = {
                    total: await this.prisma.path.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    milestones: await this.prisma.milestone.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    completedTasks: await this.prisma.path.aggregate({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                        _sum: {
                            completedTasks: true,
                        },
                    }),
                    totalTasks: await this.prisma.path.aggregate({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                        _sum: {
                            totalTasks: true,
                        },
                    }),
                };
            }

            // إحصائيات الإنجازات
            if (permissions.includes('VIEW_ACHIEVEMENTS') || admin.AdminRole?.[0].name === AdminRoleType.SUPER_ADMIN) {
                stats.achievements = {
                    total: await this.prisma.achievement.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    badges: await this.prisma.badge.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    certificates: await this.prisma.certificate.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                };
            }

            // إحصائيات المجتمع
            if (permissions.includes('VIEW_COMMUNITY') || admin.AdminRole?.[0].name === AdminRoleType.SUPER_ADMIN) {
                stats.community = {
                    total: await this.prisma.community.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    groups: await this.prisma.group.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    posts: await this.prisma.post.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    discussions: await this.prisma.discussion.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    liveRooms: await this.prisma.liveRoom.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                };
            }

            // إحصائيات التقييم
            if (permissions.includes('VIEW_ASSESSMENTS') || admin.AdminRole?.[0].name === AdminRoleType.SUPER_ADMIN) {
                stats.assessments = {
                    quizzes: await this.prisma.quiz.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    submissions: await this.prisma.submission.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    questions: await this.prisma.question.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    passed: await this.prisma.submission.count({
                        where: {
                            passed: true,
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                };
            }

            // إحصائيات الحضور
            if (permissions.includes('VIEW_ATTENDANCE') || admin.AdminRole?.[0].name === AdminRoleType.SUPER_ADMIN) {
                stats.attendance = {
                    total: await this.prisma.attendance.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    present: await this.prisma.attendance.count({
                        where: {
                            status: 'PRESENT',
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    absent: await this.prisma.attendance.count({
                        where: {
                            status: 'ABSENT',
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    late: await this.prisma.attendance.count({
                        where: {
                            status: 'LATE',
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                };
            }

            // إحصائيات المالية
            if (permissions.includes('VIEW_FINANCE') || admin.AdminRole?.[0].name === AdminRoleType.SUPER_ADMIN) {
                stats.finance = {
                    totalPayments: await this.prisma.payment.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    totalAmount: await this.prisma.payment.aggregate({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                        _sum: { amount: true },
                    }),
                    salaryPayments: await this.prisma.salaryPayment.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    salaryAmount: await this.prisma.salaryPayment.aggregate({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                        _sum: { amount: true },
                    }),
                };
            }

            // إحصائيات الشؤون القانونية
            if (permissions.includes('VIEW_LEGAL') || admin.AdminRole?.[0].name === AdminRoleType.SUPER_ADMIN) {
                stats.legal = {
                    cases: await this.prisma.legalCase.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    activeCases: await this.prisma.legalCase.count({
                        where: {
                            status: 'OPEN',
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    contracts: await this.prisma.legalCase.count({
                        where: {
                            caseType: 'CONTRACT',
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    disputes: await this.prisma.legalCase.count({
                        where: {
                            caseType: 'DISPUTE',
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                };
            }

            // إحصائيات العلاقات العامة
            if (permissions.includes('VIEW_PUBLIC_RELATIONS') || admin.AdminRole?.[0].name === AdminRoleType.SUPER_ADMIN) {
                stats.publicRelations = {
                    records: await this.prisma.publicRelationsRecord.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    responses: await this.prisma.pRResponse.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    events: await this.prisma.event.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    pending: await this.prisma.publicRelationsRecord.count({
                        where: {
                            status: 'PENDING',
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                };
            }

            // إحصائيات السكرتارية
            if (permissions.includes('VIEW_SECRETARIAT') || admin.AdminRole?.[0].name === AdminRoleType.SUPER_ADMIN) {
                stats.secretariat = {
                    meetings: await this.prisma.meeting.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    participants: await this.prisma.meetingParticipant.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    attended: await this.prisma.meetingParticipant.count({
                        where: {
                            isAttended: true,
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                };
            }

            // إحصائيات الإدارة
            if (permissions.includes('VIEW_ADMINISTRATION') || admin.AdminRole?.[0].name === AdminRoleType.SUPER_ADMIN) {
                stats.administration = {
                    roles: await this.prisma.adminRole.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    assignments: await this.prisma.adminAssignment.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                    permissions: await this.prisma.permission.count({
                        where: {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    }),
                };
            }

            return stats;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('Failed to get dashboard stats' + error);
        }
    }
} 