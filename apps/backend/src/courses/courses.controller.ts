import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from '../../dtos/Course.create.dto';
import { UpdateCourseDto } from '../../dtos/Course.update.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Course, Enrollment, Instructor, Lesson, Quiz, User } from '@shared/prisma';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('الكورسات')
@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
        return this.coursesService.create(createCourseDto);
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async findAll(): Promise<Course[]> {
        return this.coursesService.findAll();
    }

    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async findOne(@Param('id') id: string): Promise<Course> {
        return this.coursesService.findOne(id);
    }

    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateCourseDto: UpdateCourseDto,
    ): Promise<Course> {
        return this.coursesService.update(id, updateCourseDto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async remove(@Param('id') id: string): Promise<Course> {
        return this.coursesService.remove(id);
    }
    @Post(':id/enroll')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async enrollStudent(@Param('id') id: string, @Body() body: { studentId: string }): Promise<Course> {
        return this.coursesService.enrollStudent(id, body.studentId);
    }
    @Post(':id/unenroll')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async unenrollStudent(@Param('id') id: string, @Body() body: { studentId: string }): Promise<Course> {
        return this.coursesService.unenrollStudent(id, body.studentId);
    }
    @Post(':id/add-instructor/:instructorId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async addInstructor(@Param('id') id: string, @Param('instructorId') instructorId: string): Promise<Course> {
        return this.coursesService.addInstructor(id, instructorId);
    }
    @Post(':id/remove-instructor')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async removeInstructor(@Param('id') id: string, @Body() body: { instructorId: string }): Promise<Course> {
        return this.coursesService.removeInstructor(id, body.instructorId);
    }
    @Get(':id/lessons')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async getCourseLessons(@Param('id') id: string): Promise<Lesson[]> {
        return this.coursesService.getCourseLessons(id);
    }
    @Get(':id/quizzes')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async getCourseQuizzes(@Param('id') id: string): Promise<Quiz[]> {
        return this.coursesService.getCourseQuizzes(id);
    }
    @Get(':id/students')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async getCourseStudents(@Param('id') id: string): Promise<Enrollment[]> {
        return this.coursesService.getCourseStudents(id);
    }
    @Get(':id/instructors')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async getCourseInstructors(@Param('id') id: string): Promise<Instructor[]> {
        return this.coursesService.getCourseInstructors(id);
    }

    @Get('by-student/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async getCoursesByStudentId(@Param('id') id: string): Promise<Course[]> {
        return this.coursesService.getCoursesByStudentId(id);
    }

    @Get('by-instructor/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async getCoursesByInstructorId(@Param('id') id: string): Promise<Course[]> {
        return this.coursesService.getCoursesByInstructorId(id);
    }

    @Get('by-academy/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async getCoursesByAcademyId(@Param('id') id: string): Promise<Course[]> {
        return this.coursesService.getCoursesByAcademyId(id);
    }

    @Get('public')
    async getCoursesPublic(@Query('search') search?: string): Promise<Course[]> {
        return this.coursesService.getCoursesPublic(search ?? "");
    }
} 