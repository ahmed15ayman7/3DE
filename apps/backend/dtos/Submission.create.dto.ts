import { ApiProperty } from "@nestjs/swagger";
import { User, Quiz } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Create Entity for Submission
export class CreateSubmissionDto {
  @ApiProperty({ type: "string" })
  // Field: userId, Type: string
  @Column()
  userId: string;

  @ApiProperty({ type: "string" })
  // Field: quizId, Type: string
  @Column()
  quizId: string;

  @ApiProperty({ additionalProperties: true, type: "object" })
  // Field: answers, Type: object[]
  @Column()
  answers: object[];

  @ApiProperty({ type: "number" })
  // Field: score, Type: number
  @Column()
  score?: number;

  @ApiProperty({ type: "string" })
  // Field: feedback, Type: string
  @Column()
  feedback?: string;

  @ApiProperty({ type: "number" })
  // Field: timeLimit, Type: number
  @Column()
  timeLimit?: number;

  @ApiProperty({ type: "boolean" })
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
