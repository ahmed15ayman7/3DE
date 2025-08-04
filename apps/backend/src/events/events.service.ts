import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from 'dtos/Event.create.dto';
import { UpdateEventDto } from 'dtos/Event.update.dto';
import { Event } from '@shared/prisma';

@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) { }

    async create(createEventInput: CreateEventDto) {
        return this.prisma.event.create({
            data: createEventInput
        });
    }

    async findAll(search: string, take: number, skip: number) {
        let events = await this.prisma.event.findMany({
            where: {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            },
            take: +take,
            skip: +skip
        });
        let total = await this.prisma.event.count({
            where: {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            },
        });
        let hasNextPage = +skip + +take < total;
        let hasPreviousPage = +skip - +take >= 0;
        return {
            events,
            total,
            totalPages: Math.ceil(total / +take),
            hasNextPage,
            hasPreviousPage
        };
    }

    async findOne(id: string) {
        return this.prisma.event.findUnique({
            where: { id }
        });
    }

    async update(id: string, updateEventInput: UpdateEventDto) {
        return this.prisma.event.update({
            where: { id },
            data: updateEventInput
        });
    }

    async remove(id: string) {
        return this.prisma.event.delete({
            where: { id }
        });
    }
    async getEventsPublic(search: string): Promise<Partial<Event>[]> {
        return this.prisma.event.findMany({
            where: {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
    title: true,
    description: true,
    startTime: true,
    endTime: true,
    createdAt: true,
    updatedAt: true
    },take:10
        });
    }
} 