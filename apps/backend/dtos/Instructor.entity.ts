import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "./User.entity";
import { AcademyEntity } from "./Academy.entity";
import { CourseEntity } from "./Course.entity";
import { User, Academy, Course } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the  Entity for Instructor
export class InstructorEntity {
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

  @ApiProperty({ type: "string", nullable: true })
  // Field: title, Type: string
  @Column()
  title?: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: academyId, Type: string
  @Column()
  academyId?: string;

  @ApiProperty({ type: AcademyEntity, nullable: true })
  // Field: academy, Type: Academy
  @Column()
  academy?: Academy;

  @ApiProperty({ type: CourseEntity })
  // Field: courses, Type: Course[]
  @Column()
  courses: Course[];
}
