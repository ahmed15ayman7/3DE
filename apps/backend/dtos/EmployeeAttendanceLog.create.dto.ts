import { ApiProperty } from "@nestjs/swagger";
import { User, Admin } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Create Entity for EmployeeAttendanceLog
export class CreateEmployeeAttendanceLogDto {
  @ApiProperty({ type: "string" })
  // Field: employeeId, Type: string
  @Column()
  employeeId: string;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: checkIn, Type: Date
  @Column()
  checkIn: Date;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: checkOut, Type: Date
  @Column()
  checkOut?: Date;

  @ApiProperty({ type: "string" })
  // Field: status, Type: string
  @Column()
  status: string;

  @ApiProperty({ type: "string" })
  // Field: notes, Type: string
  @Column()
  notes?: string;

  @ApiProperty({ type: "string" })
  // Field: secretaryId, Type: string
  @Column()
  secretaryId: string;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: updatedAt, Type: Date
  @Column()
  updatedAt: Date;
}
