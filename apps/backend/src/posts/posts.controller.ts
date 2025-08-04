import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from '../../dtos/Post.create.dto';
import { UpdatePostDto } from '../../dtos/Post.update.dto';
import { BlogPost, Comment, Post as PostModel } from '@shared/prisma';
import { AuthGuard } from '../auth/auth.guard';
import { CreateCommentDto } from 'dtos/Comment.create.dto';
import { UpdateCommentDto } from 'dtos/Comment.update.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateBlogPostDto } from 'dtos/BlogPost.create.dto';
import { UpdateBlogPostDto } from 'dtos/BlogPost.update.dto';
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


    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get('public-relation/posts')
    async getPostsPublic(@Query('search') search?: string, @Query('take') take?: string, @Query('skip') skip?: string): Promise<{posts:Partial<BlogPost>[],total:number,totalPages:number,hasNextPage:boolean,hasPreviousPage:boolean}> {
        return this.postsService.getPublicRelationPosts(search ?? "", +(take ?? 10), +(skip ?? 0));
    }

    @Post('blog')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async createBlogPost(@Body() createBlogPostDto: CreateBlogPostDto): Promise<BlogPost> {
        return this.postsService.createBlogPost(createBlogPostDto);
    }
    @Put('blog/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async updateBlogPost(@Param('id') id: string, @Body() updateBlogPostDto: UpdateBlogPostDto): Promise<BlogPost> {
        return this.postsService.updateBlogPost(id, updateBlogPostDto);
    }
    @Get('blog/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async getBlogPostById(@Param('id') id: string): Promise<BlogPost> {
        return this.postsService.getBlogPostById(id);
    }
} 
