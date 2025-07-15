import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from '../../dtos/Event.create.dto';
import { UpdateEventDto } from '../../dtos/Event.update.dto';
import { EventDto } from '../../dtos/Event.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Event } from '@shared/prisma';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('الفعاليات')
@Controller('events')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
        return this.eventsService.create(createEventDto);
    }

    @Get()
    async findAll(): Promise<Event[]> {
        return this.eventsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Event> {
        return this.eventsService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateEventDto: UpdateEventDto,
    ): Promise<Event> {
        return this.eventsService.update(id, updateEventDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Event> {
        return this.eventsService.remove(id);
    }
    @Get('public')
    async getEventsPublic(@Query('search') search?: string): Promise<Partial<Event>[]> {
        return this.eventsService.getEventsPublic(search ?? "");
    }
} 