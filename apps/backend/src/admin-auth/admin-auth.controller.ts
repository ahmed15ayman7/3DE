import { Controller, Post, Body, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@/auth/auth.guard';
import { AdminAuthService } from './admin-auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateAdminDto } from 'dtos/Admin.create.dto';
import { LoginDto } from '@/auth/dto/login.dto';

@ApiTags('بيانات المدير')
@Controller('admin-auth')
export class AdminAuthController {
    constructor(private readonly adminAuthService: AdminAuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.adminAuthService.login(loginDto.email, loginDto.password);
    }
    @Post('refresh-token')
    async refreshToken(@Body() refreshTokenDto: { refreshToken: string }) {
        return this.adminAuthService.refreshToken(refreshTokenDto.refreshToken);
    }
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        return this.adminAuthService.getProfile(req.user.id);
    }
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get('admin-by-user-id')
    async getAdminByUserId(@Query('userId') userId: string) {
        return this.adminAuthService.getAdminByUserId(userId);
    }
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post('create-admin')
    async createAdmin(@Body() createAdminDto: CreateAdminDto) {
        return this.adminAuthService.createAdmin(createAdminDto);
    }

    @UseGuards(AuthGuard)
    @Get('dashboard/stats')
    async getDashboardStats(
        @Request() req,
        @Query('timeRange') timeRange: 'day' | 'week' | 'month' | 'year' = 'month'
    ) {
        return this.adminAuthService.getDashboardStats(req.user.id, timeRange);
    }
} 