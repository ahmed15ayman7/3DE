import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "./User.entity";
import { CommentEntity } from "./Comment.entity";
import { GroupEntity } from "./Group.entity";
import { CommunityEntity } from "./Community.entity";
import { DiscussionEntity } from "./Discussion.entity";
import { PublicRelationsRecordEntity } from "./PublicRelationsRecord.entity";
import {
  User,
  Comment,
  Group,
  Community,
  Discussion,
  PublicRelationsRecord,
} from "@shared/prisma";

import { Entity, Column } from "typeorm";
@Entity()
// This is the  Entity for Post
export class PostEntity {
  @ApiProperty({ type: "string" })
  // Field: id, Type: string
  @Column()
  id: string;

  @ApiProperty({ type: "string" })
  // Field: authorId, Type: string
  @Column()
  authorId: string;

  @ApiProperty({ type: UserEntity })
  // Field: author, Type: User
  @Column()
  author: User;

  @ApiProperty({ type: "string" })
  // Field: content, Type: string
  @Column()
  content: string;

  @ApiProperty({ type: "string", nullable: true })
  // Field: image, Type: string
  @Column()
  image?: string;

  @ApiProperty({ type: "string" })
  // Field: title, Type: string
  @Column()
  title: string;

  @ApiProperty({ type: "string", format: "date-time" })
  // Field: createdAt, Type: Date
  @Column()
  createdAt: Date;

  @ApiProperty({ type: "number" })
  // Field: likesCount, Type: number
  @Column()
  likesCount: number;

  @ApiProperty({ type: CommentEntity })
  // Field: comments, Type: Comment[]
  @Column()
  comments: Comment[];

  @ApiProperty({ type: GroupEntity })
  // Field: Group, Type: Group[]
  @Column()
  Group: Group[];

  @ApiProperty({ type: CommunityEntity })
  // Field: Community, Type: Community[]
  @Column()
  Community: Community[];

  @ApiProperty({ type: DiscussionEntity })
  // Field: Discussion, Type: Discussion[]
  @Column()
  Discussion: Discussion[];

  @ApiProperty({ type: PublicRelationsRecordEntity, nullable: true })
  // Field: PublicRelationsRecord, Type: PublicRelationsRecord
  @Column()
  PublicRelationsRecord?: PublicRelationsRecord;

  @ApiProperty({ type: "string", nullable: true })
  // Field: publicRelationsRecordId, Type: string
  @Column()
  publicRelationsRecordId?: string;
}
