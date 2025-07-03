import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from '../../dtos/Course.create.dto';
import { UpdateCourseDto } from '../../dtos/Course.update.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Course, Enrollment, Instructor, Lesson, Quiz, User } from '@shared/prisma';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('الكورسات')
@Controller('courses')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @Post()
    async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
        return this.coursesService.create(createCourseDto);
    }

    @Get()
    async findAll(): Promise<Course[]> {
        return this.coursesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Course> {
        return this.coursesService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCourseDto: UpdateCourseDto,
    ): Promise<Course> {
        return this.coursesService.update(id, updateCourseDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Course> {
        return this.coursesService.remove(id);
    }
    @Post(':id/enroll')
    async enrollStudent(@Param('id') id: string, @Body() body: { studentId: string }): Promise<Course> {
        return this.coursesService.enrollStudent(id, body.studentId);
    }
    @Post(':id/unenroll')
    async unenrollStudent(@Param('id') id: string, @Body() body: { studentId: string }): Promise<Course> {
        return this.coursesService.unenrollStudent(id, body.studentId);
    }
    @Post(':id/add-instructor/:instructorId')
    async addInstructor(@Param('id') id: string, @Param('instructorId') instructorId: string): Promise<Course> {
        return this.coursesService.addInstructor(id, instructorId);
    }
    @Post(':id/remove-instructor')
    async removeInstructor(@Param('id') id: string, @Body() body: { instructorId: string }): Promise<Course> {
        return this.coursesService.removeInstructor(id, body.instructorId);
    }
    @Get(':id/lessons')
    async getCourseLessons(@Param('id') id: string): Promise<Lesson[]> {
        return this.coursesService.getCourseLessons(id);
    }
    @Get(':id/quizzes')
    async getCourseQuizzes(@Param('id') id: string): Promise<Quiz[]> {
        return this.coursesService.getCourseQuizzes(id);
    }
    @Get(':id/students')
    async getCourseStudents(@Param('id') id: string): Promise<Enrollment[]> {
        return this.coursesService.getCourseStudents(id);
    }
    @Get(':id/instructors')
    async getCourseInstructors(@Param('id') id: string): Promise<Instructor[]> {
        return this.coursesService.getCourseInstructors(id);
    }

    @Get('by-student/:id')
    async getCoursesByStudentId(@Param('id') id: string): Promise<Course[]> {
        return this.coursesService.getCoursesByStudentId(id);
    }

    @Get('by-instructor/:id')
    async getCoursesByInstructorId(@Param('id') id: string): Promise<Course[]> {
        return this.coursesService.getCoursesByInstructorId(id);
    }

    @Get('by-academy/:id')
    async getCoursesByAcademyId(@Param('id') id: string): Promise<Course[]> {
        return this.coursesService.getCoursesByAcademyId(id);
    }
} 