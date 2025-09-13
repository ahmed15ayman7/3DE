import { ApiProperty } from "@nestjs/swagger";
import { User, ChildStatus, Parent } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Create Entity for Child
export class CreateChildDto {
  @ApiProperty({ type: "string" })
  // Field: userId, Type: string
  @Column()
  userId: string;

  @ApiProperty({ enum: ChildStatus })
  // Field: status, Type: ChildStatus
  @Column()
  status: ChildStatus;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: updatedAt, Type: Date
  @Column()
  updatedAt: Date;

  @ApiProperty({ type: "string" })
  // Field: parentId, Type: string
  @Column()
  parentId: string;
}
