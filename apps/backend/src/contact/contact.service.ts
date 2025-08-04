import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactUsDto } from '../../dtos/ContactUs.create.dto';
import { UpdateContactUsDto } from '../../dtos/ContactUs.update.dto';

@Injectable()
export class ContactService {
    constructor(private prisma: PrismaService) { }

    async create(createContactInput: CreateContactUsDto) {
        return this.prisma.contactUs.create({
            data: createContactInput
        });
    }

    async findAll(search: string, take: number, skip: number) {
        let contacts = await this.prisma.contactUs.findMany({
            where: {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search, mode: 'insensitive' } }
                ]
            },
            take:+take,
            skip:+skip
        });
        let total = await this.prisma.contactUs.count({
            where: {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search, mode: 'insensitive' } }
                ]
            }
        });
        let totalPages = Math.ceil(total / take);
        let hasNextPage = skip + take < total;
        let hasPreviousPage = skip > 0;
        return {
            data: contacts,
            total,
            totalPages,
            hasNextPage,
            hasPreviousPage
        };
    }

    async findOne(id: string) {
        return this.prisma.contactUs.findUnique({
            where: { id }
        });
    }

    async update(id: string, updateFileInput: UpdateContactUsDto) {
        return this.prisma.contactUs.update({
            where: { id },
            data: updateFileInput
        });
    }

    async remove(id: string) {
        return this.prisma.contactUs.delete({
            where: { id }
        });
    }
} 