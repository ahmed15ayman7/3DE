import { ApiProperty } from "@nestjs/swagger";
import { AdminEntity } from "./Admin.entity";
import { Admin } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the  Entity for BlogPost
export class BlogPostEntity {
  @ApiProperty({ type: "string" })
  // Field: id, Type: string
  @Column()
  id: string;

  @ApiProperty({ type: "string" })
  // Field: title, Type: string
  @Column()
  title: string;

  @ApiProperty({ type: "string" })
  // Field: slug, Type: string
  @Column()
  slug: string;

  @ApiProperty({ type: "string" })
  // Field: content, Type: string
  @Column()
  content: string;

  @ApiProperty({ type: "string" })
  // Field: image, Type: string
  @Column()
  image: string;

  @ApiProperty({ type: "string" })
  // Field: authorId, Type: string
  @Column()
  authorId: string;

  @ApiProperty({ type: AdminEntity })
  // Field: author, Type: Admin
  @Column()
  author: Admin;

  @ApiProperty({ type: "string" })
  // Field: tags, Type: string[]
  @Column()
  tags: string[];

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: publishDate, Type: Date
  @Column()
  publishDate: Date;

  @ApiProperty({ type: "boolean" })
  // Field: isPublished, Type: boolean
  @Column()
  isPublished: boolean;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: updatedAt, Type: Date
  @Column()
  updatedAt: Date;
}
