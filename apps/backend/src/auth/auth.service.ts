import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'dtos/User.create.dto';
import { User } from '@shared/prisma';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from 'dtos/User.update.dto';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }
    async refreshToken(token: string) {
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            });
            const user = await this.usersService.findOne(payload.sub);
            if (!user) {
                throw new UnauthorizedException();
            }
            return this.login(user, token);
        } catch {
            throw new UnauthorizedException();
        }
    }

    private generateRefreshToken(payload: any): string {
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
        });
    }
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        let verify = await bcrypt.compare(password, user?.password);
        console.log(verify);
        if (user && verify) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: User, refreshToken?: string) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            refreshToken: refreshToken ?? this.generateRefreshToken(payload),
            user: {
                id: user.id,
                email: user.email,
                firstName: user?.firstName,
                lastName: user?.lastName,
                role: user?.role,
            },
        };
    }

    async register(userData: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        let existingUser = await this.usersService.findByEmail(userData.email);
        if (existingUser) {
            throw new BadRequestException('البريد الإلكتروني مستخدم من قبل');
        }
        const user = await this.usersService.create({
            ...userData,
            password: hashedPassword,
        });
        return this.login(user);
    }
    async forgotPassword(email: string,) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        console.log(user);
        const token = await this.jwtService.signAsync({ email: user.email }, { expiresIn: '1h' });
        const resetPasswordUrl = `/reset-password?token=${token}`;
        return resetPasswordUrl;
    }
    async resetPassword(token: string, password: string) {
        const decoded = this.jwtService.verify(token);
        const user = await this.usersService.findByEmail(decoded.email);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.usersService.update(user.id, { password: hashedPassword } as UpdateUserDto);
        return { message: 'Password reset successfully' };
    }
} 