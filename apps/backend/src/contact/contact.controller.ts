import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactUsDto } from '../../dtos/ContactUs.create.dto';
import { UpdateContactUsDto } from '../../dtos/ContactUs.update.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ContactUs } from '@shared/prisma';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('التواصل')
@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }
    
    @Post()
    async create(@Body() createFileDto: CreateContactUsDto): Promise<ContactUs> {
        return this.contactService.create(createFileDto);
    }
    
    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async findAll(): Promise<ContactUs[]> {
        return this.contactService.findAll();
    }
    
    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async findOne(@Param('id') id: string): Promise<ContactUs> {
        return this.contactService.findOne(id);
    }
    
    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateFileDto: UpdateContactUsDto,
    ): Promise<ContactUs> {
        return this.contactService.update(id, updateFileDto);
    }
    
    @Delete(':id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async remove(@Param('id') id: string): Promise<ContactUs> {
        return this.contactService.remove(id);
    }
} 