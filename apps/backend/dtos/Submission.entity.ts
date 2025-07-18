import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "./User.entity";
import { QuizEntity } from "./Quiz.entity";
import { User, Quiz } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the  Entity for Submission
export class SubmissionEntity {
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

  @ApiProperty({ type: "string" })
  // Field: quizId, Type: string
  @Column()
  quizId: string;

  @ApiProperty({ type: QuizEntity })
  // Field: quiz, Type: Quiz
  @Column()
  quiz: Quiz;

  @ApiProperty({ additionalProperties: true, type: "object" })
  // Field: answers, Type: object[]
  @Column()
  answers: object[];

  @ApiProperty({ type: "number", nullable: true })
  // Field: score, Type: number
  @Column()
  score?: number;

  @ApiProperty({ type: "string", nullable: true })
  // Field: feedback, Type: string
  @Column()
  feedback?: string;

  @ApiProperty({ type: "number", nullable: true })
  // Field: timeLimit, Type: number
  @Column()
  timeLimit?: number;

  @ApiProperty({ type: "boolean", nullable: true })
  // Field: passed, Type: boolean
  @Column()
  passed?: boolean;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: updatedAt, Type: Date
  @Column()
  updatedAt: Date;
}
