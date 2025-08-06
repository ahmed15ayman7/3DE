import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from 'dtos/Notification.create.dto';
import { UpdateNotificationDto } from 'dtos/Notification.update.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Notification } from '@shared/prisma';
import { CreateNotificationSettingsDto } from 'dtos/NotificationSettings.create.dto';
import { UpdateNotificationSettingsDto } from 'dtos/NotificationSettings.update.dto';
@ApiTags('الإشعارات')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Post()
    @ApiOperation({ summary: 'إنشاء إشعار جديد' })
    @ApiResponse({ status: 201, description: 'تم إنشاء الإشعار بنجاح' })
    create(@Body() createNotificationDto: CreateNotificationDto): Promise<Notification> {
        return this.notificationsService.create(createNotificationDto);
    }

    @Get()
    @ApiOperation({ summary: 'الحصول على جميع الإشعارات' })
    @ApiResponse({ status: 200, description: 'تم جلب الإشعارات بنجاح' })
    findAll(@Query('search') search?: string, @Query('take') take?: number, @Query('skip') skip?: number): Promise<{ data: Notification[], total: number, totalPages: number }> {
        return this.notificationsService.findAll(search, take, skip);
    }

    @Get(':id')
    @ApiOperation({ summary: 'الحصول على إشعار محدد' })
    @ApiResponse({ status: 200, description: 'تم جلب الإشعار بنجاح' })
    findOne(@Param('id') id: string) {
        return this.notificationsService.findOne(id);
    }

    @Get("user/:userId")
    @ApiOperation({ summary: 'الحصول على إشعارات محددة للمستخدم' })
    @ApiResponse({ status: 200, description: 'تم جلب الإشعارات بنجاح' })
    findAllByUserId(@Param('userId') userId: string, @Query('search') search?: string, @Query('take') take?: number, @Query('skip') skip?: number): Promise<{ data: Notification[], total: number, totalPages: number }> {
        return this.notificationsService.findAllByUserId(userId, search, take, skip);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'تحديث إشعار' })
    @ApiResponse({ status: 200, description: 'تم تحديث الإشعار بنجاح' })
    update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
        return this.notificationsService.update(id, updateNotificationDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'حذف إشعار' })
    @ApiResponse({ status: 200, description: 'تم حذف الإشعار بنجاح' })
    remove(@Param('id') id: string) {
        return this.notificationsService.remove(id);
    }

    @Get('settings/:userId')
    @ApiOperation({ summary: 'الحصول على إعدادات الإشعارات' })
    @ApiResponse({ status: 200, description: 'تم جلب الإعدادات بنجاح' })
    getSettings(@Param('userId') userId: string) {
        return this.notificationsService.getSettings(userId);
    }

    @Get('settings/user/:userId')
    @ApiOperation({ summary: 'الحصول على إعدادات الإشعارات' })
    @ApiResponse({ status: 200, description: 'تم جلب الإعدادات بنجاح' })
    getSettingsByUserId(@Param('userId') userId: string) {
        return this.notificationsService.getSettingsByUserId(userId);
    }

    @Patch('settings/:userId')
    @ApiOperation({ summary: 'تحديث إعدادات الإشعارات' })
    @ApiResponse({ status: 200, description: 'تم تحديث الإعدادات بنجاح' })
    updateSettings(@Param('userId') userId: string, @Body() updateNotificationSettingsDto: UpdateNotificationSettingsDto) {
        return this.notificationsService.updateSettings(userId, updateNotificationSettingsDto);
    }

    @Post("settings")
    @ApiOperation({ summary: 'تحديث إعدادات الإشعارات' })
    @ApiResponse({ status: 200, description: 'تم تحديث الإعدادات بنجاح' })
    createSettings(@Body() createNotificationSettingsDto: CreateNotificationSettingsDto) {
        return this.notificationsService.createSettings(createNotificationSettingsDto);
    }
} 