import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParentDto } from 'dtos/Parent.create.dto';
import { UpdateParentDto } from 'dtos/Parent.update.dto';
import { CreateChildDto } from 'dtos/Child.create.dto';
import { UpdateChildDto } from 'dtos/Child.update.dto';
import { UpdateUserDto } from 'dtos/User.update.dto';
@Injectable()
export class ParentsService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateParentDto) {
        return this.prisma.parent.create({
            data: {
                ...data,
            },
            include: {
                user: true,
                children: true,
            },
        });
    }

    async findAll(skip: number, take: number, search: string) {
        let parents = await this.prisma.parent.findMany({
            skip,
            take: take,
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
                children: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        let total = await this.prisma.parent.count({
            where: {
                user: {
                    OR: [
                        { firstName: { contains: search, mode: 'insensitive' } },
                        { lastName: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                    ],
                },
            },
        });
        return {
            data: parents,
            total,
            totalPages: Math.ceil(total / take),
            hasNextPage: skip + take < total,
            hasPreviousPage: skip > 0,
        };
    }

    async findOne(id: string) {
        const user = await this.prisma.parent.findUnique({
            where: { id },
            include: {
                user: {
                    include: {
                        LoginHistory: {
                            orderBy: {
                                createdAt: 'desc',
                            },
                        },
                        SalaryPayment: {
                            include: {
                                accountingEntry: true,
                            },
                        },
                    },
                },
                children: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException(`Parent with ID ${id} not found`);
        }

        return user;
    }

    async findByEmail(email: string) {
        console.log(email);
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                profile: true,
            },
        });
    }

        async update(id: string, data: UpdateParentDto) {
        await this.findOne(id);
        return this.prisma.parent.update({
            where: { id },
            data:{
                ...data,
            },
            include: {
                user: true,
                children: {
                    include: {
                        user: {
                            include: {
                                Attendance: true,
                                WatchedLesson: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async updateUserByParentId(id: string, data: UpdateUserDto) {
        const parent = await this.prisma.parent.findFirst({
            where: { userId: id },
        });
        if (!parent) {
            throw new NotFoundException('Parent not found');
        }
        return this.prisma.user.update({
            where: { id: parent.userId },
            data: { ...data },
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.parent.delete({
            where: { id },
        });
    }


    async addChild(id: string, data: CreateChildDto) {
        const parent = await this.prisma.parent.findFirst({
            where: { userId: id },
        });
        if (!parent) {
            throw new NotFoundException('Parent not found');
        }
        return this.prisma.child.create({
            data: {
                ...data,
                parentId: parent.id,
                userId: data.userId,
            },
        });
    }
    async updateChild(id: string, childId: string, data: UpdateChildDto) {
        const parent = await this.prisma.parent.findFirst({
            where: { userId: id },
        });
        if (!parent) {
            throw new NotFoundException('Parent not found');
        }
        const child = await this.prisma.child.findFirst({
            where: { id: childId, parentId: parent.id },
        });
        if (!child) {
            throw new NotFoundException('Child not found');
        }
        return this.prisma.child.update({
            where: { id: childId },
            data: { ...data },
        });
    }

    async removeChild(id: string, childId: string) {
        const parent = await this.prisma.parent.findFirst({
            where: { userId: id },
        });
        if (!parent) {
            throw new NotFoundException('Parent not found');
        }
        const child = await this.prisma.child.findFirst({
            where: { id: childId },
        });
        if (!child) {
            throw new NotFoundException('Child not found');
        }
        if (child.parentId !== parent.id) {
            throw new NotFoundException('Child not found');
        }
        return this.prisma.child.delete({
            where: { id: childId },
        });
    }


    async getCourses(id: string) {
        const parent = await this.prisma.parent.findFirst({
            where: { userId: id },
        });
        if (!parent) {
            throw new NotFoundException('Parent not found');
        }
        return this.prisma.course.findMany({
            where: { enrollments: { some: { user: { Child: { some: { parentId: parent.id } } } } } },
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

    async findAllForChildren(parentId:string) {
        let parent = await this.prisma.parent.findFirst({
            where: {
                userId: parentId,
                user:{
                    role:"PARENT"
                }
            },
        });
            if (!parent) {
            throw new NotFoundException('Parent not found');
        }
        return this.prisma.user.findMany({
            where: {
               Child: {
                some: {
                    parentId: parent.id,
                    status: 'ACTIVE',
                },
               }
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                email: true,
                isOnline: true,
                Submission: {
                    select: {
                        score:true,
                        passed:true,
                        createdAt:true,
                        updatedAt:true,
                        id: true,
                        quiz: {
                            select: {
                                title: true,
                            },
                        },
                    },
                },
                Attendance: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
                WatchedLesson: {
                    select: {
                        id: true,
                        lesson: {
                            select: {
                                course: {
                                    select: {
                                        title: true,
                                        lessons: {
                                            select: {
                                                id: true,
                                            },
                                        },
                                        instructors: {
                                            where: {
                                                id: parent.id,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }


    async getDashboardData(userId: string) {
        // العثور على المدرس
        const parent = await this.prisma.parent.findFirst({
            where: { userId },
            include: { user: true },
        });

        if (!parent) {
            throw new NotFoundException('Parent not found');
        }

        // جلب الكورسات مع البيانات التفصيلية
        const courses = await this.prisma.course.findMany({
            where: { 
                instructors: { 
                    some: { id: parent.id } 
                } 
            },
            include: {
                enrollments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            },
                        },
                    },
                },
                quizzes: {
                    include: {
                        submissions: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                    },
                },
                lessons: {
                    include: {
                        WatchedLesson: true,
                        Attendance: {
                            include: {
                                student: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        // جلب الإشعارات الأخيرة للمدرس
        const recentNotifications = await this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                title: true,
                message: true,
                type: true,
                createdAt: true,
                read: true,
            },
        });

        // حساب الإحصائيات
        const totalCourses = courses.length;
        
        // حساب إجمالي الطلاب (بدون تكرار)
        const allEnrollments = courses.flatMap(course => course.enrollments);
        const uniqueStudentIds = [...new Set(allEnrollments.map(enrollment => enrollment.userId))];
        const totalStudents = uniqueStudentIds.length;

        // حساب الاختبارات النشطة (التي لم تنته بعد أو ليس لها تاريخ انتهاء)
        const activeQuizzes = courses.flatMap(course => 
            course.quizzes.filter(quiz => 
                !quiz.endDate || quiz.endDate > new Date()
            )
        ).length;

        // حساب معدل الإنجاز العام لجميع الطلاب
        const totalProgress = allEnrollments.reduce((sum, enrollment) => sum + (enrollment.progress || 0), 0);
        const averageProgress = allEnrollments.length > 0 ? totalProgress / allEnrollments.length : 0;

        // حساب معدل إكمال الواجبات (نسبة الطلاب الذين أكملوا الاختبارات)
        const allQuizzes = courses.flatMap(course => course.quizzes);
        const totalQuizSubmissions = allQuizzes.flatMap(quiz => quiz.submissions);
        const totalPossibleSubmissions = allQuizzes.length * totalStudents;
        const assignmentCompletionRate = totalPossibleSubmissions > 0 
            ? (totalQuizSubmissions.length / totalPossibleSubmissions) * 100 
            : 0;

        // حساب معدل الحضور
        const allLessons = courses.flatMap(course => course.lessons);
        const allAttendance = allLessons.flatMap(lesson => lesson.Attendance);
        const presentAttendance = allAttendance.filter(attendance => attendance.status === 'PRESENT');
        const attendanceRate = allAttendance.length > 0 
            ? (presentAttendance.length / allAttendance.length) * 100 
            : 0;

        // حساب معدل النجاح في الاختبارات
        const passedSubmissions = totalQuizSubmissions.filter(submission => submission.passed === true);
        const successRate = totalQuizSubmissions.length > 0 
            ? (passedSubmissions.length / totalQuizSubmissions.length) * 100 
            : 0;

        // حساب معدل مشاهدة الدروس
        const allWatchedLessons = allLessons.flatMap(lesson => lesson.WatchedLesson);
        const totalPossibleWatches = allLessons.length * totalStudents;
        const lessonWatchRate = totalPossibleWatches > 0 
            ? (allWatchedLessons.length / totalPossibleWatches) * 100 
            : 0;

        // بيانات النشاط الأسبوعي
        const weeklyData = await this.calculateWeeklyActivity(parent.id);

        // بيانات إنجاز الكورسات
        const courseCompletionData = courses.map(course => {
            const courseEnrollments = course.enrollments;
            const completed = courseEnrollments.filter(e => e.progress >= 100).length;
            const inProgress = courseEnrollments.filter(e => e.progress > 0 && e.progress < 100).length;
            const notStarted = courseEnrollments.filter(e => e.progress === 0).length;

            return {
                courseId: course.id,
                title: course.title,
                completed,
                inProgress,
                notStarted,
                totalStudents: courseEnrollments.length,
            };
        });

        // تفاصيل الاختبارات
        const quizStatistics = allQuizzes.map(quiz => ({
            id: quiz.id,
            title: quiz.title,
            courseTitle: courses.find(c => c.id === quiz.courseId)?.title,
            totalSubmissions: quiz.submissions.length,
            averageScore: quiz.averageScore || 0,
            passRate: quiz.submissions.length > 0 
                ? (quiz.submissions.filter(s => s.passed).length / quiz.submissions.length) * 100 
                : 0,
        }));

        return {
            statistics: {
                totalCourses,
                totalStudents,
                activeQuizzes,
                averageProgress: Math.round(averageProgress * 100) / 100,
            },
            performanceMetrics: {
                assignmentCompletionRate: Math.round(assignmentCompletionRate * 100) / 100,
                attendanceRate: Math.round(attendanceRate * 100) / 100,
                successRate: Math.round(successRate * 100) / 100,
                lessonWatchRate: Math.round(lessonWatchRate * 100) / 100,
            },
            weeklyData,
            recentNotifications,
            courseCompletionData,
            quizStatistics,
            courses: courses.map(course => ({
                id: course.id,
                title: course.title,
                description: course.description,
                image: course.image,
                studentsCount: course.enrollments.length,
                quizzesCount: course.quizzes.length,
                lessonsCount: course.lessons.length,
                averageProgress: course.enrollments.length > 0 
                    ? course.enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / course.enrollments.length 
                    : 0,
            })),
        };
    }

    private async calculateWeeklyActivity(parentId: string) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // جلب الأنشطة الأسبوعية
        const weeklySubmissions = await this.prisma.submission.findMany({
            where: {
                createdAt: { gte: oneWeekAgo },
                quiz: {
                    course: {
                        instructors: {
                            some: { id: parentId },
                        },
                    },
                },
            },
            select: {
                createdAt: true,
            },
        });

        const weeklyEnrollments = await this.prisma.enrollment.findMany({
            where: {
                createdAt: { gte: oneWeekAgo },
                course: {
                    instructors: {
                            some: { id: parentId },
                    },
                },
            },
            select: {
                createdAt: true,
            },
        });

        // تجميع البيانات حسب اليوم
        const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        const weeklyData = daysOfWeek.map((dayName, index) => {
            const daySubmissions = weeklySubmissions.filter(s => s.createdAt.getDay() === index).length;
            const dayEnrollments = weeklyEnrollments.filter(e => e.createdAt.getDay() === index).length;
            
            return {
                name: dayName,
                students: dayEnrollments,
                quizzes: daySubmissions,
            };
        });

        return weeklyData;
    }
    async getReports(parentId: string) {
        const parent = await this.prisma.parent.findFirst({
            where: { userId: parentId },
        });
        if (!parent) {
            throw new NotFoundException('Parent not found');
        }
    
        let children = await this.prisma.user.findMany({
            where: {
                Child: {
                    some: {AND: [ { parentId: parent.id }, { status: 'ACTIVE' } ] },
                },
            },
            include: {
                Attendance: true,
                Submission: true,
                enrollments: {
                    include: {
                        course: {
                            include: {
                                lessons: true,
                            },
                        },
                    },
                },
                WatchedLesson: true,
            },
        });
    
        function getMonthRange(year: number, month: number) {
            let start = new Date(year, month, 1);
            let end = new Date(year, month + 1, 0);
            return { start, end };
        }
    
        let allReports: any[] = [];
    
        children.forEach((child) => {
            let firstLogin = new Date(child.createdAt);
            let now = new Date();
    
            let year = firstLogin.getFullYear();
            let month = firstLogin.getMonth();
    
            // loop من أول تسجيل لحد الشهر الحالي
            while (year < now.getFullYear() || (year === now.getFullYear() && month <= now.getMonth())) {
                let { start, end } = getMonthRange(year, month);
    
                let monthlyAttendance = (child.Attendance || []).filter(a => {
                    let date = new Date(a.createdAt);
                    return date >= start && date <= end && a.status === 'PRESENT';
                });
    
                let monthlyWatchedLessons = (child.WatchedLesson || []).filter(l => {
                    let date = new Date(l.createdAt);
                    return date >= start && date <= end;
                });
    
                let monthlySubmissions = (child.Submission || []).filter(s => {
                    let date = new Date(s.createdAt);
                    return date >= start && date <= end;
                });
    
                allReports.push({
                    id: child.id,
                    title: `تقرير شهري - ${start.toLocaleString('ar-EG', { month: 'long', year: 'numeric' })}`,
                    type: 'monthly',
                    childName: `${child.firstName} ${child.lastName}`,
                    date: start.toISOString(),
                    status: 'completed',
                    summary: {
                        attendance: monthlyAttendance.length,
                        watchedLessons: monthlyWatchedLessons.length,
                        averageScore: monthlySubmissions.length > 0
                            ? monthlySubmissions.reduce((sum, s) => sum + s.score, 0) / monthlySubmissions.length
                            : 0,
                        completedCourses: (child.enrollments || []).filter(e => e.progress >= 100).length,
                        totalLessons: (child.enrollments || []).reduce((sum, e) => sum + (e.course?.lessons?.length || 0), 0),
                        completedLessons: monthlyWatchedLessons.length
                    }
                });
    
                // الانتقال للشهر التالي
                month++;
                if (month > 11) {
                    month = 0;
                    year++;
                }
            }
        });
    
        return allReports;
    }
    
} 