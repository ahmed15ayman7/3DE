import { ApiProperty } from "@nestjs/swagger";
import {
  Academy,
  Lesson,
  Enrollment,
  Quiz,
  Instructor,
  LiveRoom,
  CourseStatus,
  Path,
  Testimonial,
  TrainingSchedule,
  Certificate,
} from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Create Entity for Course
export class CreateCourseDto {
  @ApiProperty({ type: "string" })
  // Field: title, Type: string
  @Column()
  title: string;

  @ApiProperty({ type: "string" })
  // Field: description, Type: string
  @Column()
  description: string;

  @ApiProperty({ type: "string" })
  // Field: academyId, Type: string
  @Column()
  academyId?: string;

  @ApiProperty({ type: "string" })
  // Field: image, Type: string
  @Column()
  image?: string;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: startDate, Type: Date
  @Column()
  startDate?: Date;

  @ApiProperty({ type: "string" })
  // Field: level, Type: string
  @Column()
  level: string;

  @ApiProperty({ type: "number" })
  // Field: duration, Type: number
  @Column()
  duration?: number;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: updatedAt, Type: Date
  @Column()
  updatedAt: Date;

  @ApiProperty({ enum: CourseStatus })
  // Field: status, Type: CourseStatus
  @Column()
  status: CourseStatus;

  @ApiProperty({ type: "number" })
  // Field: progress, Type: number
  @Column()
  progress: number;

  @ApiProperty({ type: "number" })
  // Field: price, Type: number
  @Column()
  price?: number;
}
