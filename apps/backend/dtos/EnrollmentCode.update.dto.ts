import { ApiProperty } from "@nestjs/swagger";
import { Course, User, Admin } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Update Entity for EnrollmentCode
export class UpdateEnrollmentCodeDto {
  @ApiProperty({ type: "string" })
  // Field: code, Type: string
  @Column()
  code: string;

  @ApiProperty({ type: "string" })
  // Field: courseId, Type: string
  @Column()
  courseId: string;

  @ApiProperty({ type: "boolean" })
  // Field: isUsed, Type: boolean
  @Column()
  isUsed: boolean;

  @ApiProperty({ type: "string", nullable: true })
  // Field: usedById, Type: string
  @Column()
  usedById?: string;

  @ApiProperty({ type: "string" })
  // Field: createdById, Type: string
  @Column()
  createdById: string;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;

  @ApiProperty({ type: "string", format: "date-time", nullable: true })
  // Field: usedAt, Type: Date
  @Column()
  usedAt?: Date;
}
