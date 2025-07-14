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

    async findAll() {
        return this.prisma.contactUs.findMany();
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