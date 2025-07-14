import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { InstructorsService } from './instructors.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CreateInstructorDto } from 'dtos/Instructor.create.dto';
import { UpdateInstructorDto } from 'dtos/Instructor.update.dto';

@ApiTags('المدرسين')
@Controller('instructors')
export class InstructorsController {
    constructor(private readonly instructorsService: InstructorsService) { }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'إنشاء مستخدم جديد' })
    @ApiResponse({ status: 201, description: 'تم إنشاء المستخدم بنجاح' })
    create(@Body() createUserDto: CreateInstructorDto) {
        return this.instructorsService.create(createUserDto);
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'الحصول على جميع المستخدمين' })
    @ApiResponse({ status: 200, description: 'تم جلب المستخدمين بنجاح' })
    findAll(@Query('skip') skip: number, @Query('limit') limit: number, @Query('search') search?: string) {
        return this.instructorsService.findAll(+skip, +limit, search ?? "");
    }

    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'الحصول على مستخدم محدد' })
    @ApiResponse({ status: 200, description: 'تم جلب المستخدم بنجاح' })
    findOne(@Param('id') id: string) {
        return this.instructorsService.findOne(id);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'تحديث بيانات مستخدم' })
    @ApiResponse({ status: 200, description: 'تم تحديث المستخدم بنجاح' })
    update(@Param('id') id: string, @Body() updateInstructorDto: UpdateInstructorDto) {
        return this.instructorsService.update(id, updateInstructorDto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'حذف مستخدم' })
    @ApiResponse({ status: 200, description: 'تم حذف المستخدم بنجاح' })
    remove(@Param('id') id: string) {
        return this.instructorsService.remove(id);
    }

    @Get(':id/courses')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'الحصول على المواد المدرسة' })
    @ApiResponse({ status: 200, description: 'تم جلب المواد المدرسة بنجاح' })
    getCourses(@Param('id') id: string) {
        return this.instructorsService.getCourses(id);
    }

    @Get('for-students')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'الحصول على المدرسين للطلاب' })
    @ApiResponse({ status: 200, description: 'تم جلب المدرسين بنجاح' })
    getAllForStudents() {
        return this.instructorsService.findAllForStudents();
    }

    @Get('public')
    @ApiOperation({ summary: 'الحصول على المدرسين العامة' })
    @ApiResponse({ status: 200, description: 'تم جلب المدرسين العامة بنجاح' })
    getPublicInstructors(@Query('search') search?: string) {
        return this.instructorsService.getPublicInstructors(search ?? "");
    }
} 