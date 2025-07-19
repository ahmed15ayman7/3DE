import { ApiProperty } from "@nestjs/swagger";
import {
  User,
  Comment,
  Like,
  Group,
  Community,
  Discussion,
  PublicRelationsRecord,
} from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Update Entity for Post
export class UpdatePostDto {
  @ApiProperty({ type: "string" })
  // Field: authorId, Type: string
  @Column()
  authorId: string;

  @ApiProperty({ type: "string" })
  // Field: content, Type: string
  @Column()
  content: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: image, Type: string
  @Column()
  image?: string;

  @ApiProperty({ type: "string" })
  // Field: title, Type: string
  @Column()
  title: string;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;

  @ApiProperty({ type: "number" })
  // Field: likesCount, Type: number
  @Column()
  likesCount: number;

  @ApiProperty({ type: "string", nullable: true })
  // Field: publicRelationsRecordId, Type: string
  @Column()
  publicRelationsRecordId?: string;
}
