import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from 'dtos/Course.create.dto';
import { UpdateCourseDto } from 'dtos/Course.update.dto';
import { Course, UserRole } from '@shared/prisma';

@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService) { }

    async create(createCourseInput: CreateCourseDto) {
        return this.prisma.course.create({
            data: {
                ...createCourseInput,
            },
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
                lessons: {
                    include: {
                        files: true,
                    },
                },
                quizzes: true,
            },
        });
    }

    async findAll() {
        return this.prisma.course.findMany({
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
                lessons: true,
                quizzes: true,
            },
        });
    }

    async findOne(id: string) {
        const course = await this.prisma.course.findUnique({
            where: { id },
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
                quizzes: true,
                lessons: {
                    include: {
                        files: true,
                    },
                },
            },
        });

        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }

        return course;
    }

    async update(id: string, updateCourseInput: UpdateCourseDto) {
        await this.findOne(id);
        return this.prisma.course.update({
            where: { id },
            data: updateCourseInput,
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
                quizzes: true,
                lessons: {
                    include: {
                        files: true,
                    },
                },
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.course.delete({
            where: { id },
        });
    }

    async enrollStudent(courseId: string, studentId: string) {
        let course = await this.findOne(courseId);
        if (!course) {
            throw new NotFoundException('Course  no found');
        }
        let student = await this.prisma.user.findUnique({
            where: { id: studentId },
        });
        if (!student) {
            throw new NotFoundException('Student not found');
        }
        if (student.role !== UserRole.STUDENT) {
            throw new NotFoundException('Student is not a student');
        }
        return this.prisma.course.update({
            where: { id: courseId },
            data: {
                enrollments: {
                    connect: { id: studentId },
                },
            },
            include: {
                instructors: {
                    include: {
                        user: true,
                    },
                },
                quizzes: true,
                enrollments: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }
    async unenrollStudent(courseId: string, studentId: string) {
        const course = await this.findOne(courseId);
        if (!course) {
            throw new NotFoundException('Course not found');
        }
        return this.prisma.course.update({
            where: { id: courseId },
            data: { enrollments: { disconnect: { id: studentId } } },
        });
    }
    async addInstructor(courseId: string, instructorId: string) {
        const course = await this.findOne(courseId);
        if (!course) {
            throw new NotFoundException('Course not found');
        }
        let user = await this.prisma.user.findUnique({
            where: { id: instructorId },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (user.role !== UserRole.INSTRUCTOR) {
            throw new NotFoundException('User is not an instructor');
        }
        let instructor = await this.prisma.instructor.findFirst({
            where: { userId: instructorId },
        });
        if (!instructor) {

            return this.prisma.course.update({
                where: { id: courseId },
                data: { instructors: { create: { userId: instructorId, academyId: course.academyId } } },
            });
        }
        return this.prisma.course.update({
            where: { id: courseId },
            data: { instructors: { connect: { id: instructor.id } } },
        });
    }
    async removeInstructor(courseId: string, instructorId: string) {
        const course = await this.findOne(courseId);
        if (!course) {
            throw new NotFoundException('Course not found');
        }
        return this.prisma.course.update({
            where: { id: courseId },
            data: { instructors: { disconnect: { id: instructorId } } },
        });
    }

    async getCourseLessons(courseId: string) {
        await this.findOne(courseId);
        return this.prisma.lesson.findMany({
            where: { courseId },
            include: {
                course: true,
            },
        });
    }

    async getCourseQuizzes(courseId: string) {
        await this.findOne(courseId);
        return this.prisma.quiz.findMany({
            where: { Course: { some: { id: courseId } } },
            include: {
                Course: true,
                questions: true,
            },
        });
    }

    async getCourseStudents(courseId: string) {
        await this.findOne(courseId);
        return this.prisma.enrollment.findMany({
            where: {
                courseId ,
            },
            include: {
                user: true,
                course:true
            },
        });
    }
    async getCourseInstructors(courseId: string) {
        await this.findOne(courseId);
        return this.prisma.instructor.findMany({
            where: { courses: { some: { id: courseId } } },
        });
    }
    async getCoursesByStudentId(studentId: string) {
        const student = await this.prisma.user.findUnique({
            where: { id: studentId },
            include: {
                enrollments: true,
            },
        });
        if (!student) {
            throw new NotFoundException('Student not found');
        }
        return this.prisma.course.findMany({
            where: { enrollments: { some: { userId: studentId } } },
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
                lessons: true,
                quizzes: true,
            },
        });
    }
    async getCoursesByAcademyId(academyId: string): Promise<Course[]> {
        const academy = await this.prisma.academy.findUnique({
            where: { id: academyId },
            include: {
                courses: true,
            },
        });
        if (!academy) {
            throw new NotFoundException('Academy not found');
        }
        return academy.courses;
    }
    async getCoursesByInstructorId(instructorId: string): Promise<Course[]> {
        const instructor = await this.prisma.instructor.findFirst({
            where: { userId: instructorId },
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
                lessons: true,
                quizzes: true,
            },
        });
    }

} 