import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersService: UsersService,
        configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') || '',
        });
    }

    async validate(payload: any) {
        // payload.sub هو الـ userId
        const user = await this.usersService.findOne(payload.sub);

        if (!user) {
            throw new UnauthorizedException('User not found or deleted');
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role, // مهم للـ RolesGuard
        };
    }
}
