import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from 'dtos/Post.create.dto';
import { UpdatePostDto } from 'dtos/Post.update.dto';
import { CreateCommentDto } from 'dtos/Comment.create.dto';
import { UpdateCommentDto } from 'dtos/Comment.update.dto';

@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService) { }

    async create(createPostInput: CreatePostDto) {
        return this.prisma.post.create({
            data: {
                ...createPostInput,
                likesCount: 0,
            },
            include: {
                author: true,
                comments: true,
            },
        });
    }

    async findAll() {
        return this.prisma.post.findMany({
            include: {
                author: true,
                comments: true,
            },
        });
    }

    async findOne(id: string) {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: {
                author: true,
                comments: true,
            },
        });

        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        return post;
    }

    async update(id: string, updatePostInput: UpdatePostDto) {
        const post = await this.findOne(id);
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        return this.prisma.post.update({
            where: { id },
            data: updatePostInput,
            include: {
                author: true,
                comments: true,
            },
        });
    }

    async remove(id: string) {
        const post = await this.findOne(id);
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        return this.prisma.post.delete({
            where: { id },
        });
    }

    async likePost(id: string) {
        const post = await this.findOne(id);
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        return this.prisma.post.update({
            where: { id },
            data: {
                likesCount: post.likesCount + 1,
            },
            include: {
                author: true,
                comments: true,
            },
        });
    }

    async unlikePost(id: string) {
        const post = await this.findOne(id);
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        return this.prisma.post.update({
            where: { id },
            data: {
                likesCount: Math.max(0, post.likesCount - 1),
            },
            include: {
                author: true,
                comments: true,
            },
        });
    }
    async getUserPosts(userId: string) {
        return this.prisma.post.findMany({
            where: { authorId: userId },
            include: {
                author: true,
                comments: true,
            },
        });
    }
    async createComment(postId: string, createCommentDto: CreateCommentDto) {
        const post = await this.findOne(postId);
        if (!post) {
            throw new NotFoundException(`Post with ID ${postId} not found`);
        }

        return this.prisma.comment.create({
            data: {
                ...createCommentDto,
                postId,
            },
        });
    }
    async getComments(postId: string) {
        const post = await this.findOne(postId);
        if (!post) {
            throw new NotFoundException(`Post with ID ${postId} not found`);
        }
        return this.prisma.comment.findMany({ where: { postId } });
    }
    async updateComment(commentId: string, updateCommentDto: UpdateCommentDto) {
        const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) {
            throw new NotFoundException(`Comment with ID ${commentId} not found`);
        }
        return this.prisma.comment.update({ where: { id: commentId }, data: updateCommentDto });
    }
    async deleteComment(commentId: string) {
        const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) {
            throw new NotFoundException(`Comment with ID ${commentId} not found`);
        }
        return this.prisma.comment.delete({ where: { id: commentId } });
    }
    async getPostComments(postId: string) {
        const post = await this.findOne(postId);
        if (!post) {
            throw new NotFoundException(`Post with ID ${postId} not found`);
        }
        return this.prisma.comment.findMany({ where: { postId } });
    }
} 