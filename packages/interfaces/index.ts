export type LoginDevice = 'DESKTOP' | 'MOBILE' | 'TABLET' | 'LAPTOP';

export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'PARENT' | 'ADMIN' | 'ACADEMY';

export type CourseStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED';

export type MilestoneStatus = 'IN_PROGRESS' | 'COMPLETED' | 'NOT_STARTED';

export type LessonStatus = 'IN_PROGRESS' | 'COMPLETED' | 'NOT_STARTED';

export type FileType = 'VIDEO' | 'PDF' | 'DOCUMENT' | 'IMAGE' | 'AUDIO';

export type NotificationType = 'ASSIGNMENT' | 'GRADE' | 'MESSAGE' | 'ACHIEVEMENT' | 'URGENT' | 'EVENT' | 'ABSENCE';

export type AccountingType = 'EXPENSE' | 'INCOME' | 'SALARY' | 'ADVANCE' | 'INVOICE';

export type InvoiceStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export type PRRequestStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export type AdminRoleType = 'DIRECTOR' | 'ACCOUNTANT' | 'SECRETARY' | 'LEGAL_ADVISOR' | 'HR_MANAGER' | 'IT_MANAGER' | 'GENERAL_MANAGER' | 'ADMIN' | 'SUPER_ADMIN' | 'PUBLIC_RELATIONS';

export type LegalCaseType = 'CONTRACT' | 'DISPUTE' | 'INSURANCE' | 'EMPLOYMENT' | 'INTELLECTUAL_PROPERTY';

export type LegalCaseStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'PENDING';

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'ELECTRONIC' | 'INSTALLMENT';

export type InstallmentStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export type ExpenseType = 'SALARY' | 'RENT' | 'UTILITIES' | 'MAINTENANCE' | 'MARKETING' | 'OTHER';

export interface User {
  id: string;
  email: string;
  password: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  subRole?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  academyId?: string;
  isOnline: boolean;
  isVerified: boolean;
  age?: number;
  progress?: number;
  location?: string;
  academy?: Academy | undefined;
  profile?: Profile | undefined;
  enrollments: Enrollment[] | undefined;
  achievements: Achievement[] | undefined;
  notifications: Notification[] | undefined;
  messages: Message[] | undefined;
  posts: Post[] | undefined;
  groups: Group[] | undefined;
  channels: Channel[] | undefined;
  bookmarks: Bookmark[] | undefined;
  Submission: Submission[] | undefined;
  Attendance: Attendance[] | undefined;
  payments: Payment[] | undefined;
  installments: Installment[] | undefined;
  Instructor: Instructor[] | undefined;
  Owner: Owner[] | undefined;
  Admin: Admin[] | undefined;
  Lesson: Lesson[] | undefined;
  Report: Report[] | undefined;
  Badge: Badge[] | undefined;
  Certificate: Certificate[] | undefined;
  Community: Community[] | undefined;
  LiveRoom: LiveRoom[] | undefined;
  NotificationSettings: NotificationSettings[] | undefined;
  Path: Path[] | undefined;
  LoginHistory: LoginHistory[] | undefined;
  TwoFactor: TwoFactor[] | undefined;
  UserAcademyCEO: UserAcademyCEO[] | undefined;
  SalaryPayment: SalaryPayment[] | undefined;
  MeetingParticipant: MeetingParticipant[] | undefined;
  LegalCase: LegalCase[] | undefined;
  traineeManagement: TraineeManagement[] | undefined;
  trainingSchedules: TrainingSchedule[] | undefined;
  employeeAttendanceLogs: EmployeeAttendanceLog[] | undefined;
  Comment: Comment[] | undefined;
  LessonWhiteList: LessonWhiteList[] | undefined;
  WatchedLesson: WatchedLesson[] | undefined;
}

export interface LoginHistory {
  id: string;
  userId: string;
  user: User | undefined;
  success: boolean;
  ip?: string;
  device?: LoginDevice | undefined;
  location?: string;
  browser?: string;
  os?: string;
  createdAt: Date;
}

export interface TwoFactor {
  id: string;
  userId: string;
  user: User | undefined;
  email: boolean;
  sms: boolean;
  authenticator: boolean;
  secret?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  user: User | undefined;
  bio?: string;
  phone?: string;
  address?: string;
  preferences?: any;
}

export interface UserAcademyCEO {
  id: string;
  userId: string;
  user: User | undefined;
  academyId: string;
  academy: Academy | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface Academy {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  settings?: any;
  users: User[] | undefined;
  ceos: UserAcademyCEO[] | undefined;
  courses: Course[] | undefined;
  instructors: Instructor[] | undefined;
  events: Event[] | undefined;
  createdAt: Date;
  updatedAt: Date;
  AccountingEntry: AccountingEntry[] | undefined;
  PublicRelationsRecord: PublicRelationsRecord[] | undefined;
  Meeting: Meeting[] | undefined;
  LegalCase: LegalCase[] | undefined;
  Testimonial: Testimonial[] | undefined;
  mediaAlerts: MediaAlert[] | undefined;
  partnershipAgreements: PartnershipAgreement[] | undefined;
  csrProjects: CSRProject[] | undefined;
}

export interface Instructor {
  id: string;
  userId: string;
  user: User | undefined;
  title?: string;
  academyId?: string;
  rating?: number;
  experienceYears?: number;
  bio?: string;
  academy?: Academy | undefined;
  courses: Course[] | undefined;
  skills: string[];
  location?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  academyId?: string;
  image?: string;
  startDate?: Date;
  level: string;
  duration?: number;
  academy?: Academy | undefined;
  lessons: Lesson[] | undefined;
  enrollments: Enrollment[] | undefined;
  quizzes: Quiz[] | undefined;
  instructors: Instructor[] | undefined;
  liveRoom: LiveRoom[] | undefined;
  createdAt: Date;
  updatedAt: Date;
  status: CourseStatus;
  progress: number;
  price?: number;
  Path: Path[] | undefined;
  Testimonial: Testimonial[] | undefined;
  trainingSchedules: TrainingSchedule[] | undefined;
  Certificate: Certificate[] | undefined;
}

export interface Path {
  id: string;
  title: string;
  milestones: Milestone[] | undefined;
  description?: string;
  level: string;
  completedTasks: number;
  courses: Course[] | undefined;
  peers: User[] | undefined;
  remainingTime: number;
  studyTime: number;
  totalTasks: number;
  progress: number;
  engagement: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  status: MilestoneStatus;
  pathId: string;
  path: Path | undefined;
  createdAt: Date;
}

export interface LessonWhiteList {
  id: string;
  lessonId: string;
  lesson: Lesson | undefined;
  userId: string;
  user: User | undefined;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  //: videoUrl | undefined;
  courseId: string;
  course: Course | undefined;
  files: File[] | undefined;
  quizzes: Quiz[] | undefined;
  completedBy: User[] | undefined;
  progress: number;
  status: LessonStatus;
  createdAt: Date;
  updatedAt: Date;
  lastOpenedAt?: Date;
  Attendance: Attendance[] | undefined;
  LessonWhiteList: LessonWhiteList[] | undefined;
  WatchedLesson: WatchedLesson[] | undefined;
}

export interface WatchedLesson {
  id: string;
  progress: number;
  lessonId: string;
  lesson: Lesson | undefined;
  userId: string;
  user: User | undefined;
}

export interface File {
  id: string;
  name: string;
  url: string;
  type: FileType | undefined;
  isCompleted: boolean;
  lastWatched?: number;
  lessonId?: string;
  lesson?: Lesson | undefined;
  accountingEntryId?: string;
  accountingEntry?: AccountingEntry | undefined;
  prRecordId?: string;
  prRecord?: PublicRelationsRecord | undefined;
  meetingId?: string;
  meeting?: Meeting | undefined;
  adminRoleId?: string;
  adminRole?: AdminRole | undefined;
  legalCaseId?: string;
  legalCase?: LegalCase | undefined;
  secretaryFiles: SecretaryFiles[] | undefined;
  traineeManagement: TraineeManagement[] | undefined;
  createdAt: Date;
}

export interface Enrollment {
  id: string;
  userId: string;
  user: User | undefined;
  courseId: string;
  course: Course | undefined;
  progress: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  traineeManagement: TraineeManagement[] | undefined;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  lessonId: string;
  lesson: Lesson | undefined;
  questions: Question[] | undefined;
  submissions: Submission[] | undefined;
  timeLimit?: number;
  passingScore?: number;
  upComing: boolean;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  Course: Course[] | undefined;
}

export interface Question {
  id: string;
  text: string;
  image?: string;
  type: string;
  options: Option[] | undefined;
  isMultiple: boolean;
  points: number;
  isAnswered: boolean;
  quizId: string;
  quiz: Quiz | undefined;
  createdAt: Date;
}

export interface Option {
  id: string;
  questionId: string;
  question: Question | undefined;
  text: string;
  isCorrect: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Submission {
  id: string;
  userId: string;
  user: User | undefined;
  quizId: string;
  quiz: Quiz | undefined;
  answers: any[];
  score?: number;
  feedback?: string;
  passed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  userId: string;
  user: User | undefined;
  type: string;
  value: any;
  isNew: boolean;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  user: User | undefined;
  type: NotificationType;
  message: string;
  isImportant: boolean;
  urgent: boolean;
  title: string;
  actionUrl?: string;
  read: boolean;
  trainingScheduleId?: string;
  trainingSchedule?: TrainingSchedule | undefined;
  createdAt: Date;
}

export interface NotificationSettings {
  id: string;
  userId: string;
  user: User | undefined;
  assignments: boolean;
  grades: boolean;
  messages: boolean;
  achievements: boolean;
  urgent: boolean;
  email: boolean;
  push: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  sender: User | undefined;
  content: string;
  createdAt: Date;
  isRead: boolean;
  Channel: Channel[] | undefined;
}

export interface Post {
  id: string;
  authorId: string;
  author: User | undefined;
  content: string;
  image?: string;
  title: string;
  createdAt: Date;
  likesCount: number;
  comments: Comment[] | undefined;
  Group: Group[] | undefined;
  Community: Community[] | undefined;
  Discussion: Discussion[] | undefined;
  PublicRelationsRecord?: PublicRelationsRecord | undefined;
  publicRelationsRecordId?: string;
}

export interface Comment {
  id: string;
  postId: string;
  post: Post | undefined;
  content: string;
  authorId: string;
  author: User | undefined;
  createdAt: Date;
}

export interface Group {
  id: string;
  name: string;
  subject: string;
  image?: string;
  members: User[] | undefined;
  adminId: string;
  posts: Post[] | undefined;
  admin: Admin | undefined;
  createdAt: Date;
  Community: Community[] | undefined;
}

export interface Admin {
  id: string;
  userId: string;
  user: User | undefined;
  createdAt: Date;
  Group: Group[] | undefined;
  accountingEntries: AccountingEntry[] | undefined;
  prRecords: PublicRelationsRecord[] | undefined;
  prResponses: PRResponse[] | undefined;
  meetings: Meeting[] | undefined;
  assignments: AdminAssignment[] | undefined;
  legalCases: LegalCase[] | undefined;
  expenses: Expense[] | undefined;
  AdminRole: AdminRole[] | undefined;
  AboutSection: AboutSection[] | undefined;
  NewsEvent: NewsEvent[] | undefined;
  SuccessStory: SuccessStory[] | undefined;
  ContactMessage: ContactMessage[] | undefined;
  BlogPost: BlogPost[] | undefined;
  CSRProject: CSRProject[] | undefined;
  CrisisCommunication: CrisisCommunication[] | undefined;
  paymentLogs: PaymentLogBySecretary[] | undefined;
  secretaryFiles: SecretaryFiles[] | undefined;
  employeeAttendanceLogs: EmployeeAttendanceLog[] | undefined;
  sentMessages: InternalMessage[] | undefined;
  receivedMessages: InternalMessage[] | undefined;
}

export interface Channel {
  id: string;
  name: string;
  members: User[] | undefined;
  ownerId: string;
  owner: Owner | undefined;
  messages: Message[] | undefined;
  prRecordId?: string;
  prRecord?: PublicRelationsRecord | undefined;
  meetingId?: string;
  meeting?: Meeting | undefined;
  adminRoleId?: string;
  adminRole?: AdminRole | undefined;
  legalCaseId?: string;
  legalCase?: LegalCase | undefined;
  createdAt: Date;
}

export interface Owner {
  id: string;
  userId: string;
  user: User | undefined;
  createdAt: Date;
  Channel: Channel[] | undefined;
}

export interface Bookmark {
  id: string;
  userId: string;
  user: User | undefined;
  type: string;
  itemId: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  academyId: string;
  academy: Academy | undefined;
  prRecordId?: string;
  prRecord?: PublicRelationsRecord | undefined;
  adminRoleId?: string;
  adminRole?: AdminRole | undefined;
  legalCaseId?: string;
  legalCase?: LegalCase | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  id: string;
  studentId: string;
  student: User | undefined;
  lessonId: string;
  lesson: Lesson | undefined;
  status: string;
  method: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  userId: string;
  user: User | undefined;
  amount: number;
  method: PaymentMethod | undefined;
  paidAt: Date;
  branchId: string;
  branch: Branch | undefined;
  installments: Installment[] | undefined;
  legalCaseId?: string;
  legalCase?: LegalCase | undefined;
  createdAt: Date;
  updatedAt: Date;
  secretaryLogs: PaymentLogBySecretary[] | undefined;
}

export interface Report {
  id: string;
  userId: string;
  user: User | undefined;
  accountingEntryId?: string;
  accountingEntry?: AccountingEntry | undefined;
  meetingId?: string;
  meeting?: Meeting | undefined;
  adminRoleId?: string;
  adminRole?: AdminRole | undefined;
  legalCaseId?: string;
  legalCase?: LegalCase | undefined;
  createdAt: Date;
}

export interface Badge {
  id: string;
  userId: string;
  user: User | undefined;
  title: string;
  description?: string;
  image?: string;
  points: number;
  type: string;
  earnedAt: Date;
  createdAt: Date;
}

export interface Certificate {
  id: string;
  name: string;
  address: string;
  phone: string;
  notes: string;
  userId: string;
  user: User | undefined;
  title: string;
  courseId: string;
  course: Course | undefined;
  description?: string;
  url?: string;
  image?: string;
  isApproved: boolean;
  points: number;
  type: string;
  earnedAt: Date;
  createdAt: Date;
}

export interface Community {
  id: string;
  name: string;
  image?: string;
  description?: string;
  type: string;
  groups: Group[] | undefined;
  liveRoom: LiveRoom[] | undefined;
  participants: User[] | undefined;
  posts: Post[] | undefined;
  discussions: Discussion[] | undefined;
  likes: number;
  dislikes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Discussion {
  id: string;
  communityId: string;
  community: Community | undefined;
  postId?: string;
  post?: Post | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface LiveRoom {
  id: string;
  title: string;
  topic?: string;
  participants: number;
  isLive: boolean;
  isActive: boolean;
  isPublic: boolean;
  isPrivate: boolean;
  isPasswordProtected: boolean;
  createdAt: Date;
  updatedAt: Date;
  communityId: string;
  community: Community | undefined;
  User: User[] | undefined;
  courseId?: string;
  course?: Course | undefined;
}

export interface AccountingEntry {
  id: string;
  type: AccountingType | undefined;
  amount: number;
  description: string;
  date: Date;
  createdByAdminId: string;
  createdByAdmin: Admin | undefined;
  academyId: string;
  academy: Academy | undefined;
  invoice?: Invoice | undefined;
  salaryPayment?: SalaryPayment | undefined;
  files: File[] | undefined;
  reports: Report[] | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  description: string;
  dueDate: Date;
  status: InvoiceStatus;
  accountingEntryId: string;
  accountingEntry: AccountingEntry | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalaryPayment {
  id: string;
  employeeId: string;
  employee: User | undefined;
  amount: number;
  month: number;
  year: number;
  accountingEntryId: string;
  accountingEntry: AccountingEntry | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicRelationsRecord {
  id: string;
  message: string;
  senderName: string;
  senderContact: string;
  status: PRRequestStatus;
  handledByAdminId: string;
  handledByAdmin: Admin | undefined;
  academyId: string;
  academy: Academy | undefined;
  responses: PRResponse[] | undefined;
  events: Event[] | undefined;
  posts: Post[] | undefined;
  files: File[] | undefined;
  channels: Channel[] | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface PRResponse {
  id: string;
  response: string;
  prRecordId: string;
  prRecord: PublicRelationsRecord | undefined;
  respondedByAdminId: string;
  respondedByAdmin: Admin | undefined;
  createdAt: Date;
}

export interface Meeting {
  id: string;
  meetingTitle: string;
  meetingDate: Date;
  location: string;
  notes?: string;
  createdByAdminId: string;
  createdByAdmin: Admin | undefined;
  academyId: string;
  academy: Academy | undefined;
  participants: MeetingParticipant[] | undefined;
  files: File[] | undefined;
  reports: Report[] | undefined;
  channels: Channel[] | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface MeetingParticipant {
  id: string;
  meetingId: string;
  meeting: Meeting | undefined;
  userId: string;
  user: User | undefined;
  isAttended: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  AdminRole: AdminRole[] | undefined;
}

export interface AdminRole {
  id: string;
  name: AdminRoleType | undefined;
  description?: string;
  adminId: string;
  admin: Admin | undefined;
  assignments: AdminAssignment[] | undefined;
  permissions: Permission[] | undefined;
  reports: Report[] | undefined;
  files: File[] | undefined;
  events: Event[] | undefined;
  channels: Channel[] | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminAssignment {
  id: string;
  adminId: string;
  admin: Admin | undefined;
  roleId: string;
  role: AdminRole | undefined;
  startDate: Date;
  endDate?: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LegalCase {
  id: string;
  caseTitle: string;
  caseType: LegalCaseType | undefined;
  status: LegalCaseStatus;
  description: string;
  courtDate?: Date;
  assignedLawyerId: string;
  assignedLawyer: Admin | undefined;
  academyId: string;
  academy: Academy | undefined;
  relatedUserId?: string;
  relatedUser?: User | undefined;
  files: File[] | undefined;
  reports: Report[] | undefined;
  events: Event[] | undefined;
  channels: Channel[] | undefined;
  payments: Payment[] | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface Installment {
  id: string;
  userId: string;
  user: User | undefined;
  amount: number;
  dueDate: Date;
  status: InstallmentStatus;
  paymentId?: string;
  payment?: Payment | undefined;
  branchId: string;
  branch: Branch | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  type: ExpenseType | undefined;
  amount: number;
  description?: string;
  paidAt: Date;
  branchId: string;
  branch: Branch | undefined;
  createdBy: string;
  createdByAdmin: Admin | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface Branch {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  payments: Payment[] | undefined;
  installments: Installment[] | undefined;
  expenses: Expense[] | undefined;
  finance?: BranchFinance | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface BranchFinance {
  id: string;
  branchId: string;
  branch: Branch | undefined;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AboutSection {
  id: string;
  title: string;
  content: string;
  image?: string;
  type: string;
  createdById: string;
  createdBy: Admin | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsEvent {
  id: string;
  title: string;
  content: string;
  date: Date;
  type: string;
  image?: string;
  createdById: string;
  createdBy: Admin | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface SuccessStory {
  id: string;
  title: string;
  content: string;
  image?: string;
  videoUrl?: string;
  graduateName: string;
  position: string;
  createdById: string;
  createdBy: Admin | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  feedback: string;
  rating: number;
  image?: string;
  videoUrl?: string;
  courseId?: string;
  course?: Course | undefined;
  academyId: string;
  academy: Academy | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  response?: string;
  respondedById?: string;
  respondedBy?: Admin | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  authorId: string;
  author: Admin | undefined;
  tags: string[];
  publishDate: Date;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Partnership {
  id: string;
  partnerName: string;
  type: string;
  description: string;
  logo?: string;
  startDate: Date;
  endDate?: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CSRProject {
  id: string;
  title: string;
  description: string;
  impact: string;
  images: string[];
  startDate: Date;
  status: string;
  assignedTeamId: string;
  assignedTeam: Admin | undefined;
  createdAt: Date;
  updatedAt: Date;
  Academy: Academy[] | undefined;
}

export interface CrisisCommunication {
  id: string;
  title: string;
  type: string;
  summary: string;
  responsePlan: string;
  handledById: string;
  handledBy: Admin | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaAlert {
  id: string;
  title: string;
  triggerDate: Date;
  sourceType: string;
  sourceId: string;
  generated: boolean;
  status: string;
  academyId: string;
  academy: Academy | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartnershipAgreement {
  id: string;
  partnerName: string;
  description: string;
  logo?: string;
  type: string;
  startDate: Date;
  endDate?: Date;
  academyId: string;
  academy: Academy | undefined;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SecretariatDashboard {
  id: string;
  totalStudents: number;
  activeCourses: number;
  todayMeetings: number;
  newNotifications: number;
  totalPayments: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TraineeManagement {
  id: string;
  userId: string;
  user: User | undefined;
  enrollmentId: string;
  enrollment: Enrollment | undefined;
  notes?: string;
  documents: File[] | undefined;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingSchedule {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  type: string;
  courseId?: string;
  course?: Course | undefined;
  location?: string;
  participants: User[] | undefined;
  notifications: Notification[] | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuickActionLink {
  id: string;
  title: string;
  description?: string;
  url: string;
  icon?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentLogBySecretary {
  id: string;
  paymentId: string;
  payment: Payment | undefined;
  secretaryId: string;
  secretary: Admin | undefined;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InternalMessage {
  id: string;
  title: string;
  content: string;
  senderId: string;
  sender: Admin | undefined;
  recipients: Admin[] | undefined;
  isRead: boolean;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SecretaryFiles {
  id: string;
  title: string;
  description?: string;
  fileId: string;
  file: File | undefined;
  category: string;
  tags: string[];
  secretaryId: string;
  secretary: Admin | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeAttendanceLog {
  id: string;
  employeeId: string;
  employee: User | undefined;
  checkIn: Date;
  checkOut?: Date;
  status: string;
  notes?: string;
  secretaryId: string;
  secretary: Admin | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactUs {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Support {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}