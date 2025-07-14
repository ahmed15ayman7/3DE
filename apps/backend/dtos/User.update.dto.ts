import { ApiProperty } from "@nestjs/swagger";
import {
  UserRole,
  Academy,
  Profile,
  Enrollment,
  Achievement,
  Notification,
  Message,
  Post,
  Group,
  Channel,
  Bookmark,
  Submission,
  Attendance,
  Payment,
  Installment,
  Instructor,
  Owner,
  Admin,
  Lesson,
  Report,
  Badge,
  Certificate,
  Community,
  LiveRoom,
  NotificationSettings,
  Path,
  LoginHistory,
  TwoFactor,
  UserAcademyCEO,
  SalaryPayment,
  MeetingParticipant,
  LegalCase,
  TraineeManagement,
  TrainingSchedule,
  EmployeeAttendanceLog,
  Comment,
  LessonBlockList,
} from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Update Entity for User
export class UpdateUserDto {
  @ApiProperty({ type: "string" })
  // Field: email, Type: string
  @Column()
  email: string;

  @ApiProperty({ type: "string" })
  // Field: password, Type: string
  @Column()
  password: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: phone, Type: string
  @Column()
  phone?: string;

  @ApiProperty({ type: "string" })
  // Field: firstName, Type: string
  @Column()
  firstName: string;

  @ApiProperty({ type: "string" })
  // Field: lastName, Type: string
  @Column()
  lastName: string;

  @ApiProperty({ enum: UserRole })
  // Field: role, Type: UserRole
  @Column()
  role: UserRole;

  @ApiProperty({ type: "string", nullable: true })
  // Field: subRole, Type: string
  @Column()
  subRole?: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: avatar, Type: string
  @Column()
  avatar?: string;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: updatedAt, Type: Date
  @Column()
  updatedAt: Date;

  @ApiProperty({ type: "string", nullable: true })
  // Field: academyId, Type: string
  @Column()
  academyId?: string;

  @ApiProperty({ type: "boolean" })
  // Field: isOnline, Type: boolean
  @Column()
  isOnline: boolean;

  @ApiProperty({ type: "boolean" })
  // Field: isVerified, Type: boolean
  @Column()
  isVerified: boolean;

  @ApiProperty({ type: "number", nullable: true })
  // Field: age, Type: number
  @Column()
  age?: number;

  @ApiProperty({ type: "number", nullable: true })
  // Field: progress, Type: number
  @Column()
  progress?: number;

  @ApiProperty({ type: "string", nullable: true })
  // Field: location, Type: string
  @Column()
  location?: string;
}
