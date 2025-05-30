import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from 'dtos/Question.create.dto';
import { UpdateQuestionDto } from 'dtos/Question.update.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOptionDto } from 'dtos/Option.create.dto';
import { UpdateOptionDto } from 'dtos/Option.update.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('الاسئلة')
@Controller('questions')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) { }

    @Post()
    create(@Body() createQuestionDto: CreateQuestionDto) {
        return this.questionsService.create(createQuestionDto);
    }

    @Get()
    findAll() {
        return this.questionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.questionsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
        return this.questionsService.update(id, updateQuestionDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.questionsService.remove(id);
    }

    @Post(':id/mark-as-answered')
    markAsAnswered(@Param('id') id: string) {
        return this.questionsService.markAsAnswered(id);
    }

    @Post(':id/mark-as-unanswered')
    markAsUnanswered(@Param('id') id: string) {
        return this.questionsService.markAsUnanswered(id);
    }

    @Get(':id/quiz')
    getQuestionByQuizId(@Param('id') id: string) {
        return this.questionsService.getQuestionByQuizId(id);
    }
    @Post(':id/option')
    createOption(@Param('id') id: string, @Body() createOptionDto: CreateOptionDto) {
        return this.questionsService.createOption(createOptionDto);
    }
    @Put(':id/option')
    updateOption(@Param('id') id: string, @Body() updateOptionDto: UpdateOptionDto) {
        return this.questionsService.updateOption(id, updateOptionDto);
    }
    @Delete(':id/option')
    deleteOption(@Param('id') id: string) {
        return this.questionsService.deleteOption(id);
    }
}
