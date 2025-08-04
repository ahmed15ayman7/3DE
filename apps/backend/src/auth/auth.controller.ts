import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { CreateUserDto } from 'dtos/User.create.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('عمليات التسجيل والتحقق')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @UseGuards(LocalStrategy)
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(
            loginDto.email,
            loginDto.password,
            loginDto.device,
            loginDto.ip,
            loginDto.browser,
            loginDto.os,
        );
        if (!user) {
            return { statusCode: 401, message: 'Invalid credentials' };
        }
        return this.authService.login(user);
    }
    @UseGuards(LocalStrategy)
    @Post('register')
    async register(@Body() registerDto: CreateUserDto) {
        return this.authService.register(registerDto);
    }
    @Post('refresh-token')
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        try {
            return this.authService.refreshToken(refreshTokenDto.refreshToken);
        } catch (error) {
            return { statusCode: 400, message: 'Invalid refresh token' };
        }
    }
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        try {
            return this.authService.forgotPassword(forgotPasswordDto.email);
        } catch (error) {
            return { statusCode: 400, message: 'Invalid email' };
        }
    }
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        try {
            return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.password);
        } catch (error) {
            return { statusCode: 400, message: 'Invalid token' };
        }
    }
} 