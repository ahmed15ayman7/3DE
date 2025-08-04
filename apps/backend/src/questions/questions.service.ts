import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from 'dtos/Question.create.dto';
import { UpdateQuestionDto } from 'dtos/Question.update.dto';
import { CreateOptionDto } from 'dtos/Option.create.dto';
import { UpdateOptionDto } from 'dtos/Option.update.dto';


@Injectable()
export class QuestionsService {
    constructor(private prisma: PrismaService) { }

    async create(createQuestionInput: CreateQuestionDto & { options: CreateOptionDto[] }, quizId: string) {
        let quiz = await this.prisma.quiz.findUnique({
            where: { id: quizId },
        });
        if (!quiz) {
            throw new NotFoundException(`Quiz with ID ${quizId} not found`);
        }
        return this.prisma.question.create({
            data: {
                ...createQuestionInput,
                quizId: quiz.id,
                options: {
                    create: createQuestionInput.options.map(option => ({
                        isCorrect: option.isCorrect,
                        text: option.text,
                    })),
                },
            },
            include: {
                quiz: true,
                options: true,
            },
        });
    }

    async findAll() {
        return this.prisma.question.findMany({
            include: {
                quiz: true,
            },
        });
    }

    async findOne(id: string) {
        const question = await this.prisma.question.findUnique({
            where: { id },
            include: {
                quiz: true,
            },
        });

        if (!question) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }

        return question;
    }

    async update(id: string, updateQuestionInput: UpdateQuestionDto) {
        const question = await this.findOne(id);

        return this.prisma.question.update({
            where: { id },
            data: updateQuestionInput,
            include: {
                quiz: true,
            },
        });
    }

    async remove(id: string) {
        const question = await this.findOne(id);
        if (!question) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }

        return this.prisma.question.delete({
            where: { id },
        });
    }

    async markAsAnswered(id: string) {
        const question = await this.findOne(id);
        if (!question) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }

        return this.prisma.question.update({
            where: { id },
            data: {
                isAnswered: true,
            },
            include: {
                quiz: true,
            },
        });
    }

    async markAsUnanswered(id: string) {
        const question = await this.findOne(id);
        if (!question) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }

        return this.prisma.question.update({
            where: { id },
            data: {
                isAnswered: false,
            },
            include: {
                quiz: true,
            },
        });
    }

    async getQuestionByQuizId(quizId: string) {
        return this.prisma.question.findMany({
            where: { quizId },
            include: {
                options: true,
            }
        });
    }
    async createOption(createOptionInput: CreateOptionDto) {
        return this.prisma.option.create({
            data: createOptionInput,
        });
    }
    async updateOption(id: string, updateOptionInput: UpdateOptionDto) {
        return this.prisma.option.update({
            where: { id },
            data: updateOptionInput,
        });
    }
    async deleteOption(id: string) {
        return this.prisma.option.delete({
            where: { id },
        });
    }


} 