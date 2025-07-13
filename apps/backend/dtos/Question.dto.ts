import { ApiProperty } from "@nestjs/swagger";
import { OptionEntity } from "./Option.entity";
import { QuizEntity } from "./Quiz.entity";
import { Option, Quiz } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the  Entity for Question
export class QuestionDto {
  @ApiProperty({ type: "string" })
  // Field: id, Type: string
  @Column()
  id: string;

  @ApiProperty({ type: "string" })
  // Field: text, Type: string
  @Column()
  text: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: image, Type: string
  @Column()
  image?: string;

  @ApiProperty({ type: "string" })
  // Field: type, Type: string
  @Column()
  type: string;

  @ApiProperty({ type: OptionEntity })
  // Field: options, Type: Option[]
  @Column()
  options: Option[];

  @ApiProperty({ type: "boolean" })
  // Field: isMultiple, Type: boolean
  @Column()
  isMultiple: boolean;

  @ApiProperty({ type: "number" })
  // Field: points, Type: number
  @Column()
  points: number;

  @ApiProperty({ type: "boolean" })
  // Field: isAnswered, Type: boolean
  @Column()
  isAnswered: boolean;

  @ApiProperty({ type: "string" })
  // Field: quizId, Type: string
  @Column()
  quizId: string;

  @ApiProperty({ type: QuizEntity })
  // Field: quiz, Type: Quiz
  @Column()
  quiz: Quiz;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;
}
