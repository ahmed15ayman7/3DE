import { ApiProperty } from "@nestjs/swagger";
import { PublicRelationsRecordEntity } from "./PublicRelationsRecord.entity";
import { AdminRoleEntity } from "./AdminRole.entity";
import { LegalCaseEntity } from "./LegalCase.entity";
import { PublicRelationsRecord, AdminRole, LegalCase } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the  Entity for Event
export class EventEntity {
  @ApiProperty({ type: "string" })
  // Field: id, Type: string
  @Column()
  id: string;

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

  @ApiProperty({ type: PublicRelationsRecordEntity, nullable: true })
  // Field: prRecord, Type: PublicRelationsRecord
  @Column()
  prRecord?: PublicRelationsRecord;

  @ApiProperty({ type: "string", nullable: true })
  // Field: adminRoleId, Type: string
  @Column()
  adminRoleId?: string;

  @ApiProperty({ type: AdminRoleEntity, nullable: true })
  // Field: adminRole, Type: AdminRole
  @Column()
  adminRole?: AdminRole;

  @ApiProperty({ type: "string", nullable: true })
  // Field: legalCaseId, Type: string
  @Column()
  legalCaseId?: string;

  @ApiProperty({ type: LegalCaseEntity, nullable: true })
  // Field: legalCase, Type: LegalCase
  @Column()
  legalCase?: LegalCase;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: updatedAt, Type: Date
  @Column()
  updatedAt: Date;
}
