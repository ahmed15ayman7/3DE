import { ApiProperty } from "@nestjs/swagger";
import { Post, User } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Create Entity for Like
export class CreateLikeDto {
  @ApiProperty({ type: "string" })
  // Field: postId, Type: string
  @Column()
  postId: string;

  @ApiProperty({ type: "string" })
  // Field: userId, Type: string
  @Column()
  userId: string;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;
}
