import { ApiProperty } from "@nestjs/swagger";
import { User, Academy, Course } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Update Entity for Instructor
export class UpdateInstructorDto {
  @ApiProperty({ type: "string" })
  // Field: userId, Type: string
  @Column()
  userId: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: title, Type: string
  @Column()
  title?: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: academyId, Type: string
  @Column()
  academyId?: string;
}
