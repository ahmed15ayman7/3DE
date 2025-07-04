import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from 'dtos/Quiz.create.dto';
import { UpdateQuizDto } from 'dtos/Quiz.update.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateQuestionDto } from 'dtos/Question.create.dto';
import { CreateOptionDto } from 'dtos/Option.create.dto';
import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
export class CreateFullQuizDto extends CreateQuizDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionWithOptionsDto)
    questions: QuestionWithOptionsDto[];
}

class QuestionWithOptionsDto extends CreateQuestionDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOptionDto)
    options: CreateOptionDto[];
}
@ApiTags('الاختبارات')
@Controller('quizzes')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class QuizzesController {
    constructor(private readonly quizzesService: QuizzesService) { }

    @Post()
    async create(@Body() createQuizInput: CreateFullQuizDto) {
        return this.quizzesService.create(createQuizInput);
    }

    @Get()
    async findAll() {
        return this.quizzesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.quizzesService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateQuizInput: UpdateQuizDto,
    ) {
        return this.quizzesService.update(id, updateQuizInput);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.quizzesService.remove(id);
    }




    // @Post(':id/submit')
    // async submitQuiz(
    //     @Param('id') quizId: string,
    //     @Body() submitQuizInput: CreateSubmissionDto,
    //     @Req() req: RequestWithUser,
    // ) {
    //     return this.quizzesService.submitQuizAttempt(
    //         req.user.id,
    //         quizId,
    //         submitQuizInput.answers as { questionId: string; answer: string }[],
    //     );
    // }
} 
