import { ApiProperty } from "@nestjs/swagger";
import { AcademyEntity } from "./Academy.entity";
import { ProfileEntity } from "./Profile.entity";
import { EnrollmentEntity } from "./Enrollment.entity";
import { AchievementEntity } from "./Achievement.entity";
import { NotificationEntity } from "./Notification.entity";
import { MessageEntity } from "./Message.entity";
import { PostEntity } from "./Post.entity";
import { GroupEntity } from "./Group.entity";
import { ChannelEntity } from "./Channel.entity";
import { BookmarkEntity } from "./Bookmark.entity";
import { SubmissionEntity } from "./Submission.entity";
import { AttendanceEntity } from "./Attendance.entity";
import { PaymentEntity } from "./Payment.entity";
import { InstallmentEntity } from "./Installment.entity";
import { InstructorEntity } from "./Instructor.entity";
import { OwnerEntity } from "./Owner.entity";
import { AdminEntity } from "./Admin.entity";
import { LessonEntity } from "./Lesson.entity";
import { ReportEntity } from "./Report.entity";
import { BadgeEntity } from "./Badge.entity";
import { CertificateEntity } from "./Certificate.entity";
import { CommunityEntity } from "./Community.entity";
import { LiveRoomEntity } from "./LiveRoom.entity";
import { NotificationSettingsEntity } from "./NotificationSettings.entity";
import { PathEntity } from "./Path.entity";
import { LoginHistoryEntity } from "./LoginHistory.entity";
import { TwoFactorEntity } from "./TwoFactor.entity";
import { UserAcademyCEOEntity } from "./UserAcademyCEO.entity";
import { SalaryPaymentEntity } from "./SalaryPayment.entity";
import { MeetingParticipantEntity } from "./MeetingParticipant.entity";
import { LegalCaseEntity } from "./LegalCase.entity";
import { TraineeManagementEntity } from "./TraineeManagement.entity";
import { TrainingScheduleEntity } from "./TrainingSchedule.entity";
import { EmployeeAttendanceLogEntity } from "./EmployeeAttendanceLog.entity";
import { CommentEntity } from "./Comment.entity";
import { LessonWhiteListEntity } from "./LessonWhiteList.entity";
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
  LessonWhiteList,
} from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the  Entity for User
export class UserEntity {
  @ApiProperty({ type: "string" })
  // Field: id, Type: string
  @Column()
  id: string;

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

  @ApiProperty({ type: AcademyEntity, nullable: true })
  // Field: academy, Type: Academy
  @Column()
  academy?: Academy;

  @ApiProperty({ type: ProfileEntity, nullable: true })
  // Field: profile, Type: Profile
  @Column()
  profile?: Profile;

  @ApiProperty({ type: EnrollmentEntity })
  // Field: enrollments, Type: Enrollment[]
  @Column()
  enrollments: Enrollment[];

  @ApiProperty({ type: AchievementEntity })
  // Field: achievements, Type: Achievement[]
  @Column()
  achievements: Achievement[];

  @ApiProperty({ type: NotificationEntity })
  // Field: notifications, Type: Notification[]
  @Column()
  notifications: Notification[];

  @ApiProperty({ type: MessageEntity })
  // Field: messages, Type: Message[]
  @Column()
  messages: Message[];

  @ApiProperty({ type: PostEntity })
  // Field: posts, Type: Post[]
  @Column()
  posts: Post[];

  @ApiProperty({ type: GroupEntity })
  // Field: groups, Type: Group[]
  @Column()
  groups: Group[];

  @ApiProperty({ type: ChannelEntity })
  // Field: channels, Type: Channel[]
  @Column()
  channels: Channel[];

  @ApiProperty({ type: BookmarkEntity })
  // Field: bookmarks, Type: Bookmark[]
  @Column()
  bookmarks: Bookmark[];

  @ApiProperty({ type: SubmissionEntity })
  // Field: Submission, Type: Submission[]
  @Column()
  Submission: Submission[];

  @ApiProperty({ type: AttendanceEntity })
  // Field: Attendance, Type: Attendance[]
  @Column()
  Attendance: Attendance[];

  @ApiProperty({ type: PaymentEntity })
  // Field: payments, Type: Payment[]
  @Column()
  payments: Payment[];

  @ApiProperty({ type: InstallmentEntity })
  // Field: installments, Type: Installment[]
  @Column()
  installments: Installment[];

  @ApiProperty({ type: InstructorEntity })
  // Field: Instructor, Type: Instructor[]
  @Column()
  Instructor: Instructor[];

  @ApiProperty({ type: OwnerEntity })
  // Field: Owner, Type: Owner[]
  @Column()
  Owner: Owner[];

  @ApiProperty({ type: AdminEntity })
  // Field: Admin, Type: Admin[]
  @Column()
  Admin: Admin[];

  @ApiProperty({ type: LessonEntity })
  // Field: Lesson, Type: Lesson[]
  @Column()
  Lesson: Lesson[];

  @ApiProperty({ type: ReportEntity })
  // Field: Report, Type: Report[]
  @Column()
  Report: Report[];

  @ApiProperty({ type: BadgeEntity })
  // Field: Badge, Type: Badge[]
  @Column()
  Badge: Badge[];

  @ApiProperty({ type: CertificateEntity })
  // Field: Certificate, Type: Certificate[]
  @Column()
  Certificate: Certificate[];

  @ApiProperty({ type: CommunityEntity })
  // Field: Community, Type: Community[]
  @Column()
  Community: Community[];

  @ApiProperty({ type: LiveRoomEntity })
  // Field: LiveRoom, Type: LiveRoom[]
  @Column()
  LiveRoom: LiveRoom[];

  @ApiProperty({ type: NotificationSettingsEntity })
  // Field: NotificationSettings, Type: NotificationSettings[]
  @Column()
  NotificationSettings: NotificationSettings[];

  @ApiProperty({ type: PathEntity })
  // Field: Path, Type: Path[]
  @Column()
  Path: Path[];

  @ApiProperty({ type: LoginHistoryEntity })
  // Field: LoginHistory, Type: LoginHistory[]
  @Column()
  LoginHistory: LoginHistory[];

  @ApiProperty({ type: TwoFactorEntity })
  // Field: TwoFactor, Type: TwoFactor[]
  @Column()
  TwoFactor: TwoFactor[];

  @ApiProperty({ type: UserAcademyCEOEntity })
  // Field: UserAcademyCEO, Type: UserAcademyCEO[]
  @Column()
  UserAcademyCEO: UserAcademyCEO[];

  @ApiProperty({ type: SalaryPaymentEntity })
  // Field: SalaryPayment, Type: SalaryPayment[]
  @Column()
  SalaryPayment: SalaryPayment[];

  @ApiProperty({ type: MeetingParticipantEntity })
  // Field: MeetingParticipant, Type: MeetingParticipant[]
  @Column()
  MeetingParticipant: MeetingParticipant[];

  @ApiProperty({ type: LegalCaseEntity })
  // Field: LegalCase, Type: LegalCase[]
  @Column()
  LegalCase: LegalCase[];

  @ApiProperty({ type: TraineeManagementEntity })
  // Field: traineeManagement, Type: TraineeManagement[]
  @Column()
  traineeManagement: TraineeManagement[];

  @ApiProperty({ type: TrainingScheduleEntity })
  // Field: trainingSchedules, Type: TrainingSchedule[]
  @Column()
  trainingSchedules: TrainingSchedule[];

  @ApiProperty({ type: EmployeeAttendanceLogEntity })
  // Field: employeeAttendanceLogs, Type: EmployeeAttendanceLog[]
  @Column()
  employeeAttendanceLogs: EmployeeAttendanceLog[];

  @ApiProperty({ type: CommentEntity })
  // Field: Comment, Type: Comment[]
  @Column()
  Comment: Comment[];

  @ApiProperty({ type: LessonWhiteListEntity })
  // Field: LessonWhiteList, Type: LessonWhiteList[]
  @Column()
  LessonWhiteList: LessonWhiteList[];
}
