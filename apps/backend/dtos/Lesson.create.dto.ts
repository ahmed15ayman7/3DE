import { ApiProperty } from "@nestjs/swagger";
import {
  Course,
  File,
  Quiz,
  User,
  LessonStatus,
  Attendance,
  LessonWhiteList,
  WatchedLesson,
} from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Create Entity for Lesson
export class CreateLessonDto {
  @ApiProperty({ type: "string" })
  // Field: title, Type: string
  @Column()
  title: string;

  @ApiProperty({ type: "string" })
  // Field: content, Type: string
  @Column()
  content: string;

  @ApiProperty({ type: "string" })
  // Field: courseId, Type: string
  @Column()
  courseId: string;

  @ApiProperty({ type: "number" })
  // Field: progress, Type: number
  @Column()
  progress: number;

  @ApiProperty({ enum: LessonStatus })
  // Field: status, Type: LessonStatus
  @Column()
  status: LessonStatus;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: updatedAt, Type: Date
  @Column()
  updatedAt: Date;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: lastOpenedAt, Type: Date
  @Column()
  lastOpenedAt?: Date;
}
