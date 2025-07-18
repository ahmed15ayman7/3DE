import { ApiProperty } from "@nestjs/swagger";
import { Lesson, Question, Submission, Course } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Create Entity for Quiz
export class CreateQuizDto {
  @ApiProperty({ type: "string" })
  // Field: title, Type: string
  @Column()
  title: string;

  @ApiProperty({ type: "string" })
  // Field: description, Type: string
  @Column()
  description?: string;

  @ApiProperty({ type: "string" })
  // Field: lessonId, Type: string
  @Column()
  lessonId: string;

  @ApiProperty({ type: "number" })
  // Field: timeLimit, Type: number
  @Column()
  timeLimit?: number;

  @ApiProperty({ type: "number" })
  // Field: passingScore, Type: number
  @Column()
  passingScore?: number;

  @ApiProperty({ type: "number" })
  // Field: failCount, Type: number
  @Column()
  failCount?: number;

  @ApiProperty({ type: "number" })
  // Field: averageScore, Type: number
  @Column()
  averageScore?: number;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: startDate, Type: Date
  @Column()
  startDate?: Date;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: endDate, Type: Date
  @Column()
  endDate?: Date;

  @ApiProperty({ type: "boolean" })
  // Field: upComing, Type: boolean
  @Column()
  upComing: boolean;

  @ApiProperty({ type: "boolean" })
  // Field: isCompleted, Type: boolean
  @Column()
  isCompleted: boolean;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: updatedAt, Type: Date
  @Column()
  updatedAt: Date;

  @ApiProperty({ type: "string" })
  // Field: courseId, Type: string
  @Column()
  courseId: string;
}
