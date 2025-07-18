import { ApiProperty } from "@nestjs/swagger";
import { AdminEntity } from "./Admin.entity";
import { AcademyEntity } from "./Academy.entity";
import { Admin, Academy } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the  Entity for CSRProject
export class CSRProjectDto {
  @ApiProperty({ type: "string" })
  // Field: id, Type: string
  @Column()
  id: string;

  @ApiProperty({ type: "string" })
  // Field: title, Type: string
  @Column()
  title: string;

  @ApiProperty({ type: "string" })
  // Field: description, Type: string
  @Column()
  description: string;

  @ApiProperty({ type: "string" })
  // Field: impact, Type: string
  @Column()
  impact: string;

  @ApiProperty({ type: "string" })
  // Field: images, Type: string[]
  @Column()
  images: string[];

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: startDate, Type: Date
  @Column()
  startDate: Date;

  @ApiProperty({ type: "string" })
  // Field: status, Type: string
  @Column()
  status: string;

  @ApiProperty({ type: "string" })
  // Field: assignedTeamId, Type: string
  @Column()
  assignedTeamId: string;

  @ApiProperty({ type: AdminEntity })
  // Field: assignedTeam, Type: Admin
  @Column()
  assignedTeam: Admin;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: updatedAt, Type: Date
  @Column()
  updatedAt: Date;

  @ApiProperty({ type: AcademyEntity })
  // Field: Academy, Type: Academy[]
  @Column()
  Academy: Academy[];
}
