import { ApiProperty } from "@nestjs/swagger";
import {
  User,
  UserAcademyCEO,
  Course,
  Instructor,
  AccountingEntry,
  PublicRelationsRecord,
  Meeting,
  LegalCase,
  Testimonial,
  MediaAlert,
  PartnershipAgreement,
  CSRProject,
} from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Create Entity for Academy
export class CreateAcademyDto {
  @ApiProperty({ type: "string" })
  // Field: name, Type: string
  @Column()
  name: string;

  @ApiProperty({ type: "string" })
  // Field: description, Type: string
  @Column()
  description?: string;

  @ApiProperty({ type: "string" })
  // Field: logo, Type: string
  @Column()
  logo?: string;

  @ApiProperty({ additionalProperties: true, type: "object" })
  // Field: settings, Type: object
  @Column()
  settings?: object;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: updatedAt, Type: Date
  @Column()
  updatedAt: Date;
}
