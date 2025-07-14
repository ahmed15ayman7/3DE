import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { AuthGuard } from '../auth/auth.guard';
import { Support } from '@shared/prisma';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateSupportDto } from '../../dtos/Support.create.dto';
import { UpdateSupportDto } from '../../dtos/Support.update.dto';
@ApiTags('الدعم')
@Controller('support')
export class SupportController {
    constructor(private readonly supportService: SupportService) { }
    
    @Post()
    async create(@Body() createSupportDto: CreateSupportDto): Promise<Support> {
        return this.supportService.create(createSupportDto);
    }
    
    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async findAll(): Promise<Support[]> {
        return this.supportService.findAll();
    }
    
    @Get(':id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async findOne(@Param('id') id: string): Promise<Support> {
        return this.supportService.findOne(id);
    }
    
    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateFileDto: UpdateSupportDto,
    ): Promise<Support> {
        return this.supportService.update(id, updateFileDto);
    }
    
    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async remove(@Param('id') id: string): Promise<Support> {
        return this.supportService.remove(id);
    }
} 