import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from 'dtos/Post.create.dto';
import { UpdatePostDto } from 'dtos/Post.update.dto';
import { CreateCommentDto } from 'dtos/Comment.create.dto';
import { UpdateCommentDto } from 'dtos/Comment.update.dto';
import { BlogPost } from '@shared/prisma';
import { CreateBlogPostDto } from 'dtos/BlogPost.create.dto';
import { UpdateBlogPostDto } from 'dtos/BlogPost.update.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostInput: CreatePostDto) {
    let author = await this.prisma.user.findUnique({
      where: {
        id: createPostInput.authorId,
      },
    });
    if (!author) {
      throw new NotFoundException(
        `Author with ID ${createPostInput.authorId} not found`
      );
    }
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
        likes: true,
      },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: true,
        likes: true,
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
        likes: true,
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

  async likePost(id: string, userId: string) {
    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        likesCount: post.likesCount + 1,
        likes: {
          create: {
            userId: userId,
          },
        },
      },
      include: {
        author: true,
        comments: true,
        likes: true,
      },
    });
  }

  async unlikePost(id: string, userId: string) {
    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    const like = await this.prisma.like.findFirst({
      where: {
        userId: userId,
        postId: id,
      },
    });
    if (!like) {
      throw new NotFoundException(`Like with ID ${userId} not found`);
    }
    return this.prisma.post.update({
      where: { id },
      data: {
        likesCount: Math.max(0, post.likesCount - 1),
        likes: {
          delete: {
            id: like.id,
          },
        },
      },
      include: {
        author: true,
        comments: true,
        likes: true,
      },
    });
  }
  async getUserPosts(userId: string) {
    return this.prisma.post.findMany({
      where: { authorId: userId },
      include: {
        author: true,
        comments: true,
        likes: true,
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
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }
    return this.prisma.comment.update({
      where: { id: commentId },
      data: updateCommentDto,
    });
  }
  async deleteComment(commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
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
  async createBlogPost(createPostInput: CreateBlogPostDto) {
    let author = await this.prisma.admin.findFirst({
      where: {
        userId: createPostInput.authorId,
      },
    });
    if (!author) {
      throw new NotFoundException(
        `Admin with ID ${createPostInput.authorId} not found`
      );
    }
    return this.prisma.blogPost.create({
      data: {
        ...createPostInput,
        authorId: author.id,
      },
    });
  }
  async getBlogPostById(id: string) {
   let post = await this.prisma.blogPost.findUnique({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }
  async updateBlogPost(id: string, updatePostInput: UpdateBlogPostDto) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    let author = await this.prisma.admin.findFirst({
      where: {
        userId: updatePostInput.authorId,
      },
    });
    if (!author) {
      throw new NotFoundException(`Admin with ID ${updatePostInput.authorId} not found`);
    }
      return this.prisma.blogPost.update({
      where: { id },
      data: {
        ...updatePostInput,
        authorId: author.id,
      },
    });
  }
  async getPublicRelationPosts(
    search: string,
    take: number,
    skip: number
  ): Promise<{
    posts: Partial<BlogPost>[];
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {

    let posts = await this.prisma.blogPost.findMany({
      where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        tags: true,
        slug: true,
        publishDate: true,
        isPublished: true,
        createdAt: true,
      },
      take: +take,
      skip: +skip,
    });
    
    let total = await this.prisma.blogPost.count();
    let totalPages = Math.ceil(total / take);
    let hasNextPage = +skip + take < total;
      let hasPreviousPage = +skip - take >= 0;
      return { posts, total, totalPages, hasNextPage, hasPreviousPage };

  }
}
