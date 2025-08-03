import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "./User.entity";
import { GroupEntity } from "./Group.entity";
import { AccountingEntryEntity } from "./AccountingEntry.entity";
import { PublicRelationsRecordEntity } from "./PublicRelationsRecord.entity";
import { PRResponseEntity } from "./PRResponse.entity";
import { MeetingEntity } from "./Meeting.entity";
import { AdminAssignmentEntity } from "./AdminAssignment.entity";
import { LegalCaseEntity } from "./LegalCase.entity";
import { ExpenseEntity } from "./Expense.entity";
import { AdminRoleEntity } from "./AdminRole.entity";
import { AboutSectionEntity } from "./AboutSection.entity";
import { NewsEventEntity } from "./NewsEvent.entity";
import { SuccessStoryEntity } from "./SuccessStory.entity";
import { ContactMessageEntity } from "./ContactMessage.entity";
import { BlogPostEntity } from "./BlogPost.entity";
import { CSRProjectEntity } from "./CSRProject.entity";
import { CrisisCommunicationEntity } from "./CrisisCommunication.entity";
import { PaymentLogBySecretaryEntity } from "./PaymentLogBySecretary.entity";
import { SecretaryFilesEntity } from "./SecretaryFiles.entity";
import { EmployeeAttendanceLogEntity } from "./EmployeeAttendanceLog.entity";
import { InternalMessageEntity } from "./InternalMessage.entity";
import { EnrollmentCodeEntity } from "./EnrollmentCode.entity";
import {
  User,
  Group,
  AccountingEntry,
  PublicRelationsRecord,
  PRResponse,
  Meeting,
  AdminAssignment,
  LegalCase,
  Expense,
  AdminRole,
  AboutSection,
  NewsEvent,
  SuccessStory,
  ContactMessage,
  BlogPost,
  CSRProject,
  CrisisCommunication,
  PaymentLogBySecretary,
  SecretaryFiles,
  EmployeeAttendanceLog,
  InternalMessage,
  EnrollmentCode,
} from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the  Entity for Admin
export class AdminEntity {
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

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;

  @ApiProperty({ type: GroupEntity })
  // Field: Group, Type: Group[]
  @Column()
  Group: Group[];

  @ApiProperty({ type: AccountingEntryEntity })
  // Field: accountingEntries, Type: AccountingEntry[]
  @Column()
  accountingEntries: AccountingEntry[];

  @ApiProperty({ type: PublicRelationsRecordEntity })
  // Field: prRecords, Type: PublicRelationsRecord[]
  @Column()
  prRecords: PublicRelationsRecord[];

  @ApiProperty({ type: PRResponseEntity })
  // Field: prResponses, Type: PRResponse[]
  @Column()
  prResponses: PRResponse[];

  @ApiProperty({ type: MeetingEntity })
  // Field: meetings, Type: Meeting[]
  @Column()
  meetings: Meeting[];

  @ApiProperty({ type: AdminAssignmentEntity })
  // Field: assignments, Type: AdminAssignment[]
  @Column()
  assignments: AdminAssignment[];

  @ApiProperty({ type: LegalCaseEntity })
  // Field: legalCases, Type: LegalCase[]
  @Column()
  legalCases: LegalCase[];

  @ApiProperty({ type: ExpenseEntity })
  // Field: expenses, Type: Expense[]
  @Column()
  expenses: Expense[];

  @ApiProperty({ type: AdminRoleEntity })
  // Field: AdminRole, Type: AdminRole[]
  @Column()
  AdminRole: AdminRole[];

  @ApiProperty({ type: AboutSectionEntity })
  // Field: AboutSection, Type: AboutSection[]
  @Column()
  AboutSection: AboutSection[];

  @ApiProperty({ type: NewsEventEntity })
  // Field: NewsEvent, Type: NewsEvent[]
  @Column()
  NewsEvent: NewsEvent[];

  @ApiProperty({ type: SuccessStoryEntity })
  // Field: SuccessStory, Type: SuccessStory[]
  @Column()
  SuccessStory: SuccessStory[];

  @ApiProperty({ type: ContactMessageEntity })
  // Field: ContactMessage, Type: ContactMessage[]
  @Column()
  ContactMessage: ContactMessage[];

  @ApiProperty({ type: BlogPostEntity })
  // Field: BlogPost, Type: BlogPost[]
  @Column()
  BlogPost: BlogPost[];

  @ApiProperty({ type: CSRProjectEntity })
  // Field: CSRProject, Type: CSRProject[]
  @Column()
  CSRProject: CSRProject[];

  @ApiProperty({ type: CrisisCommunicationEntity })
  // Field: CrisisCommunication, Type: CrisisCommunication[]
  @Column()
  CrisisCommunication: CrisisCommunication[];

  @ApiProperty({ type: PaymentLogBySecretaryEntity })
  // Field: paymentLogs, Type: PaymentLogBySecretary[]
  @Column()
  paymentLogs: PaymentLogBySecretary[];

  @ApiProperty({ type: SecretaryFilesEntity })
  // Field: secretaryFiles, Type: SecretaryFiles[]
  @Column()
  secretaryFiles: SecretaryFiles[];

  @ApiProperty({ type: EmployeeAttendanceLogEntity })
  // Field: employeeAttendanceLogs, Type: EmployeeAttendanceLog[]
  @Column()
  employeeAttendanceLogs: EmployeeAttendanceLog[];

  @ApiProperty({ type: InternalMessageEntity })
  // Field: sentMessages, Type: InternalMessage[]
  @Column()
  sentMessages: InternalMessage[];

  @ApiProperty({ type: InternalMessageEntity })
  // Field: receivedMessages, Type: InternalMessage[]
  @Column()
  receivedMessages: InternalMessage[];

  @ApiProperty({ type: EnrollmentCodeEntity })
  // Field: EnrollmentCode, Type: EnrollmentCode[]
  @Column()
  EnrollmentCode: EnrollmentCode[];
}
