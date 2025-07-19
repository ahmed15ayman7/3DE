import { ApiProperty } from "@nestjs/swagger";
import {
  User,
  Course,
  EnrollmentStatus,
  TraineeManagement,
} from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Create Entity for Enrollment
export class CreateEnrollmentDto {
  @ApiProperty({ type: "string" })
  // Field: userId, Type: string
  @Column()
  userId: string;

  @ApiProperty({ type: "string" })
  // Field: courseId, Type: string
  @Column()
  courseId: string;

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
}
