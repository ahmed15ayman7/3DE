import { ApiProperty } from "@nestjs/swagger";
import { CourseEntity } from "./Course.entity";
import { UserEntity } from "./User.entity";
import { AdminEntity } from "./Admin.entity";
import { Course, User, Admin } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the  Entity for EnrollmentCode
export class EnrollmentCodeEntity {
  @ApiProperty({ type: "string" })
  // Field: id, Type: string
  @Column()
  id: string;

  @ApiProperty({ type: "string" })
  // Field: code, Type: string
  @Column()
  code: string;

  @ApiProperty({ type: "string" })
  // Field: courseId, Type: string
  @Column()
  courseId: string;

  @ApiProperty({ type: CourseEntity })
  // Field: course, Type: Course
  @Column()
  course: Course;

  @ApiProperty({ type: "boolean" })
  // Field: isUsed, Type: boolean
  @Column()
  isUsed: boolean;

  @ApiProperty({ type: "string", nullable: true })
  // Field: usedById, Type: string
  @Column()
  usedById?: string;

  @ApiProperty({ type: UserEntity, nullable: true })
  // Field: usedBy, Type: User
  @Column()
  usedBy?: User;

  @ApiProperty({ type: "string" })
  // Field: createdById, Type: string
  @Column()
  createdById: string;

  @ApiProperty({ type: AdminEntity })
  // Field: createdBy, Type: Admin
  @Column()
  createdBy: Admin;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;

  @ApiProperty({ type: "string", format: "date-time", nullable: true })
  // Field: usedAt, Type: Date
  @Column()
  usedAt?: Date;
}
