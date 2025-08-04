import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from 'dtos/Submission.create.dto';
import { UpdateSubmissionDto } from 'dtos/Submission.update.dto';
interface Answer {
    optionId: string;
    questionId: string
}
@Injectable()
export class SubmissionsService {
    constructor(private prisma: PrismaService) { }

    async create(createSubmissionInput: CreateSubmissionDto) {
        let quiz = await this.prisma.quiz.findUnique({
            where: { id: createSubmissionInput.quizId },
        });
        if (!quiz) {
            throw new NotFoundException(`Quiz with ID ${createSubmissionInput.quizId} not found`);
        }
        let user = await this.prisma.user.findUnique({
            where: { id: createSubmissionInput.userId },
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${createSubmissionInput.userId} not found`);
        }

        let submission = await this.prisma.submission.create({
            data: {
                userId: user.id,
                quizId: quiz.id,
                answers: createSubmissionInput.answers,
                score: 0,
                feedback: createSubmissionInput.feedback,
                passed: false,
                timeLimit: createSubmissionInput.timeLimit,
            },
            include: {
                user: true,
                quiz: {
                    include: {
                        questions: {
                            include: {
                                options: true
                            }
                        }
                    }
                },

            },
        });
        let score = 0;
        let passed = false;
        for (let question of submission.quiz.questions) {
            if (question.options.some(option => option.isCorrect && submission.answers.some((answer: any) => Object.keys(answer)[0] === question.id && answer[question.id] === option.id))) {
                score += question.points;
            }
            if (score >= submission.quiz.passingScore) {
                passed = true;
            }
        }
        await this.prisma.submission.update({
            where: { id: submission.id },
            data: {
                score: score,
                passed: score >= submission.quiz.passingScore
            }
        });
        if (!passed) {
            await this.prisma.quiz.update({
                where: { id: submission.quizId },
                data: {
                    failCount: {
                        increment: 1
                    }
                }
            });
        }
        return submission
    }

    async findAll() {
        return this.prisma.submission.findMany({
            include: {
                user: true,
                quiz: true,

            },
        });
    }

    async findOne(id: string) {
        const submission = await this.prisma.submission.findUnique({
            where: { id },
            include: {
                user: true,
                quiz: true,

            },
        });

        if (!submission) {
            throw new NotFoundException(`Submission with ID ${id} not found`);
        }

        return submission;
    }

    async update(id: string, updateSubmissionInput: UpdateSubmissionDto) {
        const submission = await this.findOne(id);
        if (!submission) {
            throw new NotFoundException(`Submission with ID ${id} not found`);
        }

        return this.prisma.submission.update({
            where: { id },
            data: {
                ...updateSubmissionInput,
                updatedAt: new Date(),
            },
            include: {
                user: true,
                quiz: true,

            },
        });
    }

    async remove(id: string) {
        const submission = await this.findOne(id);

        return this.prisma.submission.delete({
            where: { id },
        });
    }

    async gradeSubmission(id: string, grade: number, feedback: string) {
        const submission = await this.findOne(id);

        return this.prisma.submission.update({
            where: { id },
            data: {
                score: grade,
                feedback,
                passed: grade >= 50,
                updatedAt: new Date(),
            },
            include: {
                user: true,
                quiz: true,

            },
        });
    }

    async getUserSubmissions(userId: string) {
        return this.prisma.submission.findMany({
            where: { userId },
            include: {
                user: true,
                quiz: true,
            },
        });
    }

    async getQuizSubmissions(quizId: string) {
        return this.prisma.submission.findMany({
            where: { quizId },
            include: {
                user: true,
                quiz: true,
            },
        });
    }
} 