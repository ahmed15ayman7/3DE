import { ApiProperty } from "@nestjs/swagger";
import { User } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the Update Entity for LoginHistory
export class UpdateLoginHistoryDto {
  @ApiProperty({ type: "string" })
  // Field: userId, Type: string
  @Column()
  userId: string;

  @ApiProperty({ type: "boolean" })
  // Field: success, Type: boolean
  @Column()
  success: boolean;

  @ApiProperty({ type: "string", nullable: true })
  // Field: ip, Type: string
  @Column()
  ip?: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: device, Type: string
  @Column()
  device?: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: location, Type: string
  @Column()
  location?: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: browser, Type: string
  @Column()
  browser?: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: os, Type: string
  @Column()
  os?: string;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;
}
