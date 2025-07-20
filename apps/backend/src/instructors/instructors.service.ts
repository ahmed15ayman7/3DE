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

    async findAllForStudents(instructorId:string) {
        let instructor = await this.prisma.instructor.findFirst({
            where: {
                userId: instructorId,
                user:{
                    role:"INSTRUCTOR"
                }
            },
        });
        if (!instructor) {
            throw new NotFoundException('Instructor not found');
        }
        return this.prisma.user.findMany({
            where: {
                enrollments: {
                    some: {
                        course: {
                            instructors: {
                                some: {
                                    id: instructor.id,
                                },
                            },
                        },
                    },
                },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                email: true,
                isOnline: true,
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
                                                id: instructorId,
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

    async getDashboardData(userId: string) {
        // العثور على المدرس
        const instructor = await this.prisma.instructor.findFirst({
            where: { userId },
            include: { user: true },
        });

        if (!instructor) {
            throw new NotFoundException('Instructor not found');
        }

        // جلب الكورسات مع البيانات التفصيلية
        const courses = await this.prisma.course.findMany({
            where: { 
                instructors: { 
                    some: { id: instructor.id } 
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
        const weeklyData = await this.calculateWeeklyActivity(instructor.id);

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

    private async calculateWeeklyActivity(instructorId: string) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // جلب الأنشطة الأسبوعية
        const weeklySubmissions = await this.prisma.submission.findMany({
            where: {
                createdAt: { gte: oneWeekAgo },
                quiz: {
                    course: {
                        instructors: {
                            some: { id: instructorId },
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
                        some: { id: instructorId },
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
} 