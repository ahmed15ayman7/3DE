import { ApiProperty } from "@nestjs/swagger";
import { LessonEntity } from "./Lesson.entity";
import { AccountingEntryEntity } from "./AccountingEntry.entity";
import { PublicRelationsRecordEntity } from "./PublicRelationsRecord.entity";
import { MeetingEntity } from "./Meeting.entity";
import { AdminRoleEntity } from "./AdminRole.entity";
import { LegalCaseEntity } from "./LegalCase.entity";
import { SecretaryFilesEntity } from "./SecretaryFiles.entity";
import { TraineeManagementEntity } from "./TraineeManagement.entity";
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
// This is the  Entity for File
export class FileEntity {
  @ApiProperty({ type: "string" })
  // Field: id, Type: string
  @Column()
  id: string;

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

  @ApiProperty({ type: "string", nullable: true })
  // Field: lessonId, Type: string
  @Column()
  lessonId?: string;

  @ApiProperty({ type: LessonEntity, nullable: true })
  // Field: lesson, Type: Lesson
  @Column()
  lesson?: Lesson;

  @ApiProperty({ type: "string", nullable: true })
  // Field: accountingEntryId, Type: string
  @Column()
  accountingEntryId?: string;

  @ApiProperty({ type: AccountingEntryEntity, nullable: true })
  // Field: accountingEntry, Type: AccountingEntry
  @Column()
  accountingEntry?: AccountingEntry;

  @ApiProperty({ type: "string", nullable: true })
  // Field: prRecordId, Type: string
  @Column()
  prRecordId?: string;

  @ApiProperty({ type: PublicRelationsRecordEntity, nullable: true })
  // Field: prRecord, Type: PublicRelationsRecord
  @Column()
  prRecord?: PublicRelationsRecord;

  @ApiProperty({ type: "string", nullable: true })
  // Field: meetingId, Type: string
  @Column()
  meetingId?: string;

  @ApiProperty({ type: MeetingEntity, nullable: true })
  // Field: meeting, Type: Meeting
  @Column()
  meeting?: Meeting;

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

  @ApiProperty({ type: SecretaryFilesEntity })
  // Field: secretaryFiles, Type: SecretaryFiles[]
  @Column()
  secretaryFiles: SecretaryFiles[];

  @ApiProperty({ type: TraineeManagementEntity })
  // Field: traineeManagement, Type: TraineeManagement[]
  @Column()
  traineeManagement: TraineeManagement[];

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;
}
