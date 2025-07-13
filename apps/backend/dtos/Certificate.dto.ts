import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "./User.entity";
import { CourseEntity } from "./Course.entity";
import { User, Course } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the  Entity for Certificate
export class CertificateDto {
  @ApiProperty({ type: "string" })
  // Field: id, Type: string
  @Column()
  id: string;

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

  @ApiProperty({ type: UserEntity })
  // Field: user, Type: User
  @Column()
  user: User;

  @ApiProperty({ type: "string" })
  // Field: title, Type: string
  @Column()
  title: string;

  @ApiProperty({ type: "string" })
  // Field: courseId, Type: string
  @Column()
  courseId: string;

  @ApiProperty({ type: CourseEntity })
  // Field: course, Type: Course
  @Column()
  course: Course;

  @ApiProperty({ type: "string", nullable: true })
  // Field: description, Type: string
  @Column()
  description?: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: url, Type: string
  @Column()
  url?: string;

  @ApiProperty({ type: "string", nullable: true })
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
