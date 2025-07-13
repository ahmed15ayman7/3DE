import { ApiProperty } from "@nestjs/swagger";
import { AcademyEntity } from "./Academy.entity";
import { LessonEntity } from "./Lesson.entity";
import { EnrollmentEntity } from "./Enrollment.entity";
import { QuizEntity } from "./Quiz.entity";
import { InstructorEntity } from "./Instructor.entity";
import { LiveRoomEntity } from "./LiveRoom.entity";
import { PathEntity } from "./Path.entity";
import { TestimonialEntity } from "./Testimonial.entity";
import { TrainingScheduleEntity } from "./TrainingSchedule.entity";
import { CertificateEntity } from "./Certificate.entity";
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
// This is the  Entity for Course
export class CourseEntity {
  @ApiProperty({ type: "string" })
  // Field: id, Type: string
  @Column()
  id: string;

  @ApiProperty({ type: "string" })
  // Field: title, Type: string
  @Column()
  title: string;

  @ApiProperty({ type: "string" })
  // Field: description, Type: string
  @Column()
  description: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: academyId, Type: string
  @Column()
  academyId?: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: image, Type: string
  @Column()
  image?: string;

  @ApiProperty({ type: "string", format: "date-time", nullable: true })
  // Field: startDate, Type: Date
  @Column()
  startDate?: Date;

  @ApiProperty({ type: "string" })
  // Field: level, Type: string
  @Column()
  level: string;

  @ApiProperty({ type: "number", nullable: true })
  // Field: duration, Type: number
  @Column()
  duration?: number;

  @ApiProperty({ type: AcademyEntity, nullable: true })
  // Field: academy, Type: Academy
  @Column()
  academy?: Academy;

  @ApiProperty({ type: LessonEntity })
  // Field: lessons, Type: Lesson[]
  @Column()
  lessons: Lesson[];

  @ApiProperty({ type: EnrollmentEntity })
  // Field: enrollments, Type: Enrollment[]
  @Column()
  enrollments: Enrollment[];

  @ApiProperty({ type: QuizEntity })
  // Field: quizzes, Type: Quiz[]
  @Column()
  quizzes: Quiz[];

  @ApiProperty({ type: InstructorEntity })
  // Field: instructors, Type: Instructor[]
  @Column()
  instructors: Instructor[];

  @ApiProperty({ type: LiveRoomEntity })
  // Field: liveRoom, Type: LiveRoom[]
  @Column()
  liveRoom: LiveRoom[];

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

  @ApiProperty({ type: PathEntity })
  // Field: Path, Type: Path[]
  @Column()
  Path: Path[];

  @ApiProperty({ type: TestimonialEntity })
  // Field: Testimonial, Type: Testimonial[]
  @Column()
  Testimonial: Testimonial[];

  @ApiProperty({ type: TrainingScheduleEntity })
  // Field: trainingSchedules, Type: TrainingSchedule[]
  @Column()
  trainingSchedules: TrainingSchedule[];

  @ApiProperty({ type: CertificateEntity })
  // Field: Certificate, Type: Certificate[]
  @Column()
  Certificate: Certificate[];
}
