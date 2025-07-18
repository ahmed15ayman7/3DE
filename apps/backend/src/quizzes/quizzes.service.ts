import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from 'dtos/Quiz.create.dto';
import { UpdateQuizDto } from 'dtos/Quiz.update.dto';
import { CreateQuestionDto } from 'dtos/Question.create.dto';
import { CreateOptionDto } from 'dtos/Option.create.dto';
import { QuestionsService } from 'src/questions/questions.service';

@Injectable()
export class QuizzesService {
    constructor(private prisma: PrismaService,
        private questionsService: QuestionsService
    ) { }

    async create(createQuizInput: CreateQuizDto ) {
        const createdQuiz = await this.prisma.quiz.create({
            data: {
                ...createQuizInput,
            }
        });

    

       
   return createdQuiz;
}

    async findAll() {
        return this.prisma.quiz.findMany({
            include: {
                questions: true,
            },
        });
    }

    async findOne(id: string) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id },
            include: {
                questions: {
                    include: {
                        options: true,
                    }
                },
            },
        });

        if (!quiz) {
            throw new NotFoundException(`Quiz with ID ${id} not found`);
        }

        return quiz;
    }

    async update(id: string, updateQuizInput: UpdateQuizDto) {
        return this.prisma.quiz.update({
            where: { id },
            data: {
                title: updateQuizInput.title,
                description: updateQuizInput.description,
                timeLimit: updateQuizInput.timeLimit,
                passingScore: updateQuizInput.passingScore,
            },
            include: {
                questions: true,
            },
        });
    }

    async remove(id: string) {
        try {

            const quiz = await this.findOne(id);
            if (!quiz) {
                throw new NotFoundException(`Quiz with ID ${id} not found`);
            }
            return this.prisma.quiz.delete({
                where: { id },
            });
        } catch (error) {
            console.error(error);
            throw new BadRequestException('Failed to delete quiz' + error.message);
        }
    }
    async getByStudent(studentId: string) {
        return this.prisma.quiz.findMany({
            where: {
                course: {
                   
                    enrollments: {
                        some: {
                            userId: studentId,
                        },
                    },
                },
               
               
               
            },
            include: {
                    submissions:true,
            },
        });
    }
    async getByInstructor(instructorId: string) {
        return this.prisma.quiz.findMany({
            where: {
                course: {
                   
                        instructors: {
                            some: {
                                userId: instructorId,
                            },
                        },
                    
                },
            },
        });
    }


    // async submitQuizAttempt(userId: string, quizId: string, answers: { questionId: string; answer: string }[]) {
    //     const quiz = await this.findOne(quizId);
    //     let score = 0;
    //     let totalPoints = 0;

    //     for (const question of quiz.questions) {
    //         totalPoints += question.points;
    //         const userAnswer = answers.find(a => a.questionId === question.id);
    //         if (userAnswer) {
    //             const answer = question.answers.find(a => a.id === userAnswer.answer);
    //             if (answer) {
    //                 score += question.points;
    //             }
    //         }
    //     }

    //     const percentage = (score / totalPoints) * 100;
    //     const passed = percentage >= quiz.passingScore;

    //     return this.prisma.submission.create({
    //         data: {
    //             userId,
    //             quizId,
    //             score: percentage,
    //             passed,
    //             answers: answers.map(answer => ({
    //                 questionId: answer.questionId,
    //                 optionId: answer.answer,
    //             })),
    //         },

    //     });
    // }
} 