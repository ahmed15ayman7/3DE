import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    UseGuards 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateUserDto } from 'dtos/User.create.dto';
import { UpdateUserDto } from 'dtos/User.update.dto';
import { UpdateTwoFactorDto } from 'dtos/TwoFactor.update.dto';
import { UserRole } from '@shared/prisma';

@ApiTags('المستخدمين')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard) // تطبيق الحماية بالـ JWT + الـ Roles
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @Roles(UserRole.ADMIN) // فقط الأدمن
    @ApiOperation({ summary: 'إنشاء مستخدم جديد' })
    @ApiResponse({ status: 201, description: 'تم إنشاء المستخدم بنجاح' })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @Roles(UserRole.ADMIN,UserRole.PARENT) // فقط الأدمن
    @ApiOperation({ summary: 'الحصول على جميع المستخدمين' })
    @ApiResponse({ status: 200, description: 'تم جلب المستخدمين بنجاح' })
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.STUDENT,UserRole.INSTRUCTOR,UserRole.PARENT) // يسمح للأدمن و المستخدم نفسه
    @ApiOperation({ summary: 'الحصول على مستخدم محدد' })
    @ApiResponse({ status: 200, description: 'تم جلب المستخدم بنجاح' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN,UserRole.STUDENT,UserRole.INSTRUCTOR,UserRole.PARENT) // فقط الأدمن
    @ApiOperation({ summary: 'تحديث بيانات مستخدم' })
    @ApiResponse({ status: 200, description: 'تم تحديث المستخدم بنجاح' })
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN) // فقط الأدمن
    @ApiOperation({ summary: 'حذف مستخدم' })
    @ApiResponse({ status: 200, description: 'تم حذف المستخدم بنجاح' })
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

    @Get(':id/two-factor')
    @Roles(UserRole.ADMIN, UserRole.STUDENT)
    @ApiOperation({ summary: 'الحصول على حالة المصادقة الثنائية' })
    @ApiResponse({ status: 200, description: 'تم جلب حالة المصادقة الثنائية بنجاح' })
    twoFactorStatus(@Param('id') id: string) {
        return this.usersService.getTwoFactor(id);
    }

    @Get(':id/login-history')
    @Roles(UserRole.ADMIN, UserRole.STUDENT)
    @ApiOperation({ summary: 'الحصول على تاريخ الدخول' })
    @ApiResponse({ status: 200, description: 'تم جلب تاريخ الدخول بنجاح' })
    loginHistory(@Param('id') id: string) {
        return this.usersService.getLoginHistory(id);
    }

    @Get(':id/achievements')
    @Roles(UserRole.ADMIN, UserRole.STUDENT)
    @ApiOperation({ summary: 'الحصول على الإنجازات' })
    @ApiResponse({ status: 200, description: 'تم جلب الإنجازات بنجاح' })
    achievements(@Param('id') id: string) {
        return this.usersService.getAchievements(id);
    }

    @Get(':id/enrollments')
    @Roles(UserRole.ADMIN, UserRole.STUDENT)
    @ApiOperation({ summary: 'الحصول على التسجيلات' })
    @ApiResponse({ status: 200, description: 'تم جلب التسجيلات بنجاح' })
    enrollments(@Param('id') id: string) {
        return this.usersService.getEnrollments(id);
    }

    @Get(':id/created-courses')
    @Roles(UserRole.ADMIN, UserRole.STUDENT)
    @ApiOperation({ summary: 'الحصول على المواد المنشئة' })
    @ApiResponse({ status: 200, description: 'تم جلب المواد المنشئة بنجاح' })
    createdCourses(@Param('id') id: string) {
        return this.usersService.getCreatedCourses(id);
    }

    @Post(':id/two-factor')
    @Roles(UserRole.ADMIN, UserRole.STUDENT)
    @ApiOperation({ summary: 'تفعيل المصادقة الثنائية' })
    @ApiResponse({ status: 200, description: 'تم تفعيل المصادقة الثنائية بنجاح' })
    twoFactor(@Body() twoFactorDto: UpdateTwoFactorDto, @Param('id') id: string) {
        return this.usersService.updateTwoFactor(id, twoFactorDto);
    }
}
