import { ApiProperty } from "@nestjs/swagger";
import { PostEntity } from "./Post.entity";
import { UserEntity } from "./User.entity";
import { Post, User } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the  Entity for Like
export class LikeDto {
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
  // Field: userId, Type: string
  @Column()
  userId: string;

  @ApiProperty({ type: UserEntity })
  // Field: user, Type: User
  @Column()
  user: User;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;
}
