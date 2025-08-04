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
        const { quizId, userId, answers, feedback, timeLimit } = createSubmissionInput;
      
        if (!quizId) throw new BadRequestException('quizId is required');
        if (!userId) throw new BadRequestException('userId is required');
        if (!answers || (Array.isArray(answers) && answers.length === 0) || (!Array.isArray(answers) && typeof answers !== 'object')) {
          throw new BadRequestException('answers must be an array or object with values');
        }
      
        const quiz = await this.prisma.quiz.findUnique({
          where: { id: quizId },
          include: {
            questions: { include: { options: true } }
          }
        });
        if (!quiz) throw new NotFoundException(`Quiz with ID ${quizId} not found`);
      
        const user = await this.prisma.user.findUnique({
          where: { id: userId }
        });
        if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
      
        // تحويل الإجابات إلى Array إذا كانت Object
        const normalizedAnswers = Array.isArray(answers)
          ? answers
          : Object.entries(answers).map(([qId, optId]) => ({ [qId]: optId }));
      
        // إنشاء Submission
        let submission = await this.prisma.submission.create({
          data: {
            userId: user.id,
            quizId: quiz.id,
            answers: normalizedAnswers,
            score: 0,
            feedback,
            passed: false,
            timeLimit
          },
          include: {
            user: true,
            quiz: { include: { questions: { include: { options: true } } } }
          }
        });
      
        // حساب النتيجة
        let score = 0;
        for (let question of submission.quiz.questions) {
          const isCorrect = question.options.some(
            (option) =>
              option.isCorrect &&
              normalizedAnswers.some(
                (ans: any) =>
                  Object.keys(ans)[0] === question.id && ans[question.id] === option.id
              )
          );
          if (isCorrect) score += question.points;
        }
        const passed = score >= submission.quiz.passingScore;
      
        // تحديث النتيجة والحالة
        submission = await this.prisma.submission.update({
          where: { id: submission.id },
          data: { score, passed },
          include: {
            user: true,
            quiz: { include: { questions: { include: { options: true } } } }
          }
        });
      
        // تحديث عدد الفشل
        if (!passed) {
          await this.prisma.quiz.update({
            where: { id: submission.quizId },
            data: { failCount: { increment: 1 } }
          });
        }
      
        return submission;
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