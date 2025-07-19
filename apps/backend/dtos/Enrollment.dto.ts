import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "./User.entity";
import { CourseEntity } from "./Course.entity";
import { TraineeManagementEntity } from "./TraineeManagement.entity";
import {
  User,
  Course,
  EnrollmentStatus,
  TraineeManagement,
} from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the  Entity for Enrollment
export class EnrollmentDto {
  @ApiProperty({ type: "string" })
  // Field: id, Type: string
  @Column()
  id: string;

  @ApiProperty({ type: "string" })
  // Field: userId, Type: string
  @Column()
  userId: string;

  @ApiProperty({ type: UserEntity })
  // Field: user, Type: User
  @Column()
  user: User;

  @ApiProperty({ type: "string" })
  // Field: courseId, Type: string
  @Column()
  courseId: string;

  @ApiProperty({ type: CourseEntity })
  // Field: course, Type: Course
  @Column()
  course: Course;

  @ApiProperty({ type: "number" })
  // Field: progress, Type: number
  @Column()
  progress: number;

  @ApiProperty({ enum: EnrollmentStatus })
  // Field: status, Type: EnrollmentStatus
  @Column()
  status: EnrollmentStatus;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: updatedAt, Type: Date
  @Column()
  updatedAt: Date;

  @ApiProperty({ type: TraineeManagementEntity })
  // Field: traineeManagement, Type: TraineeManagement[]
  @Column()
  traineeManagement: TraineeManagement[];
}
