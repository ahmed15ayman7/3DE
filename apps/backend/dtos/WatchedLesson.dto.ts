import { ApiProperty } from "@nestjs/swagger";
import { LessonEntity } from "./Lesson.entity";
import { UserEntity } from "./User.entity";
import { Lesson, User } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the  Entity for WatchedLesson
export class WatchedLessonDto {
  @ApiProperty({ type: "string" })
  // Field: id, Type: string
  @Column()
  id: string;

  @ApiProperty({ type: "number" })
  // Field: progress, Type: number
  @Column()
  progress: number;

  @ApiProperty({ type: "string" })
  // Field: lessonId, Type: string
  @Column()
  lessonId: string;

  @ApiProperty({ type: LessonEntity })
  // Field: lesson, Type: Lesson
  @Column()
  lesson: Lesson;

  @ApiProperty({ type: "string" })
  // Field: userId, Type: string
  @Column()
  userId: string;

  @ApiProperty({ type: UserEntity })
  // Field: user, Type: User
  @Column()
  user: User;
}
