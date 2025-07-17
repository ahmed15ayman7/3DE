import { ApiProperty } from "@nestjs/swagger";
import { Lesson, User } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Update Entity for WatchedLesson
export class UpdateWatchedLessonDto {
  @ApiProperty({ type: "number" })
  // Field: progress, Type: number
  @Column()
  progress: number;

  @ApiProperty({ type: "string" })
  // Field: lessonId, Type: string
  @Column()
  lessonId: string;

  @ApiProperty({ type: "string" })
  // Field: userId, Type: string
  @Column()
  userId: string;
}
