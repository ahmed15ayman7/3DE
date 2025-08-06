import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Notification, NotificationSettings } from '@shared/prisma';
import { CreateNotificationDto } from 'dtos/Notification.create.dto';
import { UpdateNotificationDto } from 'dtos/Notification.update.dto';
import { CreateNotificationSettingsDto } from 'dtos/NotificationSettings.create.dto';
import { UpdateNotificationSettingsDto } from 'dtos/NotificationSettings.update.dto';


@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
        let user = await this.prisma.user.findUnique({
            where: { id: createNotificationDto.userId },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        let notification = await this.prisma.notification.create({
            data: {
                ...createNotificationDto,
                userId: user.id,
            },
        });
        return notification;
    }

    async findAll(search?: string, take?: number, skip?: number): Promise<{ data: Notification[], total: number, totalPages: number }> {
        let notifications = await this.prisma.notification.findMany({
            where: {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { message: { contains: search, mode: 'insensitive' } },
                    { user: { firstName: { contains: search, mode: 'insensitive' } } },
                    { user: { lastName: { contains: search, mode: 'insensitive' } } }
                ]
            },
            take,
            skip
        });
        let total = await this.prisma.notification.count({
            where: {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { message: { contains: search, mode: 'insensitive' } },
                    { user: { firstName: { contains: search, mode: 'insensitive' } } },
                    { user: { lastName: { contains: search, mode: 'insensitive' } } }
                ]
            }
        });
        return { data: notifications, total,totalPages:Math.ceil(total/take) };
    }

    async findOne(id: string): Promise<Notification> {
        return this.prisma.notification.findUnique({
            where: { id },
        });
    }
    async findAllByUserId(userId: string, search?: string, take?: number, skip?: number): Promise<{ data: Notification[], total: number, totalPages: number }> {
            let notifications = await this.prisma.notification.findMany({
            where: {
                userId,
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { message: { contains: search, mode: 'insensitive' } },
                    { user: { firstName: { contains: search, mode: 'insensitive' } } },
                    { user: { lastName: { contains: search, mode: 'insensitive' } } }
                ]
            },
            take,
            skip
        });
        let total = await this.prisma.notification.count({
            where: {
                userId,
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { message: { contains: search, mode: 'insensitive' } },
                    { user: { firstName: { contains: search, mode: 'insensitive' } } },
                    { user: { lastName: { contains: search, mode: 'insensitive' } } }
                ]
            }
        });
            return { data: notifications, total,totalPages:Math.ceil(total/take) };
    }

    async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
        return this.prisma.notification.update({
            where: { id },
            data: updateNotificationDto,
        });
    }

    async remove(id: string): Promise<Notification> {
        return this.prisma.notification.delete({
            where: { id },
        });
    }

    async getSettings(userId: string): Promise<NotificationSettings> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return this.prisma.notificationSettings.findFirst({
            where: { user: { id: userId } },
        });
    }
    async getSettingsByUserId(userId: string): Promise<NotificationSettings> {
        return this.prisma.notificationSettings.findFirst({
            where: { user: { id: userId } },
        });
    }

    async updateSettings(userId: string, settings: UpdateNotificationSettingsDto): Promise<NotificationSettings> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const setting = await this.prisma.notificationSettings.findFirst({
            where: { user: { id: userId } },
        });
        if (!setting) {
            throw new NotFoundException('Settings not found');
        }
        return this.prisma.notificationSettings.update({
            where: { id: setting.id },
            data: settings,
        });
    }
    async createSettings(settings: CreateNotificationSettingsDto): Promise<NotificationSettings> {
        const user = await this.prisma.user.findUnique({
            where: { id: settings.userId },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return this.prisma.notificationSettings.create({
            data: {
                userId: user.id,
                ...settings
            },
        });
    }
}