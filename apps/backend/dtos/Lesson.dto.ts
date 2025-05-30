import { ApiProperty } from "@nestjs/swagger";
import { CourseEntity } from "./Course.entity";
import { FileEntity } from "./File.entity";
import { QuizEntity } from "./Quiz.entity";
import { UserEntity } from "./User.entity";
import { AttendanceEntity } from "./Attendance.entity";
import {
  Course,
  File,
  Quiz,
  User,
  LessonStatus,
  Attendance,
} from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the  Entity for Lesson
export class LessonDto {
  @ApiProperty({ type: "string" })
  // Field: id, Type: string
  @Column()
  id: string;

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

  @ApiProperty({ type: CourseEntity })
  // Field: course, Type: Course
  @Column()
  course: Course;

  @ApiProperty({ type: FileEntity })
  // Field: files, Type: File[]
  @Column()
  files: File[];

  @ApiProperty({ type: QuizEntity })
  // Field: quizzes, Type: Quiz[]
  @Column()
  quizzes: Quiz[];

  @ApiProperty({ type: UserEntity })
  // Field: completedBy, Type: User[]
  @Column()
  completedBy: User[];

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

  @ApiProperty({ type: AttendanceEntity })
  // Field: Attendance, Type: Attendance[]
  @Column()
  Attendance: Attendance[];
}
