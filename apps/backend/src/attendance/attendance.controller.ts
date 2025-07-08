import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from '../../dtos/Attendance.create.dto';
import { UpdateAttendanceDto } from '../../dtos/Attendance.update.dto';
import { Attendance } from '@shared/prisma';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
@ApiTags('الحضور والانصراف')
@Controller('attendance')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post()
    async create(@Body() createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
        return this.attendanceService.create(createAttendanceDto);
    }

    @Get()
    async findAll(): Promise<Attendance[]> {
        return this.attendanceService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Attendance> {
        return this.attendanceService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateAttendanceDto: UpdateAttendanceDto,
    ): Promise<Attendance> {
        return this.attendanceService.update(id, updateAttendanceDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Attendance> {
        return this.attendanceService.remove(id);
    }
    @Get('student/:studentId')
    async getStudentAttendance(@Param('studentId') studentId: string): Promise<Attendance[]> {
        return this.attendanceService.getStudentAttendance(studentId);
    }
    @Get('lesson/:lessonId')
    async getStudentAttendanceByLesson(@Param('lessonId') lessonId: string): Promise<Attendance[]> {
        return this.attendanceService.getStudentAttendanceByLesson(lessonId);
    }
    @Get('date/:date')
    async getStudentAttendanceByDate(@Param('date') date: string): Promise<Attendance[]> {
        return this.attendanceService.getStudentAttendanceByDate(new Date(date));
    }
    @Get('date/:date/lesson/:lessonId')
    async getStudentAttendanceByDateAndLesson(@Param('date') date: string, @Param('lessonId') lessonId: string): Promise<Attendance[]> {
        return this.attendanceService.getStudentAttendanceByDateAndLesson(new Date(date), lessonId);
    }
    @Get('date/:date/student/:studentId')
    async getStudentAttendanceByDateAndStudent(@Param('date') date: string, @Param('studentId') studentId: string): Promise<Attendance[]> {
        return this.attendanceService.getStudentAttendanceByDateAndStudent(new Date(date), studentId);
    }
    @Get('date/:date/student/:studentId/lesson/:lessonId')
    async getStudentAttendanceByDateAndStudentAndLesson(@Param('date') date: string, @Param('studentId') studentId: string, @Param('lessonId') lessonId: string): Promise<Attendance[]> {
        return this.attendanceService.getStudentAttendanceByDateAndStudentAndLesson(new Date(date), studentId, lessonId);
    }
    @Get('date/:date/student/:studentId/lesson/:lessonId/status/:status')
    async getStudentAttendanceByDateAndStudentAndLessonAndStatus(@Param('date') date: string, @Param('studentId') studentId: string, @Param('lessonId') lessonId: string, @Param('status') status: 'PRESENT' | 'ABSENT' | 'LATE'): Promise<Attendance[]> {
        return this.attendanceService.getStudentAttendanceByDateAndStudentAndLessonAndStatus(new Date(date), studentId, lessonId, status);
    }

} 