import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '@shared/prisma';

@Injectable()
export class CalendarService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService,
    ) { }

    async createEvent(data: {
        title: string;
        description?: string;
        startTime: Date;
        endTime: Date;
        userId: string;
    }) {
        const event = await this.prisma.event.create({
            data: {
                title: data.title,
                description: data.description,
                startTime: data.startTime,
                endTime: data.endTime
            },
        });

        await this.notificationsService.create({
            userId: data.userId,
            type: NotificationType.MESSAGE,
            isImportant: false,
            urgent: false,
            read: false,
            createdAt: new Date(),
            title: 'حدث جديد',
            message: `تم إنشاء حدث جديد: ${data.title}`,
        });

        return event;
    }

    async getEvent(id: string) {
        return this.prisma.event.findUnique({
            where: { id },
        });
    }

    async updateEvent(
        id: string,
        data: {
            title?: string;
            description?: string;
            startTime?: Date;
            endTime?: Date;
        },
    ) {
        return this.prisma.event.update({
            where: { id },
            data,
        });
    }

    async deleteEvent(id: string) {
        return this.prisma.event.delete({
            where: { id },
        });
    }

    async listEvents() {
        return this.prisma.event.findMany({
        });
    }

    async getEventsByDateRange(startDate: Date, endDate: Date) {
        return this.prisma.event.findMany({
            where: {
                startTime: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
    }
} 