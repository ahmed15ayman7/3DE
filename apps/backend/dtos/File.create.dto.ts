import { ApiProperty } from "@nestjs/swagger";
import {
  FileType,
  Lesson,
  AccountingEntry,
  PublicRelationsRecord,
  Meeting,
  AdminRole,
  LegalCase,
  SecretaryFiles,
  TraineeManagement,
} from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Create Entity for File
export class CreateFileDto {
  @ApiProperty({ type: "string" })
  // Field: name, Type: string
  @Column()
  name: string;

  @ApiProperty({ type: "string" })
  // Field: url, Type: string
  @Column()
  url: string;

  @ApiProperty({ enum: FileType })
  // Field: type, Type: FileType
  @Column()
  type: FileType;

  @ApiProperty({ type: "boolean" })
  // Field: isCompleted, Type: boolean
  @Column()
  isCompleted: boolean;

  @ApiProperty({ type: "number" })
  // Field: lastWatched, Type: number
  @Column()
  lastWatched?: number;

  @ApiProperty({ type: "string" })
  // Field: lessonId, Type: string
  @Column()
  lessonId?: string;

  @ApiProperty({ type: "string" })
  // Field: accountingEntryId, Type: string
  @Column()
  accountingEntryId?: string;

  @ApiProperty({ type: "string" })
  // Field: prRecordId, Type: string
  @Column()
  prRecordId?: string;

  @ApiProperty({ type: "string" })
  // Field: meetingId, Type: string
  @Column()
  meetingId?: string;

  @ApiProperty({ type: "string" })
  // Field: adminRoleId, Type: string
  @Column()
  adminRoleId?: string;

  @ApiProperty({ type: "string" })
  // Field: legalCaseId, Type: string
  @Column()
  legalCaseId?: string;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;
}
