import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommunityDto } from 'dtos/Community.create.dto';
import { UpdateCommunityDto } from 'dtos/Community.update.dto';
import { Community, Group, LiveRoom, Post } from '@shared/prisma';
import { CreateDiscussionDto } from 'dtos/Discussion.create.dto';
import { Discussion } from '@shared/prisma';
import { CreateLiveRoomDto } from 'dtos/LiveRoom.create.dto';
import { UpdateLiveRoomDto } from 'dtos/LiveRoom.update.dto';
import { UpdateDiscussionDto } from 'dtos/Discussion.update.dto';
@Injectable()
export class CommunitiesService {
    constructor(private prisma: PrismaService) { }

    async create(createCertificateInput: CreateCommunityDto): Promise<Community> {
        return this.prisma.community.create({
            data: createCertificateInput,
            include: {
                participants: true,
            },
        });
    }

    async findAll(): Promise<Community[]> {
        return this.prisma.community.findMany({
            include: {
                participants: true,
            },
        });
    }

    async findByStudent(userId: string): Promise<Community[]> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${user.id} not found`);
        }

        return this.prisma.community.findMany({
            where: {
                participants: {
                    some: {
                        id: user.id,
                    },
                },
            },
        });
    }

    async findOne(id: string): Promise<Community> {
        const certificate = await this.prisma.community.findUnique({
            where: { id },
            include: {
                participants: true,
            },
        });

        if (!certificate) {
            throw new NotFoundException(`Community with ID ${id} not found`);
        }

        return certificate;
    }

    async update(id: string, updateCertificateInput: UpdateCommunityDto): Promise<Community> {
        const community = await this.findOne(id);
        if (!community) {
            throw new NotFoundException(`Community with ID ${id} not found`);
        }

        return this.prisma.community.update({
            where: { id },
            data: updateCertificateInput,
            include: {
                participants: true,
            },
        });
    }

    async remove(id: string): Promise<Community> {
        const community = await this.findOne(id);
        if (!community) {
            throw new NotFoundException(`Community with ID ${id} not found`);
        }

        return this.prisma.community.delete({
            where: { id },
            include: {
                participants: true,
            },
        });
    }
    async addParticipant(communityId: string, userId: string): Promise<Community> {
        if(!userId || !communityId) {
            throw new BadRequestException('User ID and community ID are required');
        }
        const community = await this.findOne(communityId);
        if (!community) {
            throw new NotFoundException(`Community with ID ${communityId} not found`);
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        if (user.role !== 'STUDENT') {
            throw new BadRequestException('User is not a student');
        }
        return this.prisma.community.update({
            where: { id: community.id },
            data: { participants: { connect: { id: userId } } },
            include: {
                participants: true,
            },
        });
    }
    async removeParticipant(communityId: string, userId: string): Promise<Community> {
        const community = await this.findOne(communityId);
        if (!community) {
            throw new NotFoundException(`Community with ID ${communityId} not found`);
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        return this.prisma.community.update({
            where: { id: community.id },
            data: { participants: { disconnect: { id: userId } } },
            include: {
                participants: true,
            },
        });
    }

    async createDiscussion(communityId: string, discussion: CreateDiscussionDto): Promise<Discussion> {
        return this.prisma.discussion.create({
            data: {
                communityId,
                ...discussion,
            },
        });
    }

    async findAllDiscussions(communityId: string): Promise<Discussion[]> {
        return this.prisma.discussion.findMany({
            where: { communityId },
            include: {
                post: {
                    include: {
                        author: true,
                        comments: true,
                    },
                },
            },
        });
    }
    async findAllDiscussionsByCommunityId(communityId: string): Promise<Discussion[]> {
        return this.prisma.discussion.findMany({
            where: { communityId },
        });
    }
    async findDiscussionById(discussionId: string): Promise<Discussion> {
        return this.prisma.discussion.findUnique({
            where: { id: discussionId },
        });
    }
    async updateDiscussion(discussionId: string, discussion: UpdateDiscussionDto): Promise<Discussion> {
        return this.prisma.discussion.update({
            where: { id: discussionId },
            data: discussion,
        });
    }
    async deleteDiscussion(discussionId: string): Promise<Discussion> {
        return this.prisma.discussion.delete({
            where: { id: discussionId },
        });
    }
    async createLiveRoom(communityId: string, liveRoom: CreateLiveRoomDto): Promise<LiveRoom> {
        return this.prisma.liveRoom.create({
            data: {
                communityId,
                ...liveRoom,
            },
        });
    }
    async updateLiveRoom(liveRoomId: string, liveRoom: UpdateLiveRoomDto): Promise<LiveRoom> {
        return this.prisma.liveRoom.update({
            where: { id: liveRoomId },
            data: liveRoom,
        });
    }
    async getLiveRooms(communityId: string): Promise<LiveRoom[]> {
        const community = await this.findOne(communityId);
        if (!community) {
            throw new NotFoundException(`Community with ID ${communityId} not found`);
        }
        return this.prisma.liveRoom.findMany({
            where: { communityId: community.id },
        });
    }
    async getLiveRoom(liveRoomId: string): Promise<LiveRoom> {
        return this.prisma.liveRoom.findUnique({
            where: { id: liveRoomId },
        });
    }
    async deleteLiveRoom(liveRoomId: string): Promise<LiveRoom> {
        return this.prisma.liveRoom.delete({
            where: { id: liveRoomId },
        });
    }
    async getGroups(communityId: string): Promise<Group[]> {
        return this.prisma.group.findMany({
            where: { Community: { some: { id: communityId } } },
            include: {
                members: true,
            },
        });
    }
    async addGroup(groupId: string, communityId: string): Promise<Group> {
        return this.prisma.group.update({
            where: { id: groupId },
            data: { Community: { connect: { id: communityId } } },
        });
    }
    async removeGroup(groupId: string, communityId: string): Promise<Group> {
        return this.prisma.group.update({
            where: { id: groupId },
            data: { Community: { disconnect: { id: communityId } } },
        });
    }
    async getGroup(groupId: string): Promise<Group> {
        return this.prisma.group.findUnique({
            where: { id: groupId },
        });
    }
    async getPosts(communityId: string): Promise<Post[]> {
        return this.prisma.post.findMany({
            where: { Community: { some: { id: communityId } } },
        });
    }
}