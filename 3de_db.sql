--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 17.0

-- Started on 2025-07-08 16:42:25 EEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 253952)
-- Name: public; Type: SCHEMA; Schema: -; Owner: default
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO "default";

--
-- TOC entry 4314 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: default
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 998 (class 1247 OID 286721)
-- Name: AccountingType; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public."AccountingType" AS ENUM (
    'EXPENSE',
    'INCOME',
    'SALARY',
    'ADVANCE',
    'INVOICE'
);


ALTER TYPE public."AccountingType" OWNER TO "default";

--
-- TOC entry 1007 (class 1247 OID 286752)
-- Name: AdminRoleType; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public."AdminRoleType" AS ENUM (
    'DIRECTOR',
    'ACCOUNTANT',
    'SECRETARY',
    'LEGAL_ADVISOR',
    'HR_MANAGER',
    'IT_MANAGER',
    'GENERAL_MANAGER',
    'ADMIN',
    'SUPER_ADMIN',
    'PUBLIC_RELATIONS'
);


ALTER TYPE public."AdminRoleType" OWNER TO "default";

--
-- TOC entry 1052 (class 1247 OID 294913)
-- Name: CourseStatus; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public."CourseStatus" AS ENUM (
    'PENDING',
    'ACTIVE',
    'COMPLETED'
);


ALTER TYPE public."CourseStatus" OWNER TO "default";

--
-- TOC entry 1061 (class 1247 OID 303124)
-- Name: ExpenseType; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public."ExpenseType" AS ENUM (
    'SALARY',
    'RENT',
    'UTILITIES',
    'MAINTENANCE',
    'MARKETING',
    'OTHER'
);


ALTER TYPE public."ExpenseType" OWNER TO "default";

--
-- TOC entry 989 (class 1247 OID 270344)
-- Name: FileType; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public."FileType" AS ENUM (
    'VIDEO',
    'PDF',
    'DOCUMENT',
    'IMAGE',
    'AUDIO'
);


ALTER TYPE public."FileType" OWNER TO "default";

--
-- TOC entry 1058 (class 1247 OID 303114)
-- Name: InstallmentStatus; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public."InstallmentStatus" AS ENUM (
    'PENDING',
    'PAID',
    'OVERDUE',
    'CANCELLED'
);


ALTER TYPE public."InstallmentStatus" OWNER TO "default";

--
-- TOC entry 1001 (class 1247 OID 286732)
-- Name: InvoiceStatus; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public."InvoiceStatus" AS ENUM (
    'PENDING',
    'PAID',
    'OVERDUE',
    'CANCELLED'
);


ALTER TYPE public."InvoiceStatus" OWNER TO "default";

--
-- TOC entry 1013 (class 1247 OID 286784)
-- Name: LegalCaseStatus; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public."LegalCaseStatus" AS ENUM (
    'OPEN',
    'IN_PROGRESS',
    'CLOSED',
    'PENDING'
);


ALTER TYPE public."LegalCaseStatus" OWNER TO "default";

--
-- TOC entry 1010 (class 1247 OID 286772)
-- Name: LegalCaseType; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public."LegalCaseType" AS ENUM (
    'CONTRACT',
    'DISPUTE',
    'INSURANCE',
    'EMPLOYMENT',
    'INTELLECTUAL_PROPERTY'
);


ALTER TYPE public."LegalCaseType" OWNER TO "default";

--
-- TOC entry 986 (class 1247 OID 270337)
-- Name: LessonStatus; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public."LessonStatus" AS ENUM (
    'IN_PROGRESS',
    'COMPLETED',
    'NOT_STARTED'
);


ALTER TYPE public."LessonStatus" OWNER TO "default";

--
-- TOC entry 929 (class 1247 OID 262145)
-- Name: LoginDevice; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public."LoginDevice" AS ENUM (
    'DESKTOP',
    'MOBILE',
    'TABLET',
    'LAPTOP'
);


ALTER TYPE public."LoginDevice" OWNER TO "default";

--
-- TOC entry 932 (class 1247 OID 262154)
-- Name: MilestoneStatus; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public."MilestoneStatus" AS ENUM (
    'IN_PROGRESS',
    'COMPLETED',
    'NOT_STARTED'
);


ALTER TYPE public."MilestoneStatus" OWNER TO "default";

--
-- TOC entry 935 (class 1247 OID 262162)
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public."NotificationType" AS ENUM (
    'ASSIGNMENT',
    'GRADE',
    'MESSAGE',
    'ACHIEVEMENT',
    'URGENT',
    'EVENT',
    'ABSENCE'
);


ALTER TYPE public."NotificationType" OWNER TO "default";

--
-- TOC entry 1004 (class 1247 OID 286742)
-- Name: PRRequestStatus; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public."PRRequestStatus" AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'RESOLVED',
    'CLOSED'
);


ALTER TYPE public."PRRequestStatus" OWNER TO "default";

--
-- TOC entry 1055 (class 1247 OID 303105)
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'CASH',
    'BANK_TRANSFER',
    'ELECTRONIC',
    'INSTALLMENT'
);


ALTER TYPE public."PaymentMethod" OWNER TO "default";

--
-- TOC entry 1148 (class 1247 OID 253954)
-- Name: UserRole; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public."UserRole" AS ENUM (
    'STUDENT',
    'INSTRUCTOR',
    'PARENT',
    'ADMIN',
    'ACADEMY'
);


ALTER TYPE public."UserRole" OWNER TO "default";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 281 (class 1259 OID 311305)
-- Name: AboutSection; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."AboutSection" (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    image text,
    type text NOT NULL,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AboutSection" OWNER TO "default";

--
-- TOC entry 217 (class 1259 OID 253981)
-- Name: Academy; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Academy" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    logo text,
    settings jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Academy" OWNER TO "default";

--
-- TOC entry 265 (class 1259 OID 286793)
-- Name: AccountingEntry; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."AccountingEntry" (
    id text NOT NULL,
    type public."AccountingType" NOT NULL,
    amount double precision NOT NULL,
    description text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "createdByAdminId" text NOT NULL,
    "academyId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AccountingEntry" OWNER TO "default";

--
-- TOC entry 226 (class 1259 OID 254056)
-- Name: Achievement; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Achievement" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    value jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isNew" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Achievement" OWNER TO "default";

--
-- TOC entry 232 (class 1259 OID 254107)
-- Name: Admin; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Admin" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Admin" OWNER TO "default";

--
-- TOC entry 274 (class 1259 OID 286869)
-- Name: AdminAssignment; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."AdminAssignment" (
    id text NOT NULL,
    "adminId" text NOT NULL,
    "roleId" text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AdminAssignment" OWNER TO "default";

--
-- TOC entry 273 (class 1259 OID 286861)
-- Name: AdminRole; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."AdminRole" (
    id text NOT NULL,
    name public."AdminRoleType" NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "adminId" text NOT NULL
);


ALTER TABLE public."AdminRole" OWNER TO "default";

--
-- TOC entry 237 (class 1259 OID 254147)
-- Name: Attendance; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Attendance" (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "lessonId" text NOT NULL,
    status text NOT NULL,
    method text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Attendance" OWNER TO "default";

--
-- TOC entry 252 (class 1259 OID 262253)
-- Name: Badge; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Badge" (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    description text,
    image text,
    points integer NOT NULL,
    type text NOT NULL,
    "earnedAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Badge" OWNER TO "default";

--
-- TOC entry 287 (class 1259 OID 311354)
-- Name: BlogPost; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."BlogPost" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    "coverImage" text,
    "authorId" text NOT NULL,
    tags text[],
    "publishDate" timestamp(3) without time zone NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."BlogPost" OWNER TO "default";

--
-- TOC entry 235 (class 1259 OID 254131)
-- Name: Bookmark; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Bookmark" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    "itemId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Bookmark" OWNER TO "default";

--
-- TOC entry 279 (class 1259 OID 303156)
-- Name: Branch; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Branch" (
    id text NOT NULL,
    name text NOT NULL,
    address text,
    phone text,
    email text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Branch" OWNER TO "default";

--
-- TOC entry 280 (class 1259 OID 303164)
-- Name: BranchFinance; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."BranchFinance" (
    id text NOT NULL,
    "branchId" text NOT NULL,
    "totalIncome" double precision DEFAULT 0 NOT NULL,
    "totalExpenses" double precision DEFAULT 0 NOT NULL,
    balance double precision DEFAULT 0 NOT NULL,
    "lastUpdated" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."BranchFinance" OWNER TO "default";

--
-- TOC entry 289 (class 1259 OID 311371)
-- Name: CSRProject; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."CSRProject" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    impact text NOT NULL,
    images text[],
    "startDate" timestamp(3) without time zone NOT NULL,
    status text NOT NULL,
    "assignedTeamId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CSRProject" OWNER TO "default";

--
-- TOC entry 253 (class 1259 OID 262261)
-- Name: Certificate; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Certificate" (
    id text NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    phone text NOT NULL,
    notes text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    description text,
    url text,
    image text,
    points integer NOT NULL,
    type text NOT NULL,
    "earnedAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Certificate" OWNER TO "default";

--
-- TOC entry 233 (class 1259 OID 254115)
-- Name: Channel; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Channel" (
    id text NOT NULL,
    name text NOT NULL,
    "ownerId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "adminRoleId" text,
    "legalCaseId" text,
    "meetingId" text,
    "prRecordId" text
);


ALTER TABLE public."Channel" OWNER TO "default";

--
-- TOC entry 230 (class 1259 OID 254091)
-- Name: Comment; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Comment" (
    id text NOT NULL,
    "postId" text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Comment" OWNER TO "default";

--
-- TOC entry 254 (class 1259 OID 262269)
-- Name: Community; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Community" (
    id text NOT NULL,
    name text NOT NULL,
    image text,
    description text,
    type text NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    dislikes integer DEFAULT 0 NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Community" OWNER TO "default";

--
-- TOC entry 285 (class 1259 OID 311337)
-- Name: ContactMessage; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."ContactMessage" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    message text NOT NULL,
    status text NOT NULL,
    response text,
    "respondedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ContactMessage" OWNER TO "default";

--
-- TOC entry 219 (class 1259 OID 253996)
-- Name: Course; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Course" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "academyId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    image text,
    level text NOT NULL,
    status public."CourseStatus" DEFAULT 'PENDING'::public."CourseStatus" NOT NULL,
    "startDate" timestamp(3) without time zone
);


ALTER TABLE public."Course" OWNER TO "default";

--
-- TOC entry 290 (class 1259 OID 311379)
-- Name: CrisisCommunication; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."CrisisCommunication" (
    id text NOT NULL,
    title text NOT NULL,
    type text NOT NULL,
    summary text NOT NULL,
    "responsePlan" text NOT NULL,
    "handledById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CrisisCommunication" OWNER TO "default";

--
-- TOC entry 255 (class 1259 OID 262280)
-- Name: Discussion; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Discussion" (
    id text NOT NULL,
    "communityId" text NOT NULL,
    "postId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Discussion" OWNER TO "default";

--
-- TOC entry 300 (class 1259 OID 311471)
-- Name: EmployeeAttendanceLog; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."EmployeeAttendanceLog" (
    id text NOT NULL,
    "employeeId" text NOT NULL,
    "checkIn" timestamp(3) without time zone NOT NULL,
    "checkOut" timestamp(3) without time zone,
    status text DEFAULT 'PRESENT'::text NOT NULL,
    notes text,
    "secretaryId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."EmployeeAttendanceLog" OWNER TO "default";

--
-- TOC entry 222 (class 1259 OID 254020)
-- Name: Enrollment; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Enrollment" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    progress double precision DEFAULT 0 NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Enrollment" OWNER TO "default";

--
-- TOC entry 236 (class 1259 OID 254139)
-- Name: Event; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Event" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "startTime" timestamp(3) without time zone NOT NULL,
    "endTime" timestamp(3) without time zone NOT NULL,
    "academyId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "adminRoleId" text,
    "legalCaseId" text,
    "prRecordId" text
);


ALTER TABLE public."Event" OWNER TO "default";

--
-- TOC entry 278 (class 1259 OID 303147)
-- Name: Expense; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Expense" (
    id text NOT NULL,
    type public."ExpenseType" NOT NULL,
    amount double precision NOT NULL,
    description text,
    "paidAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "branchId" text NOT NULL,
    "createdBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Expense" OWNER TO "default";

--
-- TOC entry 286 (class 1259 OID 311345)
-- Name: FAQ; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."FAQ" (
    id text NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    category text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."FAQ" OWNER TO "default";

--
-- TOC entry 221 (class 1259 OID 254012)
-- Name: File; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."File" (
    id text NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    "lessonId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    type public."FileType" NOT NULL,
    "accountingEntryId" text,
    "adminRoleId" text,
    "legalCaseId" text,
    "meetingId" text,
    "prRecordId" text
);


ALTER TABLE public."File" OWNER TO "default";

--
-- TOC entry 231 (class 1259 OID 254099)
-- Name: Group; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Group" (
    id text NOT NULL,
    name text NOT NULL,
    "adminId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    image text,
    subject text NOT NULL
);


ALTER TABLE public."Group" OWNER TO "default";

--
-- TOC entry 277 (class 1259 OID 303138)
-- Name: Installment; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Installment" (
    id text NOT NULL,
    "userId" text NOT NULL,
    amount double precision NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    status public."InstallmentStatus" DEFAULT 'PENDING'::public."InstallmentStatus" NOT NULL,
    "paymentId" text,
    "branchId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Installment" OWNER TO "default";

--
-- TOC entry 218 (class 1259 OID 253989)
-- Name: Instructor; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Instructor" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "academyId" text,
    title text
);


ALTER TABLE public."Instructor" OWNER TO "default";

--
-- TOC entry 298 (class 1259 OID 311453)
-- Name: InternalMessage; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."InternalMessage" (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "senderId" text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    priority text DEFAULT 'NORMAL'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."InternalMessage" OWNER TO "default";

--
-- TOC entry 266 (class 1259 OID 286801)
-- Name: Invoice; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Invoice" (
    id text NOT NULL,
    "invoiceNumber" text NOT NULL,
    amount double precision NOT NULL,
    description text NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    status public."InvoiceStatus" DEFAULT 'PENDING'::public."InvoiceStatus" NOT NULL,
    "accountingEntryId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Invoice" OWNER TO "default";

--
-- TOC entry 275 (class 1259 OID 286878)
-- Name: LegalCase; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."LegalCase" (
    id text NOT NULL,
    "caseTitle" text NOT NULL,
    "caseType" public."LegalCaseType" NOT NULL,
    status public."LegalCaseStatus" DEFAULT 'OPEN'::public."LegalCaseStatus" NOT NULL,
    description text NOT NULL,
    "courtDate" timestamp(3) without time zone,
    "assignedLawyerId" text NOT NULL,
    "academyId" text NOT NULL,
    "relatedUserId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LegalCase" OWNER TO "default";

--
-- TOC entry 220 (class 1259 OID 254004)
-- Name: Lesson; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Lesson" (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "courseId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    status public."LessonStatus" DEFAULT 'NOT_STARTED'::public."LessonStatus" NOT NULL
);


ALTER TABLE public."Lesson" OWNER TO "default";

--
-- TOC entry 256 (class 1259 OID 262288)
-- Name: LiveRoom; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."LiveRoom" (
    id text NOT NULL,
    title text NOT NULL,
    topic text,
    participants integer DEFAULT 0 NOT NULL,
    "isLive" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    "isPublic" boolean DEFAULT false NOT NULL,
    "isPrivate" boolean DEFAULT false NOT NULL,
    "isPasswordProtected" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "communityId" text NOT NULL,
    "courseId" text
);


ALTER TABLE public."LiveRoom" OWNER TO "default";

--
-- TOC entry 247 (class 1259 OID 262195)
-- Name: LoginHistory; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."LoginHistory" (
    id text NOT NULL,
    "userId" text NOT NULL,
    success boolean DEFAULT false NOT NULL,
    ip text,
    device public."LoginDevice",
    location text,
    browser text,
    os text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."LoginHistory" OWNER TO "default";

--
-- TOC entry 291 (class 1259 OID 311387)
-- Name: MediaAlert; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."MediaAlert" (
    id text NOT NULL,
    title text NOT NULL,
    "triggerDate" timestamp(3) without time zone NOT NULL,
    "sourceType" text NOT NULL,
    "sourceId" text NOT NULL,
    generated boolean DEFAULT false NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "academyId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MediaAlert" OWNER TO "default";

--
-- TOC entry 270 (class 1259 OID 286835)
-- Name: Meeting; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Meeting" (
    id text NOT NULL,
    "meetingTitle" text NOT NULL,
    "meetingDate" timestamp(3) without time zone NOT NULL,
    location text NOT NULL,
    notes text,
    "createdByAdminId" text NOT NULL,
    "academyId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Meeting" OWNER TO "default";

--
-- TOC entry 271 (class 1259 OID 286843)
-- Name: MeetingParticipant; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."MeetingParticipant" (
    id text NOT NULL,
    "meetingId" text NOT NULL,
    "userId" text NOT NULL,
    "isAttended" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MeetingParticipant" OWNER TO "default";

--
-- TOC entry 228 (class 1259 OID 254073)
-- Name: Message; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    "senderId" text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Message" OWNER TO "default";

--
-- TOC entry 250 (class 1259 OID 262229)
-- Name: Milestone; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Milestone" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    status public."MilestoneStatus" DEFAULT 'IN_PROGRESS'::public."MilestoneStatus" NOT NULL,
    "pathId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Milestone" OWNER TO "default";

--
-- TOC entry 282 (class 1259 OID 311313)
-- Name: NewsEvent; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."NewsEvent" (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    type text NOT NULL,
    image text,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."NewsEvent" OWNER TO "default";

--
-- TOC entry 227 (class 1259 OID 254064)
-- Name: Notification; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    "userId" text NOT NULL,
    message text NOT NULL,
    title text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actionUrl" text,
    "isImportant" boolean DEFAULT false NOT NULL,
    urgent boolean DEFAULT false NOT NULL,
    type public."NotificationType" DEFAULT 'MESSAGE'::public."NotificationType" NOT NULL,
    "trainingScheduleId" text
);


ALTER TABLE public."Notification" OWNER TO "default";

--
-- TOC entry 251 (class 1259 OID 262238)
-- Name: NotificationSettings; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."NotificationSettings" (
    id text NOT NULL,
    "userId" text NOT NULL,
    assignments boolean DEFAULT true NOT NULL,
    grades boolean DEFAULT true NOT NULL,
    messages boolean DEFAULT true NOT NULL,
    achievements boolean DEFAULT true NOT NULL,
    urgent boolean DEFAULT true NOT NULL,
    email boolean DEFAULT true NOT NULL,
    push boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."NotificationSettings" OWNER TO "default";

--
-- TOC entry 264 (class 1259 OID 270365)
-- Name: Option; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Option" (
    id text NOT NULL,
    "questionId" text NOT NULL,
    text text NOT NULL,
    "isCorrect" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Option" OWNER TO "default";

--
-- TOC entry 234 (class 1259 OID 254123)
-- Name: Owner; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Owner" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Owner" OWNER TO "default";

--
-- TOC entry 269 (class 1259 OID 286827)
-- Name: PRResponse; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."PRResponse" (
    id text NOT NULL,
    response text NOT NULL,
    "prRecordId" text NOT NULL,
    "respondedByAdminId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PRResponse" OWNER TO "default";

--
-- TOC entry 288 (class 1259 OID 311363)
-- Name: Partnership; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Partnership" (
    id text NOT NULL,
    "partnerName" text NOT NULL,
    type text NOT NULL,
    description text NOT NULL,
    logo text,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone,
    status text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Partnership" OWNER TO "default";

--
-- TOC entry 292 (class 1259 OID 311397)
-- Name: PartnershipAgreement; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."PartnershipAgreement" (
    id text NOT NULL,
    "partnerName" text NOT NULL,
    description text NOT NULL,
    logo text,
    type text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone,
    "academyId" text NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PartnershipAgreement" OWNER TO "default";

--
-- TOC entry 249 (class 1259 OID 262215)
-- Name: Path; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Path" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    level text NOT NULL,
    "completedTasks" integer DEFAULT 0 NOT NULL,
    "remainingTime" integer DEFAULT 0 NOT NULL,
    "studyTime" integer DEFAULT 0 NOT NULL,
    "totalTasks" integer DEFAULT 0 NOT NULL,
    progress double precision DEFAULT 0 NOT NULL,
    engagement double precision DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Path" OWNER TO "default";

--
-- TOC entry 238 (class 1259 OID 254155)
-- Name: Payment; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    "userId" text NOT NULL,
    amount double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "legalCaseId" text,
    "branchId" text NOT NULL,
    method public."PaymentMethod" NOT NULL,
    "paidAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Payment" OWNER TO "default";

--
-- TOC entry 297 (class 1259 OID 311445)
-- Name: PaymentLogBySecretary; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."PaymentLogBySecretary" (
    id text NOT NULL,
    "paymentId" text NOT NULL,
    "secretaryId" text NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PaymentLogBySecretary" OWNER TO "default";

--
-- TOC entry 272 (class 1259 OID 286852)
-- Name: Permission; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Permission" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Permission" OWNER TO "default";

--
-- TOC entry 229 (class 1259 OID 254082)
-- Name: Post; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Post" (
    id text NOT NULL,
    "authorId" text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "likesCount" integer DEFAULT 0 NOT NULL,
    title text NOT NULL,
    "publicRelationsRecordId" text
);


ALTER TABLE public."Post" OWNER TO "default";

--
-- TOC entry 216 (class 1259 OID 253974)
-- Name: Profile; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Profile" (
    id text NOT NULL,
    "userId" text NOT NULL,
    bio text,
    phone text,
    address text,
    preferences jsonb
);


ALTER TABLE public."Profile" OWNER TO "default";

--
-- TOC entry 268 (class 1259 OID 286818)
-- Name: PublicRelationsRecord; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."PublicRelationsRecord" (
    id text NOT NULL,
    message text NOT NULL,
    "senderName" text NOT NULL,
    "senderContact" text NOT NULL,
    status public."PRRequestStatus" DEFAULT 'PENDING'::public."PRRequestStatus" NOT NULL,
    "handledByAdminId" text NOT NULL,
    "academyId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PublicRelationsRecord" OWNER TO "default";

--
-- TOC entry 224 (class 1259 OID 254038)
-- Name: Question; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Question" (
    id text NOT NULL,
    text text NOT NULL,
    type text NOT NULL,
    points integer NOT NULL,
    "isAnswered" boolean DEFAULT false NOT NULL,
    "quizId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isMultiple" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Question" OWNER TO "default";

--
-- TOC entry 296 (class 1259 OID 311436)
-- Name: QuickActionLink; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."QuickActionLink" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    url text NOT NULL,
    icon text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."QuickActionLink" OWNER TO "default";

--
-- TOC entry 223 (class 1259 OID 254030)
-- Name: Quiz; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Quiz" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "lessonId" text NOT NULL,
    "timeLimit" integer,
    "passingScore" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isCompleted" boolean DEFAULT false NOT NULL,
    "upComing" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Quiz" OWNER TO "default";

--
-- TOC entry 239 (class 1259 OID 254163)
-- Name: Report; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Report" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "accountingEntryId" text,
    "adminRoleId" text,
    "legalCaseId" text,
    "meetingId" text
);


ALTER TABLE public."Report" OWNER TO "default";

--
-- TOC entry 267 (class 1259 OID 286810)
-- Name: SalaryPayment; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."SalaryPayment" (
    id text NOT NULL,
    "employeeId" text NOT NULL,
    amount double precision NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    "accountingEntryId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SalaryPayment" OWNER TO "default";

--
-- TOC entry 293 (class 1259 OID 311406)
-- Name: SecretariatDashboard; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."SecretariatDashboard" (
    id text NOT NULL,
    "totalStudents" integer DEFAULT 0 NOT NULL,
    "activeCourses" integer DEFAULT 0 NOT NULL,
    "todayMeetings" integer DEFAULT 0 NOT NULL,
    "newNotifications" integer DEFAULT 0 NOT NULL,
    "totalPayments" double precision DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SecretariatDashboard" OWNER TO "default";

--
-- TOC entry 299 (class 1259 OID 311463)
-- Name: SecretaryFiles; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."SecretaryFiles" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "fileId" text NOT NULL,
    category text NOT NULL,
    tags text[],
    "secretaryId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SecretaryFiles" OWNER TO "default";

--
-- TOC entry 225 (class 1259 OID 254047)
-- Name: Submission; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Submission" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "quizId" text NOT NULL,
    score double precision,
    feedback text,
    passed boolean DEFAULT false,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    answers jsonb[]
);


ALTER TABLE public."Submission" OWNER TO "default";

--
-- TOC entry 283 (class 1259 OID 311321)
-- Name: SuccessStory; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."SuccessStory" (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    image text,
    "videoUrl" text,
    "graduateName" text NOT NULL,
    "position" text NOT NULL,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SuccessStory" OWNER TO "default";

--
-- TOC entry 284 (class 1259 OID 311329)
-- Name: Testimonial; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Testimonial" (
    id text NOT NULL,
    name text NOT NULL,
    feedback text NOT NULL,
    rating integer NOT NULL,
    image text,
    "videoUrl" text,
    "courseId" text,
    "academyId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Testimonial" OWNER TO "default";

--
-- TOC entry 294 (class 1259 OID 311419)
-- Name: TraineeManagement; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."TraineeManagement" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "enrollmentId" text NOT NULL,
    notes text,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TraineeManagement" OWNER TO "default";

--
-- TOC entry 295 (class 1259 OID 311428)
-- Name: TrainingSchedule; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."TrainingSchedule" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "startTime" timestamp(3) without time zone NOT NULL,
    "endTime" timestamp(3) without time zone NOT NULL,
    type text NOT NULL,
    "courseId" text,
    location text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TrainingSchedule" OWNER TO "default";

--
-- TOC entry 248 (class 1259 OID 262204)
-- Name: TwoFactor; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."TwoFactor" (
    id text NOT NULL,
    "userId" text NOT NULL,
    email boolean DEFAULT false NOT NULL,
    sms boolean DEFAULT false NOT NULL,
    authenticator boolean DEFAULT false NOT NULL,
    secret text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TwoFactor" OWNER TO "default";

--
-- TOC entry 215 (class 1259 OID 253965)
-- Name: User; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    role public."UserRole" DEFAULT 'STUDENT'::public."UserRole" NOT NULL,
    "subRole" text,
    avatar text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "academyId" text,
    phone text,
    age integer,
    "isOnline" boolean DEFAULT false NOT NULL,
    "isVerified" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."User" OWNER TO "default";

--
-- TOC entry 263 (class 1259 OID 270357)
-- Name: UserAcademyCEO; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."UserAcademyCEO" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "academyId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."UserAcademyCEO" OWNER TO "default";

--
-- TOC entry 301 (class 1259 OID 311480)
-- Name: _AcademyToCSRProject; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."_AcademyToCSRProject" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_AcademyToCSRProject" OWNER TO "default";

--
-- TOC entry 276 (class 1259 OID 286887)
-- Name: _AdminRoleToPermission; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."_AdminRoleToPermission" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_AdminRoleToPermission" OWNER TO "default";

--
-- TOC entry 246 (class 1259 OID 254201)
-- Name: _ChannelToMessage; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."_ChannelToMessage" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ChannelToMessage" OWNER TO "default";

--
-- TOC entry 245 (class 1259 OID 254196)
-- Name: _ChannelToUser; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."_ChannelToUser" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ChannelToUser" OWNER TO "default";

--
-- TOC entry 259 (class 1259 OID 262316)
-- Name: _CommunityToGroup; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."_CommunityToGroup" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_CommunityToGroup" OWNER TO "default";

--
-- TOC entry 261 (class 1259 OID 262330)
-- Name: _CommunityToPost; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."_CommunityToPost" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_CommunityToPost" OWNER TO "default";

--
-- TOC entry 260 (class 1259 OID 262323)
-- Name: _CommunityToUser; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."_CommunityToUser" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_CommunityToUser" OWNER TO "default";

--
-- TOC entry 241 (class 1259 OID 254176)
-- Name: _CourseToInstructor; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."_CourseToInstructor" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_CourseToInstructor" OWNER TO "default";

--
-- TOC entry 257 (class 1259 OID 262302)
-- Name: _CourseToPath; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."_CourseToPath" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_CourseToPath" OWNER TO "default";

--
-- TOC entry 240 (class 1259 OID 254171)
-- Name: _CourseToQuiz; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."_CourseToQuiz" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_CourseToQuiz" OWNER TO "default";

--
-- TOC entry 302 (class 1259 OID 311487)
-- Name: _FileToTraineeManagement; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."_FileToTraineeManagement" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_FileToTraineeManagement" OWNER TO "default";

--
-- TOC entry 244 (class 1259 OID 254191)
-- Name: _GroupToPost; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."_GroupToPost" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_GroupToPost" OWNER TO "default";

--
-- TOC entry 243 (class 1259 OID 254186)
-- Name: _GroupToUser; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."_GroupToUser" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_GroupToUser" OWNER TO "default";

--
-- TOC entry 242 (class 1259 OID 254181)
-- Name: _LessonToUser; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."_LessonToUser" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_LessonToUser" OWNER TO "default";

--
-- TOC entry 262 (class 1259 OID 262337)
-- Name: _LiveRoomToUser; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."_LiveRoomToUser" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_LiveRoomToUser" OWNER TO "default";

--
-- TOC entry 258 (class 1259 OID 262309)
-- Name: _PathToUser; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."_PathToUser" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_PathToUser" OWNER TO "default";

--
-- TOC entry 303 (class 1259 OID 311494)
-- Name: _ReceivedMessages; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."_ReceivedMessages" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ReceivedMessages" OWNER TO "default";

--
-- TOC entry 304 (class 1259 OID 311501)
-- Name: _TrainingScheduleToUser; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."_TrainingScheduleToUser" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_TrainingScheduleToUser" OWNER TO "default";

--
-- TOC entry 4285 (class 0 OID 311305)
-- Dependencies: 281
-- Data for Name: AboutSection; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."AboutSection" (id, title, content, image, type, "createdById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4221 (class 0 OID 253981)
-- Dependencies: 217
-- Data for Name: Academy; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Academy" (id, name, description, logo, settings, "createdAt", "updatedAt") FROM stdin;
cmba78tei0000rilcw84qjgku	IAFCE	الاكاديميه الدوليه للتعليم المستمر	/assets/images/logo.png	{"additionalProp1": {}}	2025-05-30 02:44:06.235	2025-05-30 02:44:06.235
cmbfsz5bs0000u118qvjsdh66	acad1	strinasdfghjdfvgyubuubug	string	{"additionalProp1": {}}	2025-06-03 00:50:57.403	2025-06-03 00:50:57.403
cmbft09s00001u11897h6yvmj	acad2	strinasdfghjdfvgyubuubuaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaag	string	{"additionalProp1": {}}	2025-06-03 00:50:57.403	2025-06-03 00:50:57.403
cmbft0ixp0002u118vkmdv3v3	acad3	strinasdfghjdfvgyubuubuaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaag	string	{"additionalProp1": {}}	2025-06-03 00:50:57.403	2025-06-03 00:50:57.403
\.


--
-- TOC entry 4269 (class 0 OID 286793)
-- Dependencies: 265
-- Data for Name: AccountingEntry; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."AccountingEntry" (id, type, amount, description, date, "createdByAdminId", "academyId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4230 (class 0 OID 254056)
-- Dependencies: 226
-- Data for Name: Achievement; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Achievement" (id, "userId", type, value, "createdAt", "isNew") FROM stdin;
cmbh75mxe0003ricn19gtcrbe	cmaze2ums0000xdg7kzowkqdx	string	{"additionalProp1": {}}	2025-06-04 00:16:00.947	t
\.


--
-- TOC entry 4236 (class 0 OID 254107)
-- Dependencies: 232
-- Data for Name: Admin; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Admin" (id, "userId", "createdAt") FROM stdin;
cmbf2iomq0001riz3udv4nc4h	cmbf1qudu0002rit22vzicy3z	2025-06-02 12:30:39.41
\.


--
-- TOC entry 4278 (class 0 OID 286869)
-- Dependencies: 274
-- Data for Name: AdminAssignment; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."AdminAssignment" (id, "adminId", "roleId", "startDate", "endDate", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4277 (class 0 OID 286861)
-- Dependencies: 273
-- Data for Name: AdminRole; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."AdminRole" (id, name, description, "createdAt", "updatedAt", "adminId") FROM stdin;
cmbf2n02e0000ri8i4p2h6668	ACCOUNTANT	مسموح له بكل الصلاحيات	2025-06-02 12:34:00.854	2025-06-11 22:24:06.309	cmbf2iomq0001riz3udv4nc4h
\.


--
-- TOC entry 4241 (class 0 OID 254147)
-- Dependencies: 237
-- Data for Name: Attendance; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Attendance" (id, "studentId", "lessonId", status, method, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4256 (class 0 OID 262253)
-- Dependencies: 252
-- Data for Name: Badge; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Badge" (id, "userId", title, description, image, points, type, "earnedAt", "createdAt") FROM stdin;
\.


--
-- TOC entry 4291 (class 0 OID 311354)
-- Dependencies: 287
-- Data for Name: BlogPost; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."BlogPost" (id, title, slug, content, "coverImage", "authorId", tags, "publishDate", "isPublished", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4239 (class 0 OID 254131)
-- Dependencies: 235
-- Data for Name: Bookmark; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Bookmark" (id, "userId", type, "itemId", "createdAt") FROM stdin;
\.


--
-- TOC entry 4283 (class 0 OID 303156)
-- Dependencies: 279
-- Data for Name: Branch; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Branch" (id, name, address, phone, email, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4284 (class 0 OID 303164)
-- Dependencies: 280
-- Data for Name: BranchFinance; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."BranchFinance" (id, "branchId", "totalIncome", "totalExpenses", balance, "lastUpdated", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4293 (class 0 OID 311371)
-- Dependencies: 289
-- Data for Name: CSRProject; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."CSRProject" (id, title, description, impact, images, "startDate", status, "assignedTeamId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4257 (class 0 OID 262261)
-- Dependencies: 253
-- Data for Name: Certificate; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Certificate" (id, name, address, phone, notes, "userId", title, description, url, image, points, type, "earnedAt", "createdAt") FROM stdin;
cmcje04270001rihlcwp628lx	أحمد محمد علي	القاهرة، مصر	01012345678	تم اجتياز الدورة بتقدير ممتاز	cmchn3fcm0000riuljxan8fmt	شهادة إتمام دورة الفيزياء للثانوية العامة	تُمنح هذه الشهادة للطالِب أحمد محمد علي بعد إتمامه دورة الفيزياء بنجاح والتي استمرت لمدة 8 أسابيع وتضمنت مفاهيم الحركة، الكهرباء، والضوء.	https://example.com/certificates/ahmed-physics-2025	https://example.com/certificates/images/ahmed-physics-cert.png	120	أكاديمية	2025-06-30 16:58:37.731	2025-06-30 16:58:37.731
cmcjeg7pj0001ri9spccry94i	أحمد محمد علي	القاهرة، مصر	01012345678	تم اجتياز الدورة بتقدير ممتاز	cmchn3fcm0000riuljxan8fmt	شهادة إتمام دورة الفيزياء للثانوية العامة	تُمنح هذه الشهادة للطالِب أحمد محمد علي بعد إتمامه دورة الفيزياء بنجاح والتي استمرت لمدة 8 أسابيع وتضمنت مفاهيم الحركة، الكهرباء، والضوء.	https://example.com/certificates/ahmed-physics-2025	https://example.com/certificates/images/ahmed-physics-cert.png	120	أكاديمية	2025-06-30 16:58:37.731	2025-06-30 16:58:37.731
cmcjem76m0001rip8qrx9ha89	أحمد محمد علي	القاهرة، مصر	01012345678	تم اجتياز الدورة بتقدير ممتاز	cmchn3fcm0000riuljxan8fmt	شهادة إتمام دورة الفيزياء للثانوية العامة	تُمنح هذه الشهادة للطالِب أحمد محمد علي بعد إتمامه دورة الفيزياء بنجاح والتي استمرت لمدة 8 أسابيع وتضمنت مفاهيم الحركة، الكهرباء، والضوء.	/certificates/file/cmcjem76m0001rip8qrx9ha89	https://example.com/certificates/images/ahmed-physics-cert.png	120	أكاديمية	2025-06-30 16:58:37.731	2025-06-30 16:58:37.731
cmckd5twg0001riciuv2d29mg	أحمد محمد علي	القاهرة، مصر	01012345678	تم اجتياز الدورة بتقدير ممتاز	cmchn3fcm0000riuljxan8fmt	شهادة إتمام دورة الفيزياء للثانوية العامة	تُمنح هذه الشهادة للطالِب أحمد محمد علي بعد إتمامه دورة الفيزياء بنجاح والتي استمرت لمدة 8 أسابيع وتضمنت مفاهيم الحركة، الكهرباء، والضوء.	/certificates/file/cmckd5twg0001riciuv2d29mg	https://example.com/certificates/images/ahmed-physics-cert.png	120	أكاديمية	2025-06-30 16:58:37.731	2025-06-30 16:58:37.731
cmckda8oc0001rijlwx7up33l	أحمد محمد علي	القاهرة، مصر	01012345678	تم اجتياز الدورة بتقدير ممتاز	cmchn3fcm0000riuljxan8fmt	شهادة إتمام دورة الفيزياء للثانوية العامة	تُمنح هذه الشهادة للطالِب أحمد محمد علي بعد إتمامه دورة الفيزياء بنجاح والتي استمرت لمدة 8 أسابيع وتضمنت مفاهيم الحركة، الكهرباء، والضوء.	/certificates/file/cmckda8oc0001rijlwx7up33l	https://example.com/certificates/images/ahmed-physics-cert.png	120	أكاديمية	2025-06-30 16:58:37.731	2025-06-30 16:58:37.731
cmckdjful0001riw8m9ywo1ht	أحمد محمد علي	القاهرة، مصر	01012345678	تم اجتياز الدورة بتقدير ممتاز	cmchn3fcm0000riuljxan8fmt	شهادة إتمام دورة الفيزياء للثانوية العامة	تُمنح هذه الشهادة للطالِب أحمد محمد علي بعد إتمامه دورة الفيزياء بنجاح والتي استمرت لمدة 8 أسابيع وتضمنت مفاهيم الحركة، الكهرباء، والضوء.	/certificates/file/cmckdjful0001riw8m9ywo1ht	https://example.com/certificates/images/ahmed-physics-cert.png	120	أكاديمية	2025-06-30 16:58:37.731	2025-06-30 16:58:37.731
cmckdpr7w0001ri79zh4agoel	أحمد محمد علي	القاهرة، مصر	01012345678	تم اجتياز الدورة بتقدير ممتاز	cmchn3fcm0000riuljxan8fmt	شهادة إتمام دورة الفيزياء للثانوية العامة	تُمنح هذه الشهادة للطالِب أحمد محمد علي بعد إتمامه دورة الفيزياء بنجاح والتي استمرت لمدة 8 أسابيع وتضمنت مفاهيم الحركة، الكهرباء، والضوء.	/certificates/file/cmckdpr7w0001ri79zh4agoel	https://example.com/certificates/images/ahmed-physics-cert.png	120	أكاديمية	2025-06-30 16:58:37.731	2025-06-30 16:58:37.731
cmckhp1u10001rif4f1e17hw9	أحمد محمد علي	القاهرة، مصر	01012345678	تم اجتياز الدورة بتقدير ممتاز	cmchn3fcm0000riuljxan8fmt	شهادة إتمام دورة الفيزياء للثانوية العامة	تُمنح هذه الشهادة للطالِب أحمد محمد علي بعد إتمامه دورة الفيزياء بنجاح والتي استمرت لمدة 8 أسابيع وتضمنت مفاهيم الحركة، الكهرباء، والضوء.	https://example.com/certificates/ahmed-physics-2025	https://example.com/certificates/images/ahmed-physics-cert.png	120	أكاديمية	2025-06-30 16:58:37.731	2025-06-30 16:58:37.731
cmckhq4760001rigf24cnh9ap	أحمد محمد علي	القاهرة، مصر	01012345678	تم اجتياز الدورة بتقدير ممتاز	cmchn3fcm0000riuljxan8fmt	شهادة إتمام دورة الفيزياء للثانوية العامة	تُمنح هذه الشهادة للطالِب أحمد محمد علي بعد إتمامه دورة الفيزياء بنجاح والتي استمرت لمدة 8 أسابيع وتضمنت مفاهيم الحركة، الكهرباء، والضوء.	https://example.com/certificates/ahmed-physics-2025	https://example.com/certificates/images/ahmed-physics-cert.png	120	أكاديمية	2025-06-30 16:58:37.731	2025-06-30 16:58:37.731
cmckhs8xi0001rilqer9zac2z	أحمد محمد علي	القاهرة، مصر	01012345678	تم اجتياز الدورة بتقدير ممتاز	cmchn3fcm0000riuljxan8fmt	شهادة إتمام دورة الفيزياء للثانوية العامة	تُمنح هذه الشهادة للطالِب أحمد محمد علي بعد إتمامه دورة الفيزياء بنجاح والتي استمرت لمدة 8 أسابيع وتضمنت مفاهيم الحركة، الكهرباء، والضوء.	/certificates/file/cmckhs8xi0001rilqer9zac2z	https://example.com/certificates/images/ahmed-physics-cert.png	120	أكاديمية	2025-06-30 16:58:37.731	2025-06-30 16:58:37.731
\.


--
-- TOC entry 4237 (class 0 OID 254115)
-- Dependencies: 233
-- Data for Name: Channel; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Channel" (id, name, "ownerId", "createdAt", "adminRoleId", "legalCaseId", "meetingId", "prRecordId") FROM stdin;
\.


--
-- TOC entry 4234 (class 0 OID 254091)
-- Dependencies: 230
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Comment" (id, "postId", content, "createdAt") FROM stdin;
\.


--
-- TOC entry 4258 (class 0 OID 262269)
-- Dependencies: 254
-- Data for Name: Community; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Community" (id, name, image, description, type, likes, dislikes, views, "createdAt", "updatedAt") FROM stdin;
cmcja246h0000riea8ttds8n9	مجتمع طلاب ومدرسي الثانوية العامة	https://example.com/highschool-community-banner.jpg	مساحة مخصصة لطلاب ومدرسي المرحلة الثانوية لتبادل المعرفة، مناقشة الدروس، التحضير للامتحانات، ومشاركة الموارد التعليمية.	ثانوية	1240	15	9285	2025-06-30 15:48:25.812	2025-06-30 15:48:25.812
\.


--
-- TOC entry 4289 (class 0 OID 311337)
-- Dependencies: 285
-- Data for Name: ContactMessage; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."ContactMessage" (id, name, email, phone, message, status, response, "respondedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4223 (class 0 OID 253996)
-- Dependencies: 219
-- Data for Name: Course; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Course" (id, title, description, "academyId", "createdAt", "updatedAt", image, level, status, "startDate") FROM stdin;
cmcnpad2b0000rietddm3g1wc	كمياء	كمياء اولي 	\N	2025-07-03 18:09:53.886	2025-07-03 18:09:53.886		مبتدئ	PENDING	\N
cmcnpg1z70001rietrealufh1	كمياء اولي ثانوي	كمياء اولي ثانوي 	\N	2025-07-03 18:14:18.534	2025-07-03 18:44:37.185	https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj1uvBOZZa28lAJR4IjPyCAeVclTGe8DDQRwHHPjesS1a_G-JeKS4YPgVODCQ00aHVQCAx_xYDjNrUYFGUWKWKl_EjWgsvpScWaOHGr9e4VvPfiNbC7VDVrS1rt3K_eFF7ri1fwpcw-U-zDZYQIm69GTRjlguGe31OMzjZyPPNvnXFvXHydf87oZv1D6vA/s399/%D9%83%D8%AA%D8%A7%D8%A8%20%D8%A7%D9%84%D8%A7%D9%85%D8%AA%D8%AD%D8%A7%D9%86%20%D9%83%D9%8A%D9%85%D9%8A%D8%A7%D8%A1%20%D9%84%D9%84%D8%B5%D9%81%20%D8%A7%D9%84%D8%A3%D9%88%D9%84%20%D8%A7%D9%84%D8%AB%D8%A7%D9%86%D9%88%D9%8A%20%D8%A7%D9%84%D8%AA%D8%B1%D9%85%20%D8%A7%D9%84%D8%A3%D9%88%D9%84%202025.webp	مبتدئ	PENDING	2025-07-09 21:00:00
cmcnpl2jt0002riet5iufm9y1	كمياء	كمياء	\N	2025-07-03 18:18:13.52	2025-07-03 18:47:35.384	https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj1uvBOZZa28lAJR4IjPyCAeVclTGe8DDQRwHHPjesS1a_G-JeKS4YPgVODCQ00aHVQCAx_xYDjNrUYFGUWKWKl_EjWgsvpScWaOHGr9e4VvPfiNbC7VDVrS1rt3K_eFF7ri1fwpcw-U-zDZYQIm69GTRjlguGe31OMzjZyPPNvnXFvXHydf87oZv1D6vA/s399/%D9%83%D8%AA%D8%A7%D8%A8%20%D8%A7%D9%84%D8%A7%D9%85%D8%AA%D8%AD%D8%A7%D9%86%20%D9%83%D9%8A%D9%85%D9%8A%D8%A7%D8%A1%20%D9%84%D9%84%D8%B5%D9%81%20%D8%A7%D9%84%D8%A3%D9%88%D9%84%20%D8%A7%D9%84%D8%AB%D8%A7%D9%86%D9%88%D9%8A%20%D8%A7%D9%84%D8%AA%D8%B1%D9%85%20%D8%A7%D9%84%D8%A3%D9%88%D9%84%202025.webp	مبتدئ	COMPLETED	\N
cmba79z3f0002rilchh7m1489	كيمياء أولى ثانوي - الترم الثاني	دورة تعليمية متكاملة لطلاب الصف الأول الثانوي، تغطي مفاهيم الكيمياء الأساسية في الجزء الثاني، مع شرح مبسط وتطبيقات عملية تساعد على الفهم العميق والاستعداد للاختبارات.	cmba78tei0000rilcw84qjgku	2025-05-30 02:44:59.879	2025-07-04 17:14:33.121	https://assets.sahl.io/LRPHGtES4M18oAie8MTY4krGs4FCibuZfaKTtAJz.gif	intro	ACTIVE	2025-07-02 21:00:00
\.


--
-- TOC entry 4294 (class 0 OID 311379)
-- Dependencies: 290
-- Data for Name: CrisisCommunication; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."CrisisCommunication" (id, title, type, summary, "responsePlan", "handledById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4259 (class 0 OID 262280)
-- Dependencies: 255
-- Data for Name: Discussion; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Discussion" (id, "communityId", "postId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4304 (class 0 OID 311471)
-- Dependencies: 300
-- Data for Name: EmployeeAttendanceLog; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."EmployeeAttendanceLog" (id, "employeeId", "checkIn", "checkOut", status, notes, "secretaryId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4226 (class 0 OID 254020)
-- Dependencies: 222
-- Data for Name: Enrollment; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Enrollment" (id, "userId", "courseId", progress, status, "createdAt", "updatedAt") FROM stdin;
cmckjcc310001ri67gc0kg0ii	cmchn3fcm0000riuljxan8fmt	cmba79z3f0002rilchh7m1489	0	ACTIVE	2025-07-01 13:00:09.738	2025-07-01 13:00:09.738
\.


--
-- TOC entry 4240 (class 0 OID 254139)
-- Dependencies: 236
-- Data for Name: Event; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Event" (id, title, description, "startTime", "endTime", "academyId", "createdAt", "updatedAt", "adminRoleId", "legalCaseId", "prRecordId") FROM stdin;
\.


--
-- TOC entry 4282 (class 0 OID 303147)
-- Dependencies: 278
-- Data for Name: Expense; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Expense" (id, type, amount, description, "paidAt", "branchId", "createdBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4290 (class 0 OID 311345)
-- Dependencies: 286
-- Data for Name: FAQ; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."FAQ" (id, question, answer, category, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4225 (class 0 OID 254012)
-- Dependencies: 221
-- Data for Name: File; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."File" (id, name, url, "lessonId", "createdAt", type, "accountingEntryId", "adminRoleId", "legalCaseId", "meetingId", "prRecordId") FROM stdin;
cmcl3q4xx0001ria9gjw06gv4	شرح الجدول الدوري و تصنيف العناصر - المحاضرة الاولي	https://www.youtube.com/embed/Oz7NEiOm06c	cmba7c3yk0004rilc3s4bk2v9	2025-07-01 22:30:46.148	VIDEO	\N	\N	\N	\N	\N
cmba7dn4s0006rilc2q0i74vf	الدحيح | الكربون	https://www.youtube.com/embed/kEFLjuYARwU	cmba7c3yk0004rilc3s4bk2v9	2025-05-30 02:47:51.237	VIDEO	\N	\N	\N	\N	\N
cmcp3i8g00005riulhtcwwcfb	لا	https://www.youtube.com/embed/Qz2emyv6KgQ	cmcp3emug0001riuljmpflrln	2025-07-04 17:35:42.142	VIDEO	\N	\N	\N	\N	\N
\.


--
-- TOC entry 4235 (class 0 OID 254099)
-- Dependencies: 231
-- Data for Name: Group; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Group" (id, name, "adminId", "createdAt", image, subject) FROM stdin;
\.


--
-- TOC entry 4281 (class 0 OID 303138)
-- Dependencies: 277
-- Data for Name: Installment; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Installment" (id, "userId", amount, "dueDate", status, "paymentId", "branchId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4222 (class 0 OID 253989)
-- Dependencies: 218
-- Data for Name: Instructor; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Instructor" (id, "userId", "academyId", title) FROM stdin;
cmchvafyn0001rixzctd4zm3r	cmchn5xrh0002riulgc2sm4jt	\N	فزياء
cmchveoz40004rixzvne70yoe	cmchve1qu0002rixz8ni5yoam	\N	رياضة
cmcj71w7y0001ri31xz69d6hy	cmcj6uj4a0000rivnxv2xmlj6	\N	اللغه العربية
cmba7v5xj0001ri7wp5qnotqd	cmb0sk8wv0000xgvdy9kn3a4v	cmba78tei0000rilcw84qjgku	كمياء
\.


--
-- TOC entry 4302 (class 0 OID 311453)
-- Dependencies: 298
-- Data for Name: InternalMessage; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."InternalMessage" (id, title, content, "senderId", "isRead", priority, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4270 (class 0 OID 286801)
-- Dependencies: 266
-- Data for Name: Invoice; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Invoice" (id, "invoiceNumber", amount, description, "dueDate", status, "accountingEntryId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4279 (class 0 OID 286878)
-- Dependencies: 275
-- Data for Name: LegalCase; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."LegalCase" (id, "caseTitle", "caseType", status, description, "courtDate", "assignedLawyerId", "academyId", "relatedUserId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4224 (class 0 OID 254004)
-- Dependencies: 220
-- Data for Name: Lesson; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Lesson" (id, title, content, "courseId", "createdAt", "updatedAt", status) FROM stdin;
cmba7c3yk0004rilc3s4bk2v9	مقدمة في الكمياء	تعرفع علي المواد الكميائيه الفعاله	cmba79z3f0002rilchh7m1489	2025-05-30 02:45:35.304	2025-07-03 16:24:22.445	IN_PROGRESS
cmcp3emug0001riuljmpflrln	ماهو عدد زرات الكربون 	ماهو	cmcnpg1z70001rietrealufh1	2025-07-04 17:32:54.028	2025-07-04 17:35:22.826	NOT_STARTED
\.


--
-- TOC entry 4260 (class 0 OID 262288)
-- Dependencies: 256
-- Data for Name: LiveRoom; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."LiveRoom" (id, title, topic, participants, "isLive", "isActive", "isPublic", "isPrivate", "isPasswordProtected", "createdAt", "updatedAt", "communityId", "courseId") FROM stdin;
\.


--
-- TOC entry 4251 (class 0 OID 262195)
-- Dependencies: 247
-- Data for Name: LoginHistory; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."LoginHistory" (id, "userId", success, ip, device, location, browser, os, "createdAt") FROM stdin;
\.


--
-- TOC entry 4295 (class 0 OID 311387)
-- Dependencies: 291
-- Data for Name: MediaAlert; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."MediaAlert" (id, title, "triggerDate", "sourceType", "sourceId", generated, status, "academyId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4274 (class 0 OID 286835)
-- Dependencies: 270
-- Data for Name: Meeting; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Meeting" (id, "meetingTitle", "meetingDate", location, notes, "createdByAdminId", "academyId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4275 (class 0 OID 286843)
-- Dependencies: 271
-- Data for Name: MeetingParticipant; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."MeetingParticipant" (id, "meetingId", "userId", "isAttended", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4232 (class 0 OID 254073)
-- Dependencies: 228
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Message" (id, "senderId", content, "createdAt", "isRead") FROM stdin;
\.


--
-- TOC entry 4254 (class 0 OID 262229)
-- Dependencies: 250
-- Data for Name: Milestone; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Milestone" (id, title, description, status, "pathId", "createdAt") FROM stdin;
\.


--
-- TOC entry 4286 (class 0 OID 311313)
-- Dependencies: 282
-- Data for Name: NewsEvent; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."NewsEvent" (id, title, content, date, type, image, "createdById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4231 (class 0 OID 254064)
-- Dependencies: 227
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Notification" (id, "userId", message, title, read, "createdAt", "actionUrl", "isImportant", urgent, type, "trainingScheduleId") FROM stdin;
cmbf2n0yo0002ri8iupoiq731	cmbf1qudu0002rit22vzicy3z	تم إنشاء دور جديد: SUPER_ADMIN	دور جديد	f	2025-06-02 12:34:02.014	\N	f	f	MESSAGE	\N
cmbh76yf10005ricnbd6ldwh2	cmaze2ums0000xdg7kzowkqdx	string	string	t	2025-06-04 00:16:51.377	string	t	t	ASSIGNMENT	\N
cmcl7s7b40003rixbjl7lsaxi	cmchn3fcm0000riuljxan8fmt	يرجى مراجعة جدول التدريب الجديد الخاص بك قبل نهاية اليوم.	تنبيه هام بخصوص التدريب	f	2025-07-02 00:24:20.992	/student/dashboard	t	t	MESSAGE	\N
\.


--
-- TOC entry 4255 (class 0 OID 262238)
-- Dependencies: 251
-- Data for Name: NotificationSettings; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."NotificationSettings" (id, "userId", assignments, grades, messages, achievements, urgent, email, push, "createdAt") FROM stdin;
cmbh7ccmo0007ricnkzuis8ot	cmaze2ums0000xdg7kzowkqdx	t	t	t	t	t	t	t	2025-06-04 00:21:08.527
\.


--
-- TOC entry 4268 (class 0 OID 270365)
-- Dependencies: 264
-- Data for Name: Option; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Option" (id, "questionId", text, "isCorrect", "createdAt", "updatedAt") FROM stdin;
cmbh6rgpv0004ri3mr385noyw	cmbh6rgpv0003ri3m9itmbz5e	string	t	2025-06-04 00:04:59.875	2025-06-04 00:04:59.875
cmbh6rgpv0005ri3m518zx9k1	cmbh6rgpv0003ri3m9itmbz5e	string	f	2025-06-04 00:04:59.875	2025-06-04 00:04:59.875
cmbh6rgpv0006ri3mdnbkrle3	cmbh6rgpv0003ri3m9itmbz5e	string	t	2025-06-04 00:04:59.875	2025-06-04 00:04:59.875
cmbh6rgpv0007ri3mmshh5o8k	cmbh6rgpv0003ri3m9itmbz5e	string	f	2025-06-04 00:04:59.875	2025-06-04 00:04:59.875
cmbh6rhlw000dri3mfh1mdque	cmbh6rhlw000bri3m0e4k8ovt	string	t	2025-06-04 00:04:59.875	2025-06-04 00:04:59.875
cmbh6rhlw000fri3m39qlf7qo	cmbh6rhlw000bri3m0e4k8ovt	string	f	2025-06-04 00:04:59.875	2025-06-04 00:04:59.875
cmbh6rhlw000hri3mv7ch7eb5	cmbh6rhlw000bri3m0e4k8ovt	string	t	2025-06-04 00:04:59.875	2025-06-04 00:04:59.875
cmbh6rhlw000jri3mw8fh0xgz	cmbh6rhlw000bri3m0e4k8ovt	string	f	2025-06-04 00:04:59.875	2025-06-04 00:04:59.875
cmbh6rhlw000cri3mu9xwqdpp	cmbh6rhlw000ari3m8b9exru8	string	t	2025-06-04 00:04:59.875	2025-06-04 00:04:59.875
cmbh6rhlw000eri3m1jnpho8t	cmbh6rhlw000ari3m8b9exru8	string	f	2025-06-04 00:04:59.875	2025-06-04 00:04:59.875
cmbh6rhlw000gri3mztce5acy	cmbh6rhlw000ari3m8b9exru8	string	t	2025-06-04 00:04:59.875	2025-06-04 00:04:59.875
cmbh6rhlw000iri3md5zj8kel	cmbh6rhlw000ari3m8b9exru8	string	f	2025-06-04 00:04:59.875	2025-06-04 00:04:59.875
\.


--
-- TOC entry 4238 (class 0 OID 254123)
-- Dependencies: 234
-- Data for Name: Owner; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Owner" (id, "userId", "createdAt") FROM stdin;
\.


--
-- TOC entry 4273 (class 0 OID 286827)
-- Dependencies: 269
-- Data for Name: PRResponse; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."PRResponse" (id, response, "prRecordId", "respondedByAdminId", "createdAt") FROM stdin;
\.


--
-- TOC entry 4292 (class 0 OID 311363)
-- Dependencies: 288
-- Data for Name: Partnership; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Partnership" (id, "partnerName", type, description, logo, "startDate", "endDate", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4296 (class 0 OID 311397)
-- Dependencies: 292
-- Data for Name: PartnershipAgreement; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."PartnershipAgreement" (id, "partnerName", description, logo, type, "startDate", "endDate", "academyId", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4253 (class 0 OID 262215)
-- Dependencies: 249
-- Data for Name: Path; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Path" (id, title, description, level, "completedTasks", "remainingTime", "studyTime", "totalTasks", progress, engagement, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4242 (class 0 OID 254155)
-- Dependencies: 238
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Payment" (id, "userId", amount, "createdAt", "legalCaseId", "branchId", method, "paidAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4301 (class 0 OID 311445)
-- Dependencies: 297
-- Data for Name: PaymentLogBySecretary; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."PaymentLogBySecretary" (id, "paymentId", "secretaryId", notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4276 (class 0 OID 286852)
-- Dependencies: 272
-- Data for Name: Permission; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Permission" (id, name, description, "isActive", "createdAt") FROM stdin;
\.


--
-- TOC entry 4233 (class 0 OID 254082)
-- Dependencies: 229
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Post" (id, "authorId", content, "createdAt", "likesCount", title, "publicRelationsRecordId") FROM stdin;
\.


--
-- TOC entry 4220 (class 0 OID 253974)
-- Dependencies: 216
-- Data for Name: Profile; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Profile" (id, "userId", bio, phone, address, preferences) FROM stdin;
\.


--
-- TOC entry 4272 (class 0 OID 286818)
-- Dependencies: 268
-- Data for Name: PublicRelationsRecord; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."PublicRelationsRecord" (id, message, "senderName", "senderContact", status, "handledByAdminId", "academyId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4228 (class 0 OID 254038)
-- Dependencies: 224
-- Data for Name: Question; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Question" (id, text, type, points, "isAnswered", "quizId", "createdAt", "isMultiple") FROM stdin;
cmbh6rgpv0003ri3m9itmbz5e	string	string	10	t	cmbh6rflf0001ri3mj76sjvp4	2025-06-04 00:04:59.875	t
cmbh6rhlw000ari3m8b9exru8	string	string	10	t	cmbh6rflf0001ri3mj76sjvp4	2025-06-04 00:04:59.875	t
cmbh6rhlw000bri3m0e4k8ovt	string	string	10	t	cmbh6rflf0001ri3mj76sjvp4	2025-06-04 00:04:59.875	t
\.


--
-- TOC entry 4300 (class 0 OID 311436)
-- Dependencies: 296
-- Data for Name: QuickActionLink; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."QuickActionLink" (id, title, description, url, icon, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4227 (class 0 OID 254030)
-- Dependencies: 223
-- Data for Name: Quiz; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Quiz" (id, title, description, "lessonId", "timeLimit", "passingScore", "createdAt", "updatedAt", "isCompleted", "upComing") FROM stdin;
cmbh6bg960003ri0tobgovq5p	string	string	cmba7c3yk0004rilc3s4bk2v9	0	0	2025-06-03 23:52:32.617	2025-06-03 23:52:32.617	f	f
cmbh6d9j90001rid5owytyiii	string	string	cmba7c3yk0004rilc3s4bk2v9	0	0	2025-06-03 23:53:57.378	2025-06-03 23:53:57.378	f	f
cmbh6i6x30001rijijj3uhpzt	string	string	cmba7c3yk0004rilc3s4bk2v9	0	0	2025-06-03 23:57:47.271	2025-06-03 23:57:47.271	f	f
cmbh6ij0y0001rikwuego1yhh	string	string	cmba7c3yk0004rilc3s4bk2v9	0	0	2025-06-03 23:58:02.963	2025-06-03 23:58:02.963	f	f
cmbh6rflf0001ri3mj76sjvp4	string	string	cmba7c3yk0004rilc3s4bk2v9	0	0	2025-06-04 00:04:58.419	2025-06-04 00:04:58.419	f	f
\.


--
-- TOC entry 4243 (class 0 OID 254163)
-- Dependencies: 239
-- Data for Name: Report; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Report" (id, "userId", "createdAt", "accountingEntryId", "adminRoleId", "legalCaseId", "meetingId") FROM stdin;
\.


--
-- TOC entry 4271 (class 0 OID 286810)
-- Dependencies: 267
-- Data for Name: SalaryPayment; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."SalaryPayment" (id, "employeeId", amount, month, year, "accountingEntryId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4297 (class 0 OID 311406)
-- Dependencies: 293
-- Data for Name: SecretariatDashboard; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."SecretariatDashboard" (id, "totalStudents", "activeCourses", "todayMeetings", "newNotifications", "totalPayments", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4303 (class 0 OID 311463)
-- Dependencies: 299
-- Data for Name: SecretaryFiles; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."SecretaryFiles" (id, title, description, "fileId", category, tags, "secretaryId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4229 (class 0 OID 254047)
-- Dependencies: 225
-- Data for Name: Submission; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Submission" (id, "userId", "quizId", score, feedback, passed, "createdAt", "updatedAt", answers) FROM stdin;
\.


--
-- TOC entry 4287 (class 0 OID 311321)
-- Dependencies: 283
-- Data for Name: SuccessStory; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."SuccessStory" (id, title, content, image, "videoUrl", "graduateName", "position", "createdById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4288 (class 0 OID 311329)
-- Dependencies: 284
-- Data for Name: Testimonial; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Testimonial" (id, name, feedback, rating, image, "videoUrl", "courseId", "academyId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4298 (class 0 OID 311419)
-- Dependencies: 294
-- Data for Name: TraineeManagement; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."TraineeManagement" (id, "userId", "enrollmentId", notes, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4299 (class 0 OID 311428)
-- Dependencies: 295
-- Data for Name: TrainingSchedule; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."TrainingSchedule" (id, title, description, "startTime", "endTime", type, "courseId", location, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4252 (class 0 OID 262204)
-- Dependencies: 248
-- Data for Name: TwoFactor; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."TwoFactor" (id, "userId", email, sms, authenticator, secret, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4219 (class 0 OID 253965)
-- Dependencies: 215
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."User" (id, email, password, "firstName", "lastName", role, "subRole", avatar, "createdAt", "updatedAt", "academyId", phone, age, "isOnline", "isVerified") FROM stdin;
cmaze2ums0000xdg7kzowkqdx	ahmed15ayman7ahmed2002@gmail.com	$2b$10$JtmJUkMu2SMSbnk6egdEC.Aqg9ecOJqcRRVBsiFxVEt6cIkNghaoq	ahmed	ayman	STUDENT	\N	https://drive.google.com/file/d/1_0Xi8X17QqlV43aYLvIdyKWsHbCfq_Xm/view?usp=sharing	2025-05-22 12:58:34.646	2025-05-23 17:37:39.808	\N	\N	\N	f	f
cmbf1qudu0002rit22vzicy3z	ahmed15ayman7@gmail.com	$2b$10$5G3JbPLdciLM6Pe9YrvBjeLiFHrrNv.UDQ0EIeY.ZYNsZaRgNxNqi	احمد	ايمن	ADMIN	\N	\N	2025-06-02 12:09:00.356	2025-06-02 12:09:00.356	\N	\N	\N	f	f
cmbfs8kqw0003u15shkkgkkvy	string1@s	string	string	string	PARENT	string	string	2025-06-03 00:30:37.652	2025-06-03 00:30:37.652	\N	\N	\N	f	f
cmbfs1hsm0002u15s783tyd78	string@s.com	$2b$10$qKnoOR4Hbi7f3gfNUXuKV.R7648HJe.CiN7F6WmYx1B7AJx4MGWpa	ff	string	ACADEMY	string	string	2025-06-03 00:25:07.214	2025-06-03 00:49:19.487	\N	\N	\N	f	f
cmchn3fcm0000riuljxan8fmt	st@st.st	$2b$10$k1z.HFXrL32hCHT/UdZcu.JxZ4IYRKJBNVB4PFTlPyZGtrL6jU232	ahmed	ayman	STUDENT		\N	2025-06-29 12:21:50.684	2025-06-29 12:21:50.684	\N	\N	\N	f	f
cmchve1qu0002rixz8ni5yoam	in2@in.in	$2b$10$HSr2a28FxNsoT6yDC27/M.MNxVq/9Gq6M.//Rk3uSbXHQtLH7vQs6	مستر محمد	سليم	INSTRUCTOR		https://media.istockphoto.com/id/1483752333/photo/businessman-in-black-suit-posing-confidently-on-isolated-background-fervent.jpg?s=1024x1024&w=is&k=20&c=FmksyC-U0dR37DBfU0fsD0-BcGVgkNKiMWdMp8fqW9o=	2025-06-29 16:14:06.516	2025-06-29 16:14:06.516	\N	\N	\N	f	f
cmcj6uj4a0000rivnxv2xmlj6	in3@in.in	$2b$10$1L.mIDLBN8T9y6gnIUUtA.aknirwrVW.CL3Q0CB2qAZzzunoD32um	مستراحمد 	عبدالحفيظ	INSTRUCTOR		https://media.istockphoto.com/id/1483752333/photo/businessman-in-black-suit-posing-confidently-on-isolated-background-fervent.jpg?s=1024x1024&w=is&k=20&c=FmksyC-U0dR37DBfU0fsD0-BcGVgkNKiMWdMp8fqW9o=	2025-06-30 14:22:37.476	2025-06-30 14:22:37.476	\N	\N	\N	f	f
cmchn5xrh0002riulgc2sm4jt	in@in.in	$2b$10$tt4oSv3RFpHTABAT0UpVaea0DrAAE0/oNGHrB7Fc3sgUd6PR8OkCe	مستر مصطفي	مدحت 	INSTRUCTOR		https://media.istockphoto.com/id/1483752333/photo/businessman-in-black-suit-posing-confidently-on-isolated-background-fervent.jpg?s=1024x1024&w=is&k=20&c=FmksyC-U0dR37DBfU0fsD0-BcGVgkNKiMWdMp8fqW9o=	2025-06-29 12:23:51.185	2025-06-30 14:27:20.35	\N	\N	10	t	t
cmb0sk8wv0000xgvdy9kn3a4v	ahmed15ayman7ahmed@gmail.com	$2b$10$8ii2GPGNck5FKus5QuLsQO1wKwhqp9s5Pp76d/tfhcjh1oQqqENyK	ahmed	ayman	INSTRUCTOR	\N	https://media.istockphoto.com/id/2194078950/photo/profile-picture-of-smiling-confident-arabic-businessman.jpg?s=2048x2048&w=is&k=20&c=L9F4GK4q8_DiSOtQfWoc_XgDAPWsymcwnRji2qs01do=	2025-05-22 12:58:34.646	2025-06-30 14:53:46.09	\N	\N	10	t	t
\.


--
-- TOC entry 4267 (class 0 OID 270357)
-- Dependencies: 263
-- Data for Name: UserAcademyCEO; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."UserAcademyCEO" (id, "userId", "academyId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4305 (class 0 OID 311480)
-- Dependencies: 301
-- Data for Name: _AcademyToCSRProject; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."_AcademyToCSRProject" ("A", "B") FROM stdin;
\.


--
-- TOC entry 4280 (class 0 OID 286887)
-- Dependencies: 276
-- Data for Name: _AdminRoleToPermission; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."_AdminRoleToPermission" ("A", "B") FROM stdin;
\.


--
-- TOC entry 4250 (class 0 OID 254201)
-- Dependencies: 246
-- Data for Name: _ChannelToMessage; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."_ChannelToMessage" ("A", "B") FROM stdin;
\.


--
-- TOC entry 4249 (class 0 OID 254196)
-- Dependencies: 245
-- Data for Name: _ChannelToUser; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."_ChannelToUser" ("A", "B") FROM stdin;
\.


--
-- TOC entry 4263 (class 0 OID 262316)
-- Dependencies: 259
-- Data for Name: _CommunityToGroup; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."_CommunityToGroup" ("A", "B") FROM stdin;
\.


--
-- TOC entry 4265 (class 0 OID 262330)
-- Dependencies: 261
-- Data for Name: _CommunityToPost; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."_CommunityToPost" ("A", "B") FROM stdin;
\.


--
-- TOC entry 4264 (class 0 OID 262323)
-- Dependencies: 260
-- Data for Name: _CommunityToUser; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."_CommunityToUser" ("A", "B") FROM stdin;
cmcja246h0000riea8ttds8n9	cmchn3fcm0000riuljxan8fmt
\.


--
-- TOC entry 4245 (class 0 OID 254176)
-- Dependencies: 241
-- Data for Name: _CourseToInstructor; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."_CourseToInstructor" ("A", "B") FROM stdin;
cmba79z3f0002rilchh7m1489	cmba7v5xj0001ri7wp5qnotqd
cmcnpg1z70001rietrealufh1	cmba7v5xj0001ri7wp5qnotqd
cmcnpl2jt0002riet5iufm9y1	cmba7v5xj0001ri7wp5qnotqd
\.


--
-- TOC entry 4261 (class 0 OID 262302)
-- Dependencies: 257
-- Data for Name: _CourseToPath; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."_CourseToPath" ("A", "B") FROM stdin;
\.


--
-- TOC entry 4244 (class 0 OID 254171)
-- Dependencies: 240
-- Data for Name: _CourseToQuiz; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."_CourseToQuiz" ("A", "B") FROM stdin;
\.


--
-- TOC entry 4306 (class 0 OID 311487)
-- Dependencies: 302
-- Data for Name: _FileToTraineeManagement; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."_FileToTraineeManagement" ("A", "B") FROM stdin;
\.


--
-- TOC entry 4248 (class 0 OID 254191)
-- Dependencies: 244
-- Data for Name: _GroupToPost; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."_GroupToPost" ("A", "B") FROM stdin;
\.


--
-- TOC entry 4247 (class 0 OID 254186)
-- Dependencies: 243
-- Data for Name: _GroupToUser; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."_GroupToUser" ("A", "B") FROM stdin;
\.


--
-- TOC entry 4246 (class 0 OID 254181)
-- Dependencies: 242
-- Data for Name: _LessonToUser; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."_LessonToUser" ("A", "B") FROM stdin;
\.


--
-- TOC entry 4266 (class 0 OID 262337)
-- Dependencies: 262
-- Data for Name: _LiveRoomToUser; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."_LiveRoomToUser" ("A", "B") FROM stdin;
\.


--
-- TOC entry 4262 (class 0 OID 262309)
-- Dependencies: 258
-- Data for Name: _PathToUser; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."_PathToUser" ("A", "B") FROM stdin;
\.


--
-- TOC entry 4307 (class 0 OID 311494)
-- Dependencies: 303
-- Data for Name: _ReceivedMessages; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."_ReceivedMessages" ("A", "B") FROM stdin;
\.


--
-- TOC entry 4308 (class 0 OID 311501)
-- Dependencies: 304
-- Data for Name: _TrainingScheduleToUser; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."_TrainingScheduleToUser" ("A", "B") FROM stdin;
\.


--
-- TOC entry 3881 (class 2606 OID 311312)
-- Name: AboutSection AboutSection_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."AboutSection"
    ADD CONSTRAINT "AboutSection_pkey" PRIMARY KEY (id);


--
-- TOC entry 3735 (class 2606 OID 253988)
-- Name: Academy Academy_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Academy"
    ADD CONSTRAINT "Academy_pkey" PRIMARY KEY (id);


--
-- TOC entry 3844 (class 2606 OID 286800)
-- Name: AccountingEntry AccountingEntry_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."AccountingEntry"
    ADD CONSTRAINT "AccountingEntry_pkey" PRIMARY KEY (id);


--
-- TOC entry 3753 (class 2606 OID 254063)
-- Name: Achievement Achievement_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Achievement"
    ADD CONSTRAINT "Achievement_pkey" PRIMARY KEY (id);


--
-- TOC entry 3865 (class 2606 OID 286877)
-- Name: AdminAssignment AdminAssignment_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."AdminAssignment"
    ADD CONSTRAINT "AdminAssignment_pkey" PRIMARY KEY (id);


--
-- TOC entry 3863 (class 2606 OID 286868)
-- Name: AdminRole AdminRole_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."AdminRole"
    ADD CONSTRAINT "AdminRole_pkey" PRIMARY KEY (id);


--
-- TOC entry 3765 (class 2606 OID 254114)
-- Name: Admin Admin_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY (id);


--
-- TOC entry 3775 (class 2606 OID 254154)
-- Name: Attendance Attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY (id);


--
-- TOC entry 3812 (class 2606 OID 262260)
-- Name: Badge Badge_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Badge"
    ADD CONSTRAINT "Badge_pkey" PRIMARY KEY (id);


--
-- TOC entry 3893 (class 2606 OID 311362)
-- Name: BlogPost BlogPost_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_pkey" PRIMARY KEY (id);


--
-- TOC entry 3771 (class 2606 OID 254138)
-- Name: Bookmark Bookmark_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Bookmark"
    ADD CONSTRAINT "Bookmark_pkey" PRIMARY KEY (id);


--
-- TOC entry 3879 (class 2606 OID 303175)
-- Name: BranchFinance BranchFinance_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."BranchFinance"
    ADD CONSTRAINT "BranchFinance_pkey" PRIMARY KEY (id);


--
-- TOC entry 3876 (class 2606 OID 303163)
-- Name: Branch Branch_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT "Branch_pkey" PRIMARY KEY (id);


--
-- TOC entry 3898 (class 2606 OID 311378)
-- Name: CSRProject CSRProject_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."CSRProject"
    ADD CONSTRAINT "CSRProject_pkey" PRIMARY KEY (id);


--
-- TOC entry 3814 (class 2606 OID 262268)
-- Name: Certificate Certificate_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Certificate"
    ADD CONSTRAINT "Certificate_pkey" PRIMARY KEY (id);


--
-- TOC entry 3767 (class 2606 OID 254122)
-- Name: Channel Channel_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Channel"
    ADD CONSTRAINT "Channel_pkey" PRIMARY KEY (id);


--
-- TOC entry 3761 (class 2606 OID 254098)
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- TOC entry 3816 (class 2606 OID 262279)
-- Name: Community Community_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Community"
    ADD CONSTRAINT "Community_pkey" PRIMARY KEY (id);


--
-- TOC entry 3889 (class 2606 OID 311344)
-- Name: ContactMessage ContactMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."ContactMessage"
    ADD CONSTRAINT "ContactMessage_pkey" PRIMARY KEY (id);


--
-- TOC entry 3739 (class 2606 OID 254003)
-- Name: Course Course_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_pkey" PRIMARY KEY (id);


--
-- TOC entry 3900 (class 2606 OID 311386)
-- Name: CrisisCommunication CrisisCommunication_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."CrisisCommunication"
    ADD CONSTRAINT "CrisisCommunication_pkey" PRIMARY KEY (id);


--
-- TOC entry 3818 (class 2606 OID 262287)
-- Name: Discussion Discussion_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Discussion"
    ADD CONSTRAINT "Discussion_pkey" PRIMARY KEY (id);


--
-- TOC entry 3920 (class 2606 OID 311479)
-- Name: EmployeeAttendanceLog EmployeeAttendanceLog_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."EmployeeAttendanceLog"
    ADD CONSTRAINT "EmployeeAttendanceLog_pkey" PRIMARY KEY (id);


--
-- TOC entry 3745 (class 2606 OID 254029)
-- Name: Enrollment Enrollment_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_pkey" PRIMARY KEY (id);


--
-- TOC entry 3773 (class 2606 OID 254146)
-- Name: Event Event_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);


--
-- TOC entry 3874 (class 2606 OID 303155)
-- Name: Expense Expense_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_pkey" PRIMARY KEY (id);


--
-- TOC entry 3891 (class 2606 OID 311353)
-- Name: FAQ FAQ_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."FAQ"
    ADD CONSTRAINT "FAQ_pkey" PRIMARY KEY (id);


--
-- TOC entry 3743 (class 2606 OID 254019)
-- Name: File File_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_pkey" PRIMARY KEY (id);


--
-- TOC entry 3763 (class 2606 OID 254106)
-- Name: Group Group_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Group"
    ADD CONSTRAINT "Group_pkey" PRIMARY KEY (id);


--
-- TOC entry 3872 (class 2606 OID 303146)
-- Name: Installment Installment_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Installment"
    ADD CONSTRAINT "Installment_pkey" PRIMARY KEY (id);


--
-- TOC entry 3737 (class 2606 OID 253995)
-- Name: Instructor Instructor_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Instructor"
    ADD CONSTRAINT "Instructor_pkey" PRIMARY KEY (id);


--
-- TOC entry 3916 (class 2606 OID 311462)
-- Name: InternalMessage InternalMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."InternalMessage"
    ADD CONSTRAINT "InternalMessage_pkey" PRIMARY KEY (id);


--
-- TOC entry 3848 (class 2606 OID 286809)
-- Name: Invoice Invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY (id);


--
-- TOC entry 3867 (class 2606 OID 286886)
-- Name: LegalCase LegalCase_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."LegalCase"
    ADD CONSTRAINT "LegalCase_pkey" PRIMARY KEY (id);


--
-- TOC entry 3741 (class 2606 OID 254011)
-- Name: Lesson Lesson_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_pkey" PRIMARY KEY (id);


--
-- TOC entry 3820 (class 2606 OID 262301)
-- Name: LiveRoom LiveRoom_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."LiveRoom"
    ADD CONSTRAINT "LiveRoom_pkey" PRIMARY KEY (id);


--
-- TOC entry 3802 (class 2606 OID 262203)
-- Name: LoginHistory LoginHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."LoginHistory"
    ADD CONSTRAINT "LoginHistory_pkey" PRIMARY KEY (id);


--
-- TOC entry 3902 (class 2606 OID 311396)
-- Name: MediaAlert MediaAlert_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."MediaAlert"
    ADD CONSTRAINT "MediaAlert_pkey" PRIMARY KEY (id);


--
-- TOC entry 3859 (class 2606 OID 286851)
-- Name: MeetingParticipant MeetingParticipant_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."MeetingParticipant"
    ADD CONSTRAINT "MeetingParticipant_pkey" PRIMARY KEY (id);


--
-- TOC entry 3857 (class 2606 OID 286842)
-- Name: Meeting Meeting_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Meeting"
    ADD CONSTRAINT "Meeting_pkey" PRIMARY KEY (id);


--
-- TOC entry 3757 (class 2606 OID 254081)
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- TOC entry 3808 (class 2606 OID 262237)
-- Name: Milestone Milestone_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Milestone"
    ADD CONSTRAINT "Milestone_pkey" PRIMARY KEY (id);


--
-- TOC entry 3883 (class 2606 OID 311320)
-- Name: NewsEvent NewsEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."NewsEvent"
    ADD CONSTRAINT "NewsEvent_pkey" PRIMARY KEY (id);


--
-- TOC entry 3810 (class 2606 OID 262252)
-- Name: NotificationSettings NotificationSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."NotificationSettings"
    ADD CONSTRAINT "NotificationSettings_pkey" PRIMARY KEY (id);


--
-- TOC entry 3755 (class 2606 OID 254072)
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- TOC entry 3842 (class 2606 OID 270373)
-- Name: Option Option_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Option"
    ADD CONSTRAINT "Option_pkey" PRIMARY KEY (id);


--
-- TOC entry 3769 (class 2606 OID 254130)
-- Name: Owner Owner_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Owner"
    ADD CONSTRAINT "Owner_pkey" PRIMARY KEY (id);


--
-- TOC entry 3855 (class 2606 OID 286834)
-- Name: PRResponse PRResponse_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PRResponse"
    ADD CONSTRAINT "PRResponse_pkey" PRIMARY KEY (id);


--
-- TOC entry 3904 (class 2606 OID 311405)
-- Name: PartnershipAgreement PartnershipAgreement_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PartnershipAgreement"
    ADD CONSTRAINT "PartnershipAgreement_pkey" PRIMARY KEY (id);


--
-- TOC entry 3896 (class 2606 OID 311370)
-- Name: Partnership Partnership_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Partnership"
    ADD CONSTRAINT "Partnership_pkey" PRIMARY KEY (id);


--
-- TOC entry 3806 (class 2606 OID 262228)
-- Name: Path Path_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Path"
    ADD CONSTRAINT "Path_pkey" PRIMARY KEY (id);


--
-- TOC entry 3914 (class 2606 OID 311452)
-- Name: PaymentLogBySecretary PaymentLogBySecretary_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PaymentLogBySecretary"
    ADD CONSTRAINT "PaymentLogBySecretary_pkey" PRIMARY KEY (id);


--
-- TOC entry 3777 (class 2606 OID 254162)
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- TOC entry 3861 (class 2606 OID 286860)
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- TOC entry 3759 (class 2606 OID 254090)
-- Name: Post Post_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);


--
-- TOC entry 3732 (class 2606 OID 253980)
-- Name: Profile Profile_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Profile"
    ADD CONSTRAINT "Profile_pkey" PRIMARY KEY (id);


--
-- TOC entry 3853 (class 2606 OID 286826)
-- Name: PublicRelationsRecord PublicRelationsRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PublicRelationsRecord"
    ADD CONSTRAINT "PublicRelationsRecord_pkey" PRIMARY KEY (id);


--
-- TOC entry 3749 (class 2606 OID 254046)
-- Name: Question Question_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_pkey" PRIMARY KEY (id);


--
-- TOC entry 3912 (class 2606 OID 311444)
-- Name: QuickActionLink QuickActionLink_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."QuickActionLink"
    ADD CONSTRAINT "QuickActionLink_pkey" PRIMARY KEY (id);


--
-- TOC entry 3747 (class 2606 OID 254037)
-- Name: Quiz Quiz_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Quiz"
    ADD CONSTRAINT "Quiz_pkey" PRIMARY KEY (id);


--
-- TOC entry 3779 (class 2606 OID 254170)
-- Name: Report Report_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_pkey" PRIMARY KEY (id);


--
-- TOC entry 3851 (class 2606 OID 286817)
-- Name: SalaryPayment SalaryPayment_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."SalaryPayment"
    ADD CONSTRAINT "SalaryPayment_pkey" PRIMARY KEY (id);


--
-- TOC entry 3906 (class 2606 OID 311418)
-- Name: SecretariatDashboard SecretariatDashboard_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."SecretariatDashboard"
    ADD CONSTRAINT "SecretariatDashboard_pkey" PRIMARY KEY (id);


--
-- TOC entry 3918 (class 2606 OID 311470)
-- Name: SecretaryFiles SecretaryFiles_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."SecretaryFiles"
    ADD CONSTRAINT "SecretaryFiles_pkey" PRIMARY KEY (id);


--
-- TOC entry 3751 (class 2606 OID 254055)
-- Name: Submission Submission_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_pkey" PRIMARY KEY (id);


--
-- TOC entry 3885 (class 2606 OID 311328)
-- Name: SuccessStory SuccessStory_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."SuccessStory"
    ADD CONSTRAINT "SuccessStory_pkey" PRIMARY KEY (id);


--
-- TOC entry 3887 (class 2606 OID 311336)
-- Name: Testimonial Testimonial_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Testimonial"
    ADD CONSTRAINT "Testimonial_pkey" PRIMARY KEY (id);


--
-- TOC entry 3908 (class 2606 OID 311427)
-- Name: TraineeManagement TraineeManagement_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."TraineeManagement"
    ADD CONSTRAINT "TraineeManagement_pkey" PRIMARY KEY (id);


--
-- TOC entry 3910 (class 2606 OID 311435)
-- Name: TrainingSchedule TrainingSchedule_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."TrainingSchedule"
    ADD CONSTRAINT "TrainingSchedule_pkey" PRIMARY KEY (id);


--
-- TOC entry 3804 (class 2606 OID 262214)
-- Name: TwoFactor TwoFactor_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."TwoFactor"
    ADD CONSTRAINT "TwoFactor_pkey" PRIMARY KEY (id);


--
-- TOC entry 3840 (class 2606 OID 270364)
-- Name: UserAcademyCEO UserAcademyCEO_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."UserAcademyCEO"
    ADD CONSTRAINT "UserAcademyCEO_pkey" PRIMARY KEY (id);


--
-- TOC entry 3730 (class 2606 OID 253973)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 3922 (class 2606 OID 311486)
-- Name: _AcademyToCSRProject _AcademyToCSRProject_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_AcademyToCSRProject"
    ADD CONSTRAINT "_AcademyToCSRProject_AB_pkey" PRIMARY KEY ("A", "B");


--
-- TOC entry 3869 (class 2606 OID 286893)
-- Name: _AdminRoleToPermission _AdminRoleToPermission_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_AdminRoleToPermission"
    ADD CONSTRAINT "_AdminRoleToPermission_AB_pkey" PRIMARY KEY ("A", "B");


--
-- TOC entry 3799 (class 2606 OID 262182)
-- Name: _ChannelToMessage _ChannelToMessage_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_ChannelToMessage"
    ADD CONSTRAINT "_ChannelToMessage_AB_pkey" PRIMARY KEY ("A", "B");


--
-- TOC entry 3796 (class 2606 OID 262184)
-- Name: _ChannelToUser _ChannelToUser_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_ChannelToUser"
    ADD CONSTRAINT "_ChannelToUser_AB_pkey" PRIMARY KEY ("A", "B");


--
-- TOC entry 3828 (class 2606 OID 262322)
-- Name: _CommunityToGroup _CommunityToGroup_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_CommunityToGroup"
    ADD CONSTRAINT "_CommunityToGroup_AB_pkey" PRIMARY KEY ("A", "B");


--
-- TOC entry 3834 (class 2606 OID 262336)
-- Name: _CommunityToPost _CommunityToPost_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_CommunityToPost"
    ADD CONSTRAINT "_CommunityToPost_AB_pkey" PRIMARY KEY ("A", "B");


--
-- TOC entry 3831 (class 2606 OID 262329)
-- Name: _CommunityToUser _CommunityToUser_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_CommunityToUser"
    ADD CONSTRAINT "_CommunityToUser_AB_pkey" PRIMARY KEY ("A", "B");


--
-- TOC entry 3784 (class 2606 OID 262186)
-- Name: _CourseToInstructor _CourseToInstructor_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_CourseToInstructor"
    ADD CONSTRAINT "_CourseToInstructor_AB_pkey" PRIMARY KEY ("A", "B");


--
-- TOC entry 3822 (class 2606 OID 262308)
-- Name: _CourseToPath _CourseToPath_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_CourseToPath"
    ADD CONSTRAINT "_CourseToPath_AB_pkey" PRIMARY KEY ("A", "B");


--
-- TOC entry 3781 (class 2606 OID 262188)
-- Name: _CourseToQuiz _CourseToQuiz_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_CourseToQuiz"
    ADD CONSTRAINT "_CourseToQuiz_AB_pkey" PRIMARY KEY ("A", "B");


--
-- TOC entry 3925 (class 2606 OID 311493)
-- Name: _FileToTraineeManagement _FileToTraineeManagement_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_FileToTraineeManagement"
    ADD CONSTRAINT "_FileToTraineeManagement_AB_pkey" PRIMARY KEY ("A", "B");


--
-- TOC entry 3793 (class 2606 OID 262190)
-- Name: _GroupToPost _GroupToPost_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_GroupToPost"
    ADD CONSTRAINT "_GroupToPost_AB_pkey" PRIMARY KEY ("A", "B");


--
-- TOC entry 3790 (class 2606 OID 262192)
-- Name: _GroupToUser _GroupToUser_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_GroupToUser"
    ADD CONSTRAINT "_GroupToUser_AB_pkey" PRIMARY KEY ("A", "B");


--
-- TOC entry 3787 (class 2606 OID 262194)
-- Name: _LessonToUser _LessonToUser_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_LessonToUser"
    ADD CONSTRAINT "_LessonToUser_AB_pkey" PRIMARY KEY ("A", "B");


--
-- TOC entry 3837 (class 2606 OID 262343)
-- Name: _LiveRoomToUser _LiveRoomToUser_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_LiveRoomToUser"
    ADD CONSTRAINT "_LiveRoomToUser_AB_pkey" PRIMARY KEY ("A", "B");


--
-- TOC entry 3825 (class 2606 OID 262315)
-- Name: _PathToUser _PathToUser_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_PathToUser"
    ADD CONSTRAINT "_PathToUser_AB_pkey" PRIMARY KEY ("A", "B");


--
-- TOC entry 3928 (class 2606 OID 311500)
-- Name: _ReceivedMessages _ReceivedMessages_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_ReceivedMessages"
    ADD CONSTRAINT "_ReceivedMessages_AB_pkey" PRIMARY KEY ("A", "B");


--
-- TOC entry 3931 (class 2606 OID 311507)
-- Name: _TrainingScheduleToUser _TrainingScheduleToUser_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_TrainingScheduleToUser"
    ADD CONSTRAINT "_TrainingScheduleToUser_AB_pkey" PRIMARY KEY ("A", "B");


--
-- TOC entry 3894 (class 1259 OID 311508)
-- Name: BlogPost_slug_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "BlogPost_slug_key" ON public."BlogPost" USING btree (slug);


--
-- TOC entry 3877 (class 1259 OID 303176)
-- Name: BranchFinance_branchId_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "BranchFinance_branchId_key" ON public."BranchFinance" USING btree ("branchId");


--
-- TOC entry 3845 (class 1259 OID 286895)
-- Name: Invoice_accountingEntryId_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "Invoice_accountingEntryId_key" ON public."Invoice" USING btree ("accountingEntryId");


--
-- TOC entry 3846 (class 1259 OID 286894)
-- Name: Invoice_invoiceNumber_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON public."Invoice" USING btree ("invoiceNumber");


--
-- TOC entry 3733 (class 1259 OID 254207)
-- Name: Profile_userId_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "Profile_userId_key" ON public."Profile" USING btree ("userId");


--
-- TOC entry 3849 (class 1259 OID 286896)
-- Name: SalaryPayment_accountingEntryId_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "SalaryPayment_accountingEntryId_key" ON public."SalaryPayment" USING btree ("accountingEntryId");


--
-- TOC entry 3728 (class 1259 OID 254206)
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- TOC entry 3923 (class 1259 OID 311509)
-- Name: _AcademyToCSRProject_B_index; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "_AcademyToCSRProject_B_index" ON public."_AcademyToCSRProject" USING btree ("B");


--
-- TOC entry 3870 (class 1259 OID 286897)
-- Name: _AdminRoleToPermission_B_index; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "_AdminRoleToPermission_B_index" ON public."_AdminRoleToPermission" USING btree ("B");


--
-- TOC entry 3800 (class 1259 OID 254221)
-- Name: _ChannelToMessage_B_index; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "_ChannelToMessage_B_index" ON public."_ChannelToMessage" USING btree ("B");


--
-- TOC entry 3797 (class 1259 OID 254219)
-- Name: _ChannelToUser_B_index; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "_ChannelToUser_B_index" ON public."_ChannelToUser" USING btree ("B");


--
-- TOC entry 3829 (class 1259 OID 262346)
-- Name: _CommunityToGroup_B_index; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "_CommunityToGroup_B_index" ON public."_CommunityToGroup" USING btree ("B");


--
-- TOC entry 3835 (class 1259 OID 262348)
-- Name: _CommunityToPost_B_index; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "_CommunityToPost_B_index" ON public."_CommunityToPost" USING btree ("B");


--
-- TOC entry 3832 (class 1259 OID 262347)
-- Name: _CommunityToUser_B_index; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "_CommunityToUser_B_index" ON public."_CommunityToUser" USING btree ("B");


--
-- TOC entry 3785 (class 1259 OID 254211)
-- Name: _CourseToInstructor_B_index; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "_CourseToInstructor_B_index" ON public."_CourseToInstructor" USING btree ("B");


--
-- TOC entry 3823 (class 1259 OID 262344)
-- Name: _CourseToPath_B_index; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "_CourseToPath_B_index" ON public."_CourseToPath" USING btree ("B");


--
-- TOC entry 3782 (class 1259 OID 254209)
-- Name: _CourseToQuiz_B_index; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "_CourseToQuiz_B_index" ON public."_CourseToQuiz" USING btree ("B");


--
-- TOC entry 3926 (class 1259 OID 311510)
-- Name: _FileToTraineeManagement_B_index; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "_FileToTraineeManagement_B_index" ON public."_FileToTraineeManagement" USING btree ("B");


--
-- TOC entry 3794 (class 1259 OID 254217)
-- Name: _GroupToPost_B_index; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "_GroupToPost_B_index" ON public."_GroupToPost" USING btree ("B");


--
-- TOC entry 3791 (class 1259 OID 254215)
-- Name: _GroupToUser_B_index; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "_GroupToUser_B_index" ON public."_GroupToUser" USING btree ("B");


--
-- TOC entry 3788 (class 1259 OID 254213)
-- Name: _LessonToUser_B_index; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "_LessonToUser_B_index" ON public."_LessonToUser" USING btree ("B");


--
-- TOC entry 3838 (class 1259 OID 262349)
-- Name: _LiveRoomToUser_B_index; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "_LiveRoomToUser_B_index" ON public."_LiveRoomToUser" USING btree ("B");


--
-- TOC entry 3826 (class 1259 OID 262345)
-- Name: _PathToUser_B_index; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "_PathToUser_B_index" ON public."_PathToUser" USING btree ("B");


--
-- TOC entry 3929 (class 1259 OID 311511)
-- Name: _ReceivedMessages_B_index; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "_ReceivedMessages_B_index" ON public."_ReceivedMessages" USING btree ("B");


--
-- TOC entry 3932 (class 1259 OID 311512)
-- Name: _TrainingScheduleToUser_B_index; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "_TrainingScheduleToUser_B_index" ON public."_TrainingScheduleToUser" USING btree ("B");


--
-- TOC entry 4047 (class 2606 OID 311528)
-- Name: AboutSection AboutSection_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."AboutSection"
    ADD CONSTRAINT "AboutSection_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4020 (class 2606 OID 286998)
-- Name: AccountingEntry AccountingEntry_academyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."AccountingEntry"
    ADD CONSTRAINT "AccountingEntry_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES public."Academy"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4021 (class 2606 OID 286993)
-- Name: AccountingEntry AccountingEntry_createdByAdminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."AccountingEntry"
    ADD CONSTRAINT "AccountingEntry_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3951 (class 2606 OID 254287)
-- Name: Achievement Achievement_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Achievement"
    ADD CONSTRAINT "Achievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4034 (class 2606 OID 287058)
-- Name: AdminAssignment AdminAssignment_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."AdminAssignment"
    ADD CONSTRAINT "AdminAssignment_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4035 (class 2606 OID 287063)
-- Name: AdminAssignment AdminAssignment_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."AdminAssignment"
    ADD CONSTRAINT "AdminAssignment_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."AdminRole"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4033 (class 2606 OID 294920)
-- Name: AdminRole AdminRole_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."AdminRole"
    ADD CONSTRAINT "AdminRole_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3959 (class 2606 OID 254317)
-- Name: Admin Admin_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3971 (class 2606 OID 254347)
-- Name: Attendance Attendance_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3972 (class 2606 OID 254342)
-- Name: Attendance Attendance_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3999 (class 2606 OID 262370)
-- Name: Badge Badge_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Badge"
    ADD CONSTRAINT "Badge_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4053 (class 2606 OID 311558)
-- Name: BlogPost BlogPost_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3966 (class 2606 OID 254332)
-- Name: Bookmark Bookmark_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Bookmark"
    ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4046 (class 2606 OID 311523)
-- Name: BranchFinance BranchFinance_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."BranchFinance"
    ADD CONSTRAINT "BranchFinance_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4054 (class 2606 OID 311563)
-- Name: CSRProject CSRProject_assignedTeamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."CSRProject"
    ADD CONSTRAINT "CSRProject_assignedTeamId_fkey" FOREIGN KEY ("assignedTeamId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4000 (class 2606 OID 262375)
-- Name: Certificate Certificate_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Certificate"
    ADD CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3960 (class 2606 OID 286943)
-- Name: Channel Channel_adminRoleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Channel"
    ADD CONSTRAINT "Channel_adminRoleId_fkey" FOREIGN KEY ("adminRoleId") REFERENCES public."AdminRole"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3961 (class 2606 OID 286948)
-- Name: Channel Channel_legalCaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Channel"
    ADD CONSTRAINT "Channel_legalCaseId_fkey" FOREIGN KEY ("legalCaseId") REFERENCES public."LegalCase"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3962 (class 2606 OID 286938)
-- Name: Channel Channel_meetingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Channel"
    ADD CONSTRAINT "Channel_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES public."Meeting"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3963 (class 2606 OID 254322)
-- Name: Channel Channel_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Channel"
    ADD CONSTRAINT "Channel_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."Owner"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3964 (class 2606 OID 286933)
-- Name: Channel Channel_prRecordId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Channel"
    ADD CONSTRAINT "Channel_prRecordId_fkey" FOREIGN KEY ("prRecordId") REFERENCES public."PublicRelationsRecord"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3957 (class 2606 OID 254307)
-- Name: Comment Comment_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4052 (class 2606 OID 311553)
-- Name: ContactMessage ContactMessage_respondedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."ContactMessage"
    ADD CONSTRAINT "ContactMessage_respondedById_fkey" FOREIGN KEY ("respondedById") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3937 (class 2606 OID 327680)
-- Name: Course Course_academyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES public."Academy"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4055 (class 2606 OID 311568)
-- Name: CrisisCommunication CrisisCommunication_handledById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."CrisisCommunication"
    ADD CONSTRAINT "CrisisCommunication_handledById_fkey" FOREIGN KEY ("handledById") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4001 (class 2606 OID 262380)
-- Name: Discussion Discussion_communityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Discussion"
    ADD CONSTRAINT "Discussion_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES public."Community"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4002 (class 2606 OID 262385)
-- Name: Discussion Discussion_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Discussion"
    ADD CONSTRAINT "Discussion_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4066 (class 2606 OID 311623)
-- Name: EmployeeAttendanceLog EmployeeAttendanceLog_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."EmployeeAttendanceLog"
    ADD CONSTRAINT "EmployeeAttendanceLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4067 (class 2606 OID 311628)
-- Name: EmployeeAttendanceLog EmployeeAttendanceLog_secretaryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."EmployeeAttendanceLog"
    ADD CONSTRAINT "EmployeeAttendanceLog_secretaryId_fkey" FOREIGN KEY ("secretaryId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3945 (class 2606 OID 254262)
-- Name: Enrollment Enrollment_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3946 (class 2606 OID 254257)
-- Name: Enrollment Enrollment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3967 (class 2606 OID 254337)
-- Name: Event Event_academyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES public."Academy"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3968 (class 2606 OID 286958)
-- Name: Event Event_adminRoleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_adminRoleId_fkey" FOREIGN KEY ("adminRoleId") REFERENCES public."AdminRole"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3969 (class 2606 OID 286963)
-- Name: Event Event_legalCaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_legalCaseId_fkey" FOREIGN KEY ("legalCaseId") REFERENCES public."LegalCase"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3970 (class 2606 OID 286953)
-- Name: Event Event_prRecordId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_prRecordId_fkey" FOREIGN KEY ("prRecordId") REFERENCES public."PublicRelationsRecord"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4044 (class 2606 OID 303197)
-- Name: Expense Expense_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4045 (class 2606 OID 311518)
-- Name: Expense Expense_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3939 (class 2606 OID 286903)
-- Name: File File_accountingEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_accountingEntryId_fkey" FOREIGN KEY ("accountingEntryId") REFERENCES public."AccountingEntry"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3940 (class 2606 OID 286918)
-- Name: File File_adminRoleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_adminRoleId_fkey" FOREIGN KEY ("adminRoleId") REFERENCES public."AdminRole"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3941 (class 2606 OID 286923)
-- Name: File File_legalCaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_legalCaseId_fkey" FOREIGN KEY ("legalCaseId") REFERENCES public."LegalCase"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3942 (class 2606 OID 286898)
-- Name: File File_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3943 (class 2606 OID 286913)
-- Name: File File_meetingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES public."Meeting"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3944 (class 2606 OID 286908)
-- Name: File File_prRecordId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_prRecordId_fkey" FOREIGN KEY ("prRecordId") REFERENCES public."PublicRelationsRecord"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3958 (class 2606 OID 254312)
-- Name: Group Group_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Group"
    ADD CONSTRAINT "Group_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4041 (class 2606 OID 303192)
-- Name: Installment Installment_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Installment"
    ADD CONSTRAINT "Installment_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4042 (class 2606 OID 303187)
-- Name: Installment Installment_paymentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Installment"
    ADD CONSTRAINT "Installment_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES public."Payment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4043 (class 2606 OID 303182)
-- Name: Installment Installment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Installment"
    ADD CONSTRAINT "Installment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3935 (class 2606 OID 319488)
-- Name: Instructor Instructor_academyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Instructor"
    ADD CONSTRAINT "Instructor_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES public."Academy"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3936 (class 2606 OID 254232)
-- Name: Instructor Instructor_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Instructor"
    ADD CONSTRAINT "Instructor_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4063 (class 2606 OID 311608)
-- Name: InternalMessage InternalMessage_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."InternalMessage"
    ADD CONSTRAINT "InternalMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4022 (class 2606 OID 287003)
-- Name: Invoice Invoice_accountingEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_accountingEntryId_fkey" FOREIGN KEY ("accountingEntryId") REFERENCES public."AccountingEntry"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4036 (class 2606 OID 287073)
-- Name: LegalCase LegalCase_academyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."LegalCase"
    ADD CONSTRAINT "LegalCase_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES public."Academy"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4037 (class 2606 OID 287068)
-- Name: LegalCase LegalCase_assignedLawyerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."LegalCase"
    ADD CONSTRAINT "LegalCase_assignedLawyerId_fkey" FOREIGN KEY ("assignedLawyerId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4038 (class 2606 OID 287078)
-- Name: LegalCase LegalCase_relatedUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."LegalCase"
    ADD CONSTRAINT "LegalCase_relatedUserId_fkey" FOREIGN KEY ("relatedUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3938 (class 2606 OID 254247)
-- Name: Lesson Lesson_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4003 (class 2606 OID 262390)
-- Name: LiveRoom LiveRoom_communityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."LiveRoom"
    ADD CONSTRAINT "LiveRoom_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES public."Community"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4004 (class 2606 OID 262395)
-- Name: LiveRoom LiveRoom_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."LiveRoom"
    ADD CONSTRAINT "LiveRoom_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3995 (class 2606 OID 262350)
-- Name: LoginHistory LoginHistory_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."LoginHistory"
    ADD CONSTRAINT "LoginHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4056 (class 2606 OID 311573)
-- Name: MediaAlert MediaAlert_academyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."MediaAlert"
    ADD CONSTRAINT "MediaAlert_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES public."Academy"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4031 (class 2606 OID 287048)
-- Name: MeetingParticipant MeetingParticipant_meetingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."MeetingParticipant"
    ADD CONSTRAINT "MeetingParticipant_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES public."Meeting"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4032 (class 2606 OID 287053)
-- Name: MeetingParticipant MeetingParticipant_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."MeetingParticipant"
    ADD CONSTRAINT "MeetingParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4029 (class 2606 OID 287043)
-- Name: Meeting Meeting_academyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Meeting"
    ADD CONSTRAINT "Meeting_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES public."Academy"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4030 (class 2606 OID 287038)
-- Name: Meeting Meeting_createdByAdminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Meeting"
    ADD CONSTRAINT "Meeting_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3954 (class 2606 OID 254297)
-- Name: Message Message_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3997 (class 2606 OID 262360)
-- Name: Milestone Milestone_pathId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Milestone"
    ADD CONSTRAINT "Milestone_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES public."Path"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4048 (class 2606 OID 311533)
-- Name: NewsEvent NewsEvent_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."NewsEvent"
    ADD CONSTRAINT "NewsEvent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3998 (class 2606 OID 262365)
-- Name: NotificationSettings NotificationSettings_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."NotificationSettings"
    ADD CONSTRAINT "NotificationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3952 (class 2606 OID 311513)
-- Name: Notification Notification_trainingScheduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_trainingScheduleId_fkey" FOREIGN KEY ("trainingScheduleId") REFERENCES public."TrainingSchedule"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3953 (class 2606 OID 254292)
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4019 (class 2606 OID 270384)
-- Name: Option Option_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Option"
    ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."Question"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3965 (class 2606 OID 254327)
-- Name: Owner Owner_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Owner"
    ADD CONSTRAINT "Owner_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4027 (class 2606 OID 287028)
-- Name: PRResponse PRResponse_prRecordId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PRResponse"
    ADD CONSTRAINT "PRResponse_prRecordId_fkey" FOREIGN KEY ("prRecordId") REFERENCES public."PublicRelationsRecord"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4028 (class 2606 OID 287033)
-- Name: PRResponse PRResponse_respondedByAdminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PRResponse"
    ADD CONSTRAINT "PRResponse_respondedByAdminId_fkey" FOREIGN KEY ("respondedByAdminId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4057 (class 2606 OID 311578)
-- Name: PartnershipAgreement PartnershipAgreement_academyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PartnershipAgreement"
    ADD CONSTRAINT "PartnershipAgreement_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES public."Academy"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4061 (class 2606 OID 311598)
-- Name: PaymentLogBySecretary PaymentLogBySecretary_paymentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PaymentLogBySecretary"
    ADD CONSTRAINT "PaymentLogBySecretary_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES public."Payment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4062 (class 2606 OID 311603)
-- Name: PaymentLogBySecretary PaymentLogBySecretary_secretaryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PaymentLogBySecretary"
    ADD CONSTRAINT "PaymentLogBySecretary_secretaryId_fkey" FOREIGN KEY ("secretaryId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3973 (class 2606 OID 303177)
-- Name: Payment Payment_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3974 (class 2606 OID 286968)
-- Name: Payment Payment_legalCaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_legalCaseId_fkey" FOREIGN KEY ("legalCaseId") REFERENCES public."LegalCase"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3975 (class 2606 OID 254352)
-- Name: Payment Payment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3955 (class 2606 OID 254302)
-- Name: Post Post_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3956 (class 2606 OID 286928)
-- Name: Post Post_publicRelationsRecordId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_publicRelationsRecordId_fkey" FOREIGN KEY ("publicRelationsRecordId") REFERENCES public."PublicRelationsRecord"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3934 (class 2606 OID 254227)
-- Name: Profile Profile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Profile"
    ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4025 (class 2606 OID 287023)
-- Name: PublicRelationsRecord PublicRelationsRecord_academyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PublicRelationsRecord"
    ADD CONSTRAINT "PublicRelationsRecord_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES public."Academy"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4026 (class 2606 OID 287018)
-- Name: PublicRelationsRecord PublicRelationsRecord_handledByAdminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."PublicRelationsRecord"
    ADD CONSTRAINT "PublicRelationsRecord_handledByAdminId_fkey" FOREIGN KEY ("handledByAdminId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3948 (class 2606 OID 254272)
-- Name: Question Question_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public."Quiz"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3947 (class 2606 OID 254267)
-- Name: Quiz Quiz_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Quiz"
    ADD CONSTRAINT "Quiz_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3976 (class 2606 OID 286973)
-- Name: Report Report_accountingEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_accountingEntryId_fkey" FOREIGN KEY ("accountingEntryId") REFERENCES public."AccountingEntry"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3977 (class 2606 OID 286983)
-- Name: Report Report_adminRoleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_adminRoleId_fkey" FOREIGN KEY ("adminRoleId") REFERENCES public."AdminRole"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3978 (class 2606 OID 286988)
-- Name: Report Report_legalCaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_legalCaseId_fkey" FOREIGN KEY ("legalCaseId") REFERENCES public."LegalCase"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3979 (class 2606 OID 286978)
-- Name: Report Report_meetingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES public."Meeting"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3980 (class 2606 OID 254357)
-- Name: Report Report_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4023 (class 2606 OID 287013)
-- Name: SalaryPayment SalaryPayment_accountingEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."SalaryPayment"
    ADD CONSTRAINT "SalaryPayment_accountingEntryId_fkey" FOREIGN KEY ("accountingEntryId") REFERENCES public."AccountingEntry"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4024 (class 2606 OID 287008)
-- Name: SalaryPayment SalaryPayment_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."SalaryPayment"
    ADD CONSTRAINT "SalaryPayment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4064 (class 2606 OID 311613)
-- Name: SecretaryFiles SecretaryFiles_fileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."SecretaryFiles"
    ADD CONSTRAINT "SecretaryFiles_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES public."File"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4065 (class 2606 OID 311618)
-- Name: SecretaryFiles SecretaryFiles_secretaryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."SecretaryFiles"
    ADD CONSTRAINT "SecretaryFiles_secretaryId_fkey" FOREIGN KEY ("secretaryId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3949 (class 2606 OID 254282)
-- Name: Submission Submission_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public."Quiz"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3950 (class 2606 OID 254277)
-- Name: Submission Submission_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4049 (class 2606 OID 311538)
-- Name: SuccessStory SuccessStory_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."SuccessStory"
    ADD CONSTRAINT "SuccessStory_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4050 (class 2606 OID 311548)
-- Name: Testimonial Testimonial_academyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Testimonial"
    ADD CONSTRAINT "Testimonial_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES public."Academy"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4051 (class 2606 OID 311543)
-- Name: Testimonial Testimonial_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Testimonial"
    ADD CONSTRAINT "Testimonial_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4058 (class 2606 OID 311588)
-- Name: TraineeManagement TraineeManagement_enrollmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."TraineeManagement"
    ADD CONSTRAINT "TraineeManagement_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES public."Enrollment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4059 (class 2606 OID 311583)
-- Name: TraineeManagement TraineeManagement_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."TraineeManagement"
    ADD CONSTRAINT "TraineeManagement_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4060 (class 2606 OID 311593)
-- Name: TrainingSchedule TrainingSchedule_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."TrainingSchedule"
    ADD CONSTRAINT "TrainingSchedule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3996 (class 2606 OID 262355)
-- Name: TwoFactor TwoFactor_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."TwoFactor"
    ADD CONSTRAINT "TwoFactor_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4017 (class 2606 OID 270379)
-- Name: UserAcademyCEO UserAcademyCEO_academyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."UserAcademyCEO"
    ADD CONSTRAINT "UserAcademyCEO_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES public."Academy"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4018 (class 2606 OID 270374)
-- Name: UserAcademyCEO UserAcademyCEO_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."UserAcademyCEO"
    ADD CONSTRAINT "UserAcademyCEO_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3933 (class 2606 OID 254222)
-- Name: User User_academyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES public."Academy"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4068 (class 2606 OID 311633)
-- Name: _AcademyToCSRProject _AcademyToCSRProject_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_AcademyToCSRProject"
    ADD CONSTRAINT "_AcademyToCSRProject_A_fkey" FOREIGN KEY ("A") REFERENCES public."Academy"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4069 (class 2606 OID 311638)
-- Name: _AcademyToCSRProject _AcademyToCSRProject_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_AcademyToCSRProject"
    ADD CONSTRAINT "_AcademyToCSRProject_B_fkey" FOREIGN KEY ("B") REFERENCES public."CSRProject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4039 (class 2606 OID 287083)
-- Name: _AdminRoleToPermission _AdminRoleToPermission_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_AdminRoleToPermission"
    ADD CONSTRAINT "_AdminRoleToPermission_A_fkey" FOREIGN KEY ("A") REFERENCES public."AdminRole"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4040 (class 2606 OID 287088)
-- Name: _AdminRoleToPermission _AdminRoleToPermission_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_AdminRoleToPermission"
    ADD CONSTRAINT "_AdminRoleToPermission_B_fkey" FOREIGN KEY ("B") REFERENCES public."Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3993 (class 2606 OID 254422)
-- Name: _ChannelToMessage _ChannelToMessage_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_ChannelToMessage"
    ADD CONSTRAINT "_ChannelToMessage_A_fkey" FOREIGN KEY ("A") REFERENCES public."Channel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3994 (class 2606 OID 254427)
-- Name: _ChannelToMessage _ChannelToMessage_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_ChannelToMessage"
    ADD CONSTRAINT "_ChannelToMessage_B_fkey" FOREIGN KEY ("B") REFERENCES public."Message"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3991 (class 2606 OID 254412)
-- Name: _ChannelToUser _ChannelToUser_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_ChannelToUser"
    ADD CONSTRAINT "_ChannelToUser_A_fkey" FOREIGN KEY ("A") REFERENCES public."Channel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3992 (class 2606 OID 254417)
-- Name: _ChannelToUser _ChannelToUser_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_ChannelToUser"
    ADD CONSTRAINT "_ChannelToUser_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4009 (class 2606 OID 262420)
-- Name: _CommunityToGroup _CommunityToGroup_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_CommunityToGroup"
    ADD CONSTRAINT "_CommunityToGroup_A_fkey" FOREIGN KEY ("A") REFERENCES public."Community"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4010 (class 2606 OID 262425)
-- Name: _CommunityToGroup _CommunityToGroup_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_CommunityToGroup"
    ADD CONSTRAINT "_CommunityToGroup_B_fkey" FOREIGN KEY ("B") REFERENCES public."Group"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4013 (class 2606 OID 262440)
-- Name: _CommunityToPost _CommunityToPost_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_CommunityToPost"
    ADD CONSTRAINT "_CommunityToPost_A_fkey" FOREIGN KEY ("A") REFERENCES public."Community"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4014 (class 2606 OID 262445)
-- Name: _CommunityToPost _CommunityToPost_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_CommunityToPost"
    ADD CONSTRAINT "_CommunityToPost_B_fkey" FOREIGN KEY ("B") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4011 (class 2606 OID 262430)
-- Name: _CommunityToUser _CommunityToUser_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_CommunityToUser"
    ADD CONSTRAINT "_CommunityToUser_A_fkey" FOREIGN KEY ("A") REFERENCES public."Community"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4012 (class 2606 OID 262435)
-- Name: _CommunityToUser _CommunityToUser_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_CommunityToUser"
    ADD CONSTRAINT "_CommunityToUser_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3983 (class 2606 OID 254372)
-- Name: _CourseToInstructor _CourseToInstructor_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_CourseToInstructor"
    ADD CONSTRAINT "_CourseToInstructor_A_fkey" FOREIGN KEY ("A") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3984 (class 2606 OID 254377)
-- Name: _CourseToInstructor _CourseToInstructor_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_CourseToInstructor"
    ADD CONSTRAINT "_CourseToInstructor_B_fkey" FOREIGN KEY ("B") REFERENCES public."Instructor"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4005 (class 2606 OID 262400)
-- Name: _CourseToPath _CourseToPath_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_CourseToPath"
    ADD CONSTRAINT "_CourseToPath_A_fkey" FOREIGN KEY ("A") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4006 (class 2606 OID 262405)
-- Name: _CourseToPath _CourseToPath_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_CourseToPath"
    ADD CONSTRAINT "_CourseToPath_B_fkey" FOREIGN KEY ("B") REFERENCES public."Path"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3981 (class 2606 OID 254362)
-- Name: _CourseToQuiz _CourseToQuiz_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_CourseToQuiz"
    ADD CONSTRAINT "_CourseToQuiz_A_fkey" FOREIGN KEY ("A") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3982 (class 2606 OID 254367)
-- Name: _CourseToQuiz _CourseToQuiz_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_CourseToQuiz"
    ADD CONSTRAINT "_CourseToQuiz_B_fkey" FOREIGN KEY ("B") REFERENCES public."Quiz"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4070 (class 2606 OID 311643)
-- Name: _FileToTraineeManagement _FileToTraineeManagement_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_FileToTraineeManagement"
    ADD CONSTRAINT "_FileToTraineeManagement_A_fkey" FOREIGN KEY ("A") REFERENCES public."File"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4071 (class 2606 OID 311648)
-- Name: _FileToTraineeManagement _FileToTraineeManagement_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_FileToTraineeManagement"
    ADD CONSTRAINT "_FileToTraineeManagement_B_fkey" FOREIGN KEY ("B") REFERENCES public."TraineeManagement"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3989 (class 2606 OID 254402)
-- Name: _GroupToPost _GroupToPost_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_GroupToPost"
    ADD CONSTRAINT "_GroupToPost_A_fkey" FOREIGN KEY ("A") REFERENCES public."Group"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3990 (class 2606 OID 254407)
-- Name: _GroupToPost _GroupToPost_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_GroupToPost"
    ADD CONSTRAINT "_GroupToPost_B_fkey" FOREIGN KEY ("B") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3987 (class 2606 OID 254392)
-- Name: _GroupToUser _GroupToUser_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_GroupToUser"
    ADD CONSTRAINT "_GroupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES public."Group"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3988 (class 2606 OID 254397)
-- Name: _GroupToUser _GroupToUser_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_GroupToUser"
    ADD CONSTRAINT "_GroupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3985 (class 2606 OID 254382)
-- Name: _LessonToUser _LessonToUser_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_LessonToUser"
    ADD CONSTRAINT "_LessonToUser_A_fkey" FOREIGN KEY ("A") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3986 (class 2606 OID 254387)
-- Name: _LessonToUser _LessonToUser_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_LessonToUser"
    ADD CONSTRAINT "_LessonToUser_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4015 (class 2606 OID 262450)
-- Name: _LiveRoomToUser _LiveRoomToUser_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_LiveRoomToUser"
    ADD CONSTRAINT "_LiveRoomToUser_A_fkey" FOREIGN KEY ("A") REFERENCES public."LiveRoom"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4016 (class 2606 OID 262455)
-- Name: _LiveRoomToUser _LiveRoomToUser_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_LiveRoomToUser"
    ADD CONSTRAINT "_LiveRoomToUser_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4007 (class 2606 OID 262410)
-- Name: _PathToUser _PathToUser_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_PathToUser"
    ADD CONSTRAINT "_PathToUser_A_fkey" FOREIGN KEY ("A") REFERENCES public."Path"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4008 (class 2606 OID 262415)
-- Name: _PathToUser _PathToUser_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_PathToUser"
    ADD CONSTRAINT "_PathToUser_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4072 (class 2606 OID 311653)
-- Name: _ReceivedMessages _ReceivedMessages_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_ReceivedMessages"
    ADD CONSTRAINT "_ReceivedMessages_A_fkey" FOREIGN KEY ("A") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4073 (class 2606 OID 311658)
-- Name: _ReceivedMessages _ReceivedMessages_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_ReceivedMessages"
    ADD CONSTRAINT "_ReceivedMessages_B_fkey" FOREIGN KEY ("B") REFERENCES public."InternalMessage"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4074 (class 2606 OID 311663)
-- Name: _TrainingScheduleToUser _TrainingScheduleToUser_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_TrainingScheduleToUser"
    ADD CONSTRAINT "_TrainingScheduleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES public."TrainingSchedule"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4075 (class 2606 OID 311668)
-- Name: _TrainingScheduleToUser _TrainingScheduleToUser_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."_TrainingScheduleToUser"
    ADD CONSTRAINT "_TrainingScheduleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4315 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: default
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- TOC entry 2442 (class 826 OID 278529)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- TOC entry 2441 (class 826 OID 278528)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO neon_superuser WITH GRANT OPTION;


-- Completed on 2025-07-08 16:42:54 EEST

--
-- PostgreSQL database dump complete
--

