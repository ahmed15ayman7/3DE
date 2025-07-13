import { ApiProperty } from "@nestjs/swagger";
import { User, Course } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Create Entity for Certificate
export class CreateCertificateDto {
  @ApiProperty({ type: "string" })
  // Field: name, Type: string
  @Column()
  name: string;

  @ApiProperty({ type: "string" })
  // Field: address, Type: string
  @Column()
  address: string;

  @ApiProperty({ type: "string" })
  // Field: phone, Type: string
  @Column()
  phone: string;

  @ApiProperty({ type: "string" })
  // Field: notes, Type: string
  @Column()
  notes: string;

  @ApiProperty({ type: "string" })
  // Field: userId, Type: string
  @Column()
  userId: string;

  @ApiProperty({ type: "string" })
  // Field: title, Type: string
  @Column()
  title: string;

  @ApiProperty({ type: "string" })
  // Field: courseId, Type: string
  @Column()
  courseId: string;

  @ApiProperty({ type: "string" })
  // Field: description, Type: string
  @Column()
  description?: string;

  @ApiProperty({ type: "string" })
  // Field: url, Type: string
  @Column()
  url?: string;

  @ApiProperty({ type: "string" })
  // Field: image, Type: string
  @Column()
  image?: string;

  @ApiProperty({ type: "boolean" })
  // Field: isApproved, Type: boolean
  @Column()
  isApproved: boolean;

  @ApiProperty({ type: "number" })
  // Field: points, Type: number
  @Column()
  points: number;

  @ApiProperty({ type: "string" })
  // Field: type, Type: string
  @Column()
  type: string;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: earnedAt, Type: Date
  @Column()
  earnedAt: Date;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;
}
