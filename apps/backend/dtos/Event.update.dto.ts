import { ApiProperty } from "@nestjs/swagger";
import { PublicRelationsRecord, AdminRole, LegalCase } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Update Entity for Event
export class UpdateEventDto {
  @ApiProperty({ type: "string" })
  // Field: title, Type: string
  @Column()
  title: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: description, Type: string
  @Column()
  description?: string;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: startTime, Type: Date
  @Column()
  startTime: Date;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: endTime, Type: Date
  @Column()
  endTime: Date;

  @ApiProperty({ type: "string", nullable: true })
  // Field: location, Type: string
  @Column()
  location?: string;

  @ApiProperty({ type: "number", nullable: true })
  // Field: capacity, Type: number
  @Column()
  capacity?: number;

  @ApiProperty({ type: "string", nullable: true })
  // Field: image, Type: string
  @Column()
  image?: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: prRecordId, Type: string
  @Column()
  prRecordId?: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: adminRoleId, Type: string
  @Column()
  adminRoleId?: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: legalCaseId, Type: string
  @Column()
  legalCaseId?: string;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: updatedAt, Type: Date
  @Column()
  updatedAt: Date;
}
