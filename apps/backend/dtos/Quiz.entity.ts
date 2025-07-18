import { ApiProperty } from "@nestjs/swagger";
import { LessonEntity } from "./Lesson.entity";
import { QuestionEntity } from "./Question.entity";
import { SubmissionEntity } from "./Submission.entity";
import { CourseEntity } from "./Course.entity";
import { Lesson, Question, Submission, Course } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the  Entity for Quiz
export class QuizEntity {
  @ApiProperty({ type: "string" })
  // Field: id, Type: string
  @Column()
  id: string;

  @ApiProperty({ type: "string" })
  // Field: title, Type: string
  @Column()
  title: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: description, Type: string
  @Column()
  description?: string;

  @ApiProperty({ type: "string" })
  // Field: lessonId, Type: string
  @Column()
  lessonId: string;

  @ApiProperty({ type: LessonEntity })
  // Field: lesson, Type: Lesson
  @Column()
  lesson: Lesson;

  @ApiProperty({ type: QuestionEntity })
  // Field: questions, Type: Question[]
  @Column()
  questions: Question[];

  @ApiProperty({ type: SubmissionEntity })
  // Field: submissions, Type: Submission[]
  @Column()
  submissions: Submission[];

  @ApiProperty({ type: "number", nullable: true })
  // Field: timeLimit, Type: number
  @Column()
  timeLimit?: number;

  @ApiProperty({ type: "number", nullable: true })
  // Field: passingScore, Type: number
  @Column()
  passingScore?: number;

  @ApiProperty({ type: "number", nullable: true })
  // Field: failCount, Type: number
  @Column()
  failCount?: number;

  @ApiProperty({ type: "number", nullable: true })
  // Field: averageScore, Type: number
  @Column()
  averageScore?: number;

  @ApiProperty({ type: "string", format: "date-time", nullable: true })
  // Field: startDate, Type: Date
  @Column()
  startDate?: Date;

  @ApiProperty({ type: "string", format: "date-time", nullable: true })
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

  @ApiProperty({ type: CourseEntity })
  // Field: Course, Type: Course[]
  @Column()
  Course: Course[];
}
