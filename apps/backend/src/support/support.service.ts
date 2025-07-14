import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupportDto } from '../../dtos/Support.create.dto';
import { UpdateSupportDto } from '../../dtos/Support.update.dto';

@Injectable()
export class SupportService {
    constructor(private prisma: PrismaService) { }

    async create(createSupportInput: CreateSupportDto) {
        return this.prisma.support.create({
            data: createSupportInput
        });
    }

    async findAll() {
        return this.prisma.support.findMany();
    }

    async findOne(id: string) {
        return this.prisma.support.findUnique({
            where: { id }
        });
    }

    async update(id: string, updateSupportInput: UpdateSupportDto) {
        return this.prisma.support.update({
            where: { id },
            data: updateSupportInput
        });
    }

    async remove(id: string) {
        return this.prisma.support.delete({
            where: { id }
        });
    }
} 