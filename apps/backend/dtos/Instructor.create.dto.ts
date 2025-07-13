import { ApiProperty } from "@nestjs/swagger";
import { User, Academy, Course } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Create Entity for Instructor
export class CreateInstructorDto {
  @ApiProperty({ type: "string" })
  // Field: userId, Type: string
  @Column()
  userId: string;

  @ApiProperty({ type: "string" })
  // Field: title, Type: string
  @Column()
  title?: string;

  @ApiProperty({ type: "string" })
  // Field: academyId, Type: string
  @Column()
  academyId?: string;

  @ApiProperty({ type: "number" })
  // Field: rating, Type: number
  @Column()
  rating?: number;

  @ApiProperty({ type: "number" })
  // Field: experienceYears, Type: number
  @Column()
  experienceYears?: number;

  @ApiProperty({ type: "string" })
  // Field: bio, Type: string
  @Column()
  bio?: string;

  @ApiProperty({ type: "string" })
  // Field: skills, Type: string[]
  @Column()
  skills: string[];

  @ApiProperty({ type: "string" })
  // Field: location, Type: string
  @Column()
  location?: string;
}
