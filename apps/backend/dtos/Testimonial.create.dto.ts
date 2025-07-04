import { ApiProperty } from "@nestjs/swagger";
import { Course, Academy } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Create Entity for Testimonial
export class CreateTestimonialDto {
  @ApiProperty({ type: "string" })
  // Field: name, Type: string
  @Column()
  name: string;

  @ApiProperty({ type: "string" })
  // Field: feedback, Type: string
  @Column()
  feedback: string;

  @ApiProperty({ type: "number" })
  // Field: rating, Type: number
  @Column()
  rating: number;

  @ApiProperty({ type: "string" })
  // Field: image, Type: string
  @Column()
  image?: string;

  @ApiProperty({ type: "string" })
  // Field: videoUrl, Type: string
  @Column()
  videoUrl?: string;

  @ApiProperty({ type: "string" })
  // Field: courseId, Type: string
  @Column()
  courseId?: string;

  @ApiProperty({ type: "string" })
  // Field: academyId, Type: string
  @Column()
  academyId: string;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: updatedAt, Type: Date
  @Column()
  updatedAt: Date;
}
