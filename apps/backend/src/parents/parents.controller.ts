import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CreateParentDto } from 'dtos/Parent.create.dto';
import { UpdateParentDto } from 'dtos/Parent.update.dto';
import { CreateChildDto } from 'dtos/Child.create.dto';

@ApiTags('الوليين')
@Controller('parents')
export class ParentsController {
    constructor(private readonly parentsService: ParentsService) { }

    
    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'إنشاء مستخدم جديد' })
    @ApiResponse({ status: 201, description: 'تم إنشاء المستخدم بنجاح' })
    create(@Body() createUserDto: CreateParentDto) {
        return this.parentsService.create(createUserDto);
    }
    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'الحصول على جميع المستخدمين' })
    @ApiResponse({ status: 200, description: 'تم جلب المستخدمين بنجاح' })
    findAll(@Query('skip') skip: number, @Query('take') take: number, @Query('search') search?: string) {
        return this.parentsService.findAll(+skip, +take, search ?? "");
    }
    
    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'الحصول على مستخدم محدد' })
    @ApiResponse({ status: 200, description: 'تم جلب المستخدم بنجاح' })
    findOne(@Param('id') id: string) {
        return this.parentsService.findOne(id);
    }
    
    @Patch(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'تحديث بيانات مستخدم' })
    @ApiResponse({ status: 200, description: 'تم تحديث المستخدم بنجاح' })
    update(@Param('id') id: string, @Body() updateParentDto: UpdateParentDto) {
        return this.parentsService.update(id, updateParentDto);
    }
    
    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'حذف مستخدم' })
    @ApiResponse({ status: 200, description: 'تم حذف المستخدم بنجاح' })
    remove(@Param('id') id: string) {
        return this.parentsService.remove(id);
    }
    @Post(":id/add-child")
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'إنشاء طفل جديد' })
    @ApiResponse({ status: 201, description: 'تم إنشاء الطفل بنجاح' })
    addChild(@Param('id') id: string, @Body() createChildDto: CreateChildDto) {
        return this.parentsService.addChild(id, createChildDto);
    }
    @Delete(":id/remove-child/:childId")
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'حذف طفل' })
    @ApiResponse({ status: 200, description: 'تم حذف الطفل بنجاح' })
    removeChild(@Param('id') id: string, @Param('childId') childId: string) {
        return this.parentsService.removeChild(id, childId);
    }
    
    @Get(':id/courses')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'الحصول على المواد المدرسة' })
    @ApiResponse({ status: 200, description: 'تم جلب المواد المدرسة بنجاح' })
    getCourses(@Param('id') id: string) {
        return this.parentsService.getCourses(id);
    }

    @Get('for-children/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'الحصول على المدرسين للطلاب' })
    @ApiResponse({ status: 200, description: 'تم جلب المدرسين بنجاح' })
    getAllForChildren(@Param('id') id: string) {
        return this.parentsService.findAllForChildren(id);
    }

    @Get(':id/dashboard')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'الحصول على بيانات dashboard المدرس' })
    @ApiResponse({ status: 200, description: 'تم جلب بيانات dashboard بنجاح' })
    getDashboardData(@Param('id') id: string) {
        return this.parentsService.getDashboardData(id);
    }

    @Get(':id/reports')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'الحصول على تقارير الأبناء' })
    @ApiResponse({ status: 200, description: 'تم جلب تقارير الأبناء بنجاح' })
    getReports(@Param('id') id: string) {
        return this.parentsService.getReports(id);
    }
} 