import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAttendanceDto } from 'dtos/Attendance.create.dto';
import { UpdateAttendanceDto } from 'dtos/Attendance.update.dto';
import { Attendance, NotificationType } from '@shared/prisma';
@Injectable()
export class AttendanceService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService
    ) { }

    async create(createAttendanceInput: CreateAttendanceDto): Promise<Attendance> {
        const attendance = await this.prisma.attendance.create({
            data: createAttendanceInput
        });

        // إرسال إشعار للأهل في حالة الغياب
        if (createAttendanceInput.status === 'ABSENT') {
            await this.notificationsService.create({
                title: 'غياب الطالب',
                message: `تم تسجيل غياب الطالب في الدرس ${createAttendanceInput.lessonId}`,
                userId: createAttendanceInput.studentId,
                type: 'ATTENDANCE' as NotificationType,
                read: false,
                createdAt: new Date(),
                isImportant: false,
                urgent: false
            });
        }

        return attendance;
    }

    async findAll() {
        return this.prisma.attendance.findMany();
    }

    async findOne(id: string) {
        return this.prisma.attendance.findUnique({
            where: { id }
        });
    }

    async update(id: string, updateAttendanceInput: UpdateAttendanceDto) {
        return this.prisma.attendance.update({
            where: { id },
            data: updateAttendanceInput
        });
    }

    async remove(id: string) {
        return this.prisma.attendance.delete({
            where: { id }
        });
    }

    async trackAttendance(lessonId: string, studentId: string, method: 'FACE_ID' | 'QR_CODE') {
        const attendance = await this.prisma.attendance.create({
            data: {
                lessonId,
                studentId,
                status: 'PRESENT',
                method
            }
        });

        return attendance;
    }

    async getStudentAttendanceStats(studentId: string) {
        const stats = await this.prisma.attendance.groupBy({
            by: ['status'],
            where: { studentId },
            _count: true
        });

        return stats;
    }
    async getStudentAttendance(studentId: string) {
        return this.prisma.attendance.findMany({
            where: { studentId }
        });
    }
    async getStudentAttendanceByLesson(lessonId: string) {
        return this.prisma.attendance.findMany({
            where: { lessonId }
        });
    }
    async getStudentAttendanceByDate(date: Date) {
        return this.prisma.attendance.findMany({
            where: { createdAt: { gte: date, lte: date } }
        });
    }
    async getStudentAttendanceByDateAndLesson(date: Date, lessonId: string) {
        return this.prisma.attendance.findMany({
            where: { createdAt: { gte: date, lte: date }, lessonId }
        });

    }
    async getStudentAttendanceByDateAndStudent(date: Date, studentId: string) {
        return this.prisma.attendance.findMany({
            where: { createdAt: { gte: date, lte: date }, studentId }
        });
    }
    async getStudentAttendanceByDateAndStudentAndLesson(date: Date, studentId: string, lessonId: string) {
        return this.prisma.attendance.findMany({
            where: { createdAt: { gte: date, lte: date }, studentId, lessonId }
        });
    }
    async getStudentAttendanceByDateAndStudentAndLessonAndStatus(date: Date, studentId: string, lessonId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') {
        return this.prisma.attendance.findMany({
            where: { createdAt: { gte: date, lte: date }, studentId, lessonId, status }
        });
    }
} 