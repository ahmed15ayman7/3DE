import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from '../../dtos/Post.create.dto';
import { UpdatePostDto } from '../../dtos/Post.update.dto';
import { Comment, Post as PostModel } from '@shared/prisma';
import { AuthGuard } from '../auth/auth.guard';
import { CreateCommentDto } from 'dtos/Comment.create.dto';
import { UpdateCommentDto } from 'dtos/Comment.update.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('المنشورات')
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async create(@Body() createPostDto: CreatePostDto): Promise<PostModel> {
        return this.postsService.create(createPostDto);
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async findAll(): Promise<PostModel[]> {
        return this.postsService.findAll();
    }

    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async findOne(@Param('id') id: string): Promise<PostModel> {
        return this.postsService.findOne(id);
    }

    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
    ): Promise<PostModel> {
        return this.postsService.update(id, updatePostDto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async remove(@Param('id') id: string): Promise<PostModel> {
        return this.postsService.remove(id);
    }
    @Post(':id/like/:userId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async likePost(@Param('id') id: string, @Param('userId') userId: string): Promise<PostModel> {
        return this.postsService.likePost(id, userId);
    }
    @Post(':id/unlike/:userId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async unlikePost(@Param('id') id: string, @Param('userId') userId: string): Promise<PostModel> {
        return this.postsService.unlikePost(id, userId);
    }
    @Get('user/:userId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async getUserPosts(@Param('userId') userId: string): Promise<PostModel[]> {
        return this.postsService.getUserPosts(userId);
    }
    @Post(':id/comments')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async createComment(@Param('id') id: string, @Body() createCommentDto: CreateCommentDto): Promise<Comment> {
        return this.postsService.createComment(id, createCommentDto);
    }
    @Get(':id/comments')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async getPostComments(@Param('id') id: string): Promise<Comment[]> {
        return this.postsService.getPostComments(id);
    }
    @Put(':id/comments/:commentId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async updateComment(@Param('commentId') commentId: string, @Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
        return this.postsService.updateComment(commentId, updateCommentDto);
    }
    @Delete(':id/comments/:commentId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async deleteComment(@Param('commentId') commentId: string): Promise<Comment> {
        return this.postsService.deleteComment(commentId);
    }
    @Get('public')
    async getPostsPublic(@Query('search') search?: string): Promise<Partial<PostModel>[]> {
        return this.postsService.getPostsPublic(search ?? "");
    }
} 
