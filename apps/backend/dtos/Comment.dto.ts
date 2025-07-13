import { ApiProperty } from "@nestjs/swagger";
import { PostEntity } from "./Post.entity";
import { UserEntity } from "./User.entity";
import { Post, User } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the  Entity for Comment
export class CommentDto {
  @ApiProperty({ type: "string" })
  // Field: id, Type: string
  @Column()
  id: string;

  @ApiProperty({ type: "string" })
  // Field: postId, Type: string
  @Column()
  postId: string;

  @ApiProperty({ type: PostEntity })
  // Field: post, Type: Post
  @Column()
  post: Post;

  @ApiProperty({ type: "string" })
  // Field: content, Type: string
  @Column()
  content: string;

  @ApiProperty({ type: "string" })
  // Field: authorId, Type: string
  @Column()
  authorId: string;

  @ApiProperty({ type: UserEntity })
  // Field: author, Type: User
  @Column()
  author: User;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;
}
