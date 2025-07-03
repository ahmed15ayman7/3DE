import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from '../../dtos/Community.create.dto';
import { UpdateCommunityDto } from '../../dtos/Community.update.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Community, Discussion, Group, LiveRoom, Post as PrismaPost } from '@shared/prisma';
import { CreateDiscussionDto } from 'dtos/Discussion.create.dto';
import { CreateLiveRoomDto } from 'dtos/LiveRoom.create.dto';
import { UpdateDiscussionDto } from 'dtos/Discussion.update.dto';
import { UpdateLiveRoomDto } from 'dtos/LiveRoom.update.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('المجتمعات')
@Controller('communities')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class CommunitiesController {
    constructor(private readonly communitiesService: CommunitiesService) { }

    @Post()
    async create(@Body() createCommunityDto: CreateCommunityDto): Promise<Community> {
        return this.communitiesService.create(createCommunityDto);
    }

    @Get()
    async findAll(): Promise<Community[]> {
        return this.communitiesService.findAll();
    }

    @Get('student')
    async findByStudent(@Query('userId') userId: string): Promise<Community[]> {
        return this.communitiesService.findByStudent(userId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Community> {
        return this.communitiesService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCommunityDto: UpdateCommunityDto,
    ): Promise<Community> {
        return this.communitiesService.update(id, updateCommunityDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Community> {
        return this.communitiesService.remove(id);
    }

    @Post(':id/participants/:userId')
    async addParticipant(@Param('id') id: string, @Param('userId') userId: string): Promise<Community> {
        return this.communitiesService.addParticipant(id, userId);
    }

    @Delete(':id/participants/:userId')
    async removeParticipant(@Param('id') id: string, @Param('userId') userId: string): Promise<Community> {
        return this.communitiesService.removeParticipant(id, userId);
    }

    @Post(':id/discussions')
    async createDiscussion(
        @Param('id') id: string,
        @Body() createDiscussionDto: CreateDiscussionDto,
    ): Promise<Discussion> {
        return this.communitiesService.createDiscussion(id, createDiscussionDto);
    }

    @Get(':id/discussions')
    async findAllDiscussions(@Param('id') id: string): Promise<Discussion[]> {
        return this.communitiesService.findAllDiscussions(id);
    }

    @Get(':id/discussions/by-community-id')
    async findAllDiscussionsByCommunityId(@Param('id') id: string): Promise<Discussion[]> {
        return this.communitiesService.findAllDiscussionsByCommunityId(id);
    }

    @Get(':id/discussions/:discussionId')
    async findDiscussion(@Param('discussionId') id: string): Promise<Discussion> {
        return this.communitiesService.findDiscussionById(id);
    }

    @Put(':id/discussions/:discussionId')
    async updateDiscussion(@Param('discussionId') discussionId: string, @Body() updateDiscussionDto: UpdateDiscussionDto): Promise<Discussion> {
        return this.communitiesService.updateDiscussion(discussionId, updateDiscussionDto);
    }

    @Delete(':id/discussions/:discussionId')
    async deleteDiscussion(@Param('discussionId') discussionId: string): Promise<Discussion> {
        return this.communitiesService.deleteDiscussion(discussionId);
    }

    @Post(':id/live-rooms')
    async createLiveRoom(
        @Param('id') id: string,
        @Body() createLiveRoomDto: CreateLiveRoomDto,
    ): Promise<LiveRoom> {
        return this.communitiesService.createLiveRoom(id, createLiveRoomDto);
    }

    @Get(':id/live-rooms')
    async getLiveRooms(@Param('id') id: string): Promise<LiveRoom[]> {
        return this.communitiesService.getLiveRooms(id);
    }

    @Get(':id/live-rooms/:liveRoomId')
    async getLiveRoom(@Param('liveRoomId') liveRoomId: string): Promise<LiveRoom> {
        return this.communitiesService.getLiveRoom(liveRoomId);
    }

    @Put(':id/live-rooms/:liveRoomId')
    async updateLiveRoom(@Param('liveRoomId') liveRoomId: string, @Body() updateLiveRoomDto: UpdateLiveRoomDto): Promise<LiveRoom> {
        return this.communitiesService.updateLiveRoom(liveRoomId, updateLiveRoomDto);
    }

    @Delete(':id/live-rooms/:liveRoomId')
    async deleteLiveRoom(@Param('liveRoomId') liveRoomId: string): Promise<LiveRoom> {
        return this.communitiesService.deleteLiveRoom(liveRoomId);
    }

    @Get(':id/groups')
    async getGroups(@Param('id') id: string): Promise<Group[]> {
        return this.communitiesService.getGroups(id);
    }

    @Post(':id/groups')
    async addGroup(@Param('id') id: string, @Param('groupId') groupId: string): Promise<Group> {
        return this.communitiesService.addGroup(id, groupId);
    }

    @Delete(':id/groups/:groupId')
    async removeGroup(@Param('id') id: string, @Param('groupId') groupId: string): Promise<Group> {
        return this.communitiesService.removeGroup(groupId, id);
    }

    @Get(':id/groups/:groupId')
    async getGroup(@Param('groupId') groupId: string): Promise<Group> {
        return this.communitiesService.getGroup(groupId);
    }

    @Get(':id/posts')
    async getPosts(@Param('id') id: string): Promise<PrismaPost[]> {
        return this.communitiesService.getPosts(id);
    }
} 