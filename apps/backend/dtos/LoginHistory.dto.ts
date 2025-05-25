import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "./User.entity";
import { User, LoginDevice } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the  Entity for LoginHistory
export class LoginHistoryDto {
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

  @ApiProperty({ type: "boolean" })
  // Field: success, Type: boolean
  @Column()
  success: boolean;

  @ApiProperty({ type: "string", nullable: true })
  // Field: ip, Type: string
  @Column()
  ip?: string;

  @ApiProperty({ enum: LoginDevice, nullable: true })
  // Field: device, Type: LoginDevice
  @Column()
  device?: LoginDevice;

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
