import { ApiProperty } from "@nestjs/swagger";
import { Option, Quiz } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Create Entity for Question
export class CreateQuestionDto {
  @ApiProperty({ type: "string" })
  // Field: text, Type: string
  @Column()
  text: string;

  @ApiProperty({ type: "string" })
  // Field: image, Type: string
  @Column()
  image?: string;

  @ApiProperty({ type: "string" })
  // Field: type, Type: string
  @Column()
  type: string;

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

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;
}
