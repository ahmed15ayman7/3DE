'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { communityApi } from '@3de/apis';
import Layout from '../../../components/layout/Layout';
import { TabsController } from '../../../components/common/TabsController';
import { PostCard } from '../../../components/community/PostCard';
import { JoinButton } from '../../../components/community/JoinButton';
import { Card, Skeleton, Alert, Button, Avatar } from '@3de/ui';
import { Users, MessageCircle, Video, UserPlus, Calendar, MapPin } from 'lucide-react';
import { Community, User, Post, Discussion, LiveRoom, Group } from '@3de/interfaces';
import { useAuth } from '@3de/auth';
import { sanitizeApiResponse } from '../../../lib/utils';

const tabs = [
  { id: 'posts', label: 'المنشورات', icon: <MessageCircle className="w-4 h-4" /> },
  { id: 'discussions', label: 'المناقشات', icon: <Users className="w-4 h-4" /> },
  { id: 'liverooms', label: 'الغرف المباشرة', icon: <Video className="w-4 h-4" /> },
  { id: 'groups', label: 'المجموعات', icon: <UserPlus className="w-4 h-4" /> }
];

export default function CommunityPage() {
  const params = useParams();
  const communityId = params.id as string;
  const [activeTab, setActiveTab] = useState('posts');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // جلب معلومات المجتمع
  const { data: communityData, isLoading: communityLoading, error: communityError } = useQuery({
    queryKey: ['community', communityId],
    queryFn: () => communityApi.getById(communityId),
    enabled: !!communityId
  });

  // جلب منشورات المجتمع
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['community-posts', communityId],
    queryFn: () => communityApi.getPosts(communityId),
    enabled: !!communityId && activeTab === 'posts'
  });

  const community = sanitizeApiResponse(communityData?.data) as Community & { participants: User[] };
  const posts = sanitizeApiResponse(postsData || []) as (Post & { author: User; comments: any[] })[];

  // التحقق من عضوية المستخدم
  const isMember = community?.participants?.some(participant => participant.id === user?.id) || false;

  // طفرات الانضمام والمغادرة
  const joinMutation = useMutation({
    mutationFn: (communityId: string) => communityApi.addParticipant(communityId, user?.id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', communityId] });
    }
  });

  const leaveMutation = useMutation({
    mutationFn: (communityId: string) => communityApi.removeParticipant(communityId, user?.id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', communityId] });
    }
  });

  const handleJoinCommunity = async (communityId: string) => {
    try {
      await joinMutation.mutateAsync(communityId);
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const handleLeaveCommunity = async (communityId: string) => {
    try {
      await leaveMutation.mutateAsync(communityId);
    } catch (error) {
      console.error('Error leaving community:', error);
    }
  };

  const handleLikePost = (postId: string) => {
    // تنفيذ الإعجاب بالمنشور
    console.log('Like post:', postId);
  };

  const handleCommentPost = (postId: string, content: string) => {
    // تنفيذ التعليق على المنشور
    console.log('Comment on post:', postId, content);
  };

  const handleSharePost = (postId: string) => {
    // تنفيذ مشاركة المنشور
    console.log('Share post:', postId);
  };

  if (communityError) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="error" title="خطأ في تحميل البيانات">
            حدث خطأ أثناء تحميل المجتمع. يرجى المحاولة مرة أخرى.
          </Alert>
        </div>
      </Layout>
    );
  }

  if (communityLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* رأس المجتمع */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 gap-reverse mb-4">
                  <Avatar
                    src={community?.image}
                    alt={community?.name}
                    size="lg"
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {community?.name}
                    </h1>
                    <p className="text-gray-600 text-lg">
                      {community?.description || 'لا يوجد وصف للمجتمع'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="flex items-center gap-2 gap-reverse text-gray-600">
                    <Users className="w-5 h-5" />
                    <span>{community?.participants?.length || 0} عضو</span>
                  </div>
                  
                  <div className="flex items-center gap-2 gap-reverse text-gray-600">
                    <MessageCircle className="w-5 h-5" />
                    <span>{posts?.length || 0} منشور</span>
                  </div>
                  
                  <div className="flex items-center gap-2 gap-reverse text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>
                      تم الإنشاء في {community?.createdAt 
                        ? new Date(community.createdAt).toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'long'
                          })
                        : 'غير محدد'
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="ml-6">
                <JoinButton
                  communityId={communityId}
                  isMember={isMember}
                  onJoin={handleJoinCommunity}
                  onLeave={handleLeaveCommunity}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* التبويبات */}
        <div className="mb-8">
          <TabsController
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* محتوى التبويبات */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {postsLoading ? (
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-64" />
                    ))}
                  </div>
                ) : posts.length > 0 ? (
                  <div className="space-y-6">
                    {posts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onLike={handleLikePost}
                        onComment={handleCommentPost}
                        onShare={handleSharePost}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      لا توجد منشورات
                    </h3>
                    <p className="text-gray-500">
                      كن أول من ينشر في هذا المجتمع
                    </p>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'discussions' && (
              <div className="space-y-6">
                <Card className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    المناقشات
                  </h3>
                  <p className="text-gray-500">
                    قريباً - ستتمكن من المشاركة في المناقشات
                  </p>
                </Card>
              </div>
            )}

            {activeTab === 'liverooms' && (
              <div className="space-y-6">
                <Card className="p-8 text-center">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    الغرف المباشرة
                  </h3>
                  <p className="text-gray-500">
                    قريباً - ستتمكن من الانضمام للغرف المباشرة
                  </p>
                </Card>
              </div>
            )}

            {activeTab === 'groups' && (
              <div className="space-y-6">
                <Card className="p-8 text-center">
                  <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    المجموعات
                  </h3>
                  <p className="text-gray-500">
                    قريباً - ستتمكن من الانضمام للمجموعات
                  </p>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  );
} 