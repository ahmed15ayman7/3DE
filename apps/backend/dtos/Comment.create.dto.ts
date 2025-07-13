import { ApiProperty } from "@nestjs/swagger";
import { Post, User } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Create Entity for Comment
export class CreateCommentDto {
  @ApiProperty({ type: "string" })
  // Field: postId, Type: string
  @Column()
  postId: string;

  @ApiProperty({ type: "string" })
  // Field: content, Type: string
  @Column()
  content: string;

  @ApiProperty({ type: "string" })
  // Field: authorId, Type: string
  @Column()
  authorId: string;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;
}
