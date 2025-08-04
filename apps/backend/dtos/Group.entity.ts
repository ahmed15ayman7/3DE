import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "./User.entity";
import { PostEntity } from "./Post.entity";
import { AdminEntity } from "./Admin.entity";
import { CommunityEntity } from "./Community.entity";
import { User, Post, Admin, Community } from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the  Entity for Group
export class GroupEntity {
  @ApiProperty({ type: "string" })
  // Field: id, Type: string
  @Column()
  id: string;

  @ApiProperty({ type: "string" })
  // Field: name, Type: string
  @Column()
  name: string;

  @ApiProperty({ type: "string" })
  // Field: subject, Type: string
  @Column()
  subject: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: image, Type: string
  @Column()
  image?: string;

  @ApiProperty({ type: UserEntity })
  // Field: members, Type: User[]
  @Column()
  members: User[];

  @ApiProperty({ type: "string" })
  // Field: adminId, Type: string
  @Column()
  adminId: string;

  @ApiProperty({ type: PostEntity })
  // Field: posts, Type: Post[]
  @Column()
  posts: Post[];

  @ApiProperty({ type: AdminEntity })
  // Field: admin, Type: Admin
  @Column()
  admin: Admin;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;

  @ApiProperty({ type: CommunityEntity, nullable: true })
  // Field: Community, Type: Community
  @Column()
  Community?: Community;

  @ApiProperty({ type: "string", nullable: true })
  // Field: communityId, Type: string
  @Column()
  communityId?: string;
}
