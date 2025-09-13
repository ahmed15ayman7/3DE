import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "./User.entity";
import { ParentEntity } from "./Parent.entity";
import { User, ChildStatus, Parent } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the  Entity for Child
export class ChildEntity {
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

  @ApiProperty({ type: ParentEntity })
  // Field: parent, Type: Parent
  @Column()
  parent: Parent;
}
