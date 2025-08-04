import { Controller, Get, Param, UseGuards, Post, Body, Put, Delete } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateSubmissionDto } from 'dtos/Submission.create.dto';
import { UpdateSubmissionDto } from 'dtos/Submission.update.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('الاجابات')
@Controller('submissions')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class SubmissionsController {
    constructor(private readonly submissionsService: SubmissionsService) { }


    @Get()
    async getSubmissions() {
        return this.submissionsService.findAll();
    }
    @Get(':id')
    async getSubmission(@Param('id') id: string) {
        return this.submissionsService.findOne(id);
    }

    @Post()
    async createSubmission(@Body() createSubmissionDto: CreateSubmissionDto) {
        return this.submissionsService.create(createSubmissionDto);
    }

    @Put(':id')
    async updateSubmission(@Param('id') id: string, @Body() updateSubmissionDto: UpdateSubmissionDto) {
        return this.submissionsService.update(id, updateSubmissionDto);
    }

    @Delete(':id')
    async deleteSubmission(@Param('id') id: string) {
        return this.submissionsService.remove(id);
    }

    @Get('quiz/:quizId')
    async getQuizReports(@Param('quizId') quizId: string) {
        return this.submissionsService.getQuizSubmissions(quizId);
    }


    @Get('user/:userId')
    async getUserReports(@Param('userId') userId: string) {
        return this.submissionsService.getUserSubmissions(userId);
    }

}