'use client';

import React, { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { communityApi, postApi, userApi } from '@3de/apis';
import Layout from '../../components/layout/Layout';
import { TabsController } from '../../components/common/TabsController';
import { CommunityCard } from '../../components/community/CommunityCard';
import { PostCard } from '../../components/community/PostCard';
import { InfiniteLoader } from '../../components/common/InfiniteLoader';
import { Card, Skeleton, Alert, Button, Modal, Input, Textarea } from '@3de/ui';
import { Users, MessageCircle, Video, UserPlus, Plus, Image as ImageIcon } from 'lucide-react';
import { Community, User, Post, Discussion, LiveRoom, Group } from '@3de/interfaces';
import { useAuth } from '@3de/auth';
import { sanitizeApiResponse } from '../../lib/utils';

const tabs = [
  { id: 'posts', label: 'المنشورات', icon: <MessageCircle className="w-4 h-4" /> },
  { id: 'discussions', label: 'المناقشات', icon: <Users className="w-4 h-4" /> },
  { id: 'liverooms', label: 'الغرف المباشرة', icon: <Video className="w-4 h-4" /> },
  { id: 'groups', label: 'المجموعات', icon: <UserPlus className="w-4 h-4" /> }
];

export default function CommunitiesPage() {
  const [activeTab, setActiveTab] = useState('posts');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click(); // فتح نافذة اختيار الملف
  };
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''); // 👈 غيّرها
    formData.append("folder", "uploads");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        console.log("🔗 Uploaded Image URL:", data.secure_url);
        setImageUrl(data.secure_url);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ فشل رفع الصورة!");
    }
  };


  // جلب المجتمعات
  const { data: communitiesData, isLoading: communitiesLoading, error: communitiesError } = useQuery({
    queryKey: ['communities'],
    queryFn: () => communityApi.getAll(),
  });

  // جلب المنشورات
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['posts', 'all'],
    queryFn: () => postApi.getAll(),
    enabled: activeTab === 'posts'
  });

  const communities = sanitizeApiResponse(communitiesData?.data || []) as (Community & { participants: User[] })[];
  const posts = sanitizeApiResponse(postsData?.data || []) as (Post & { author: User; comments: any[] })[];

  // تصنيف المجتمعات
  const myCommunities = communities.filter(community => 
    community.participants?.some(participant => participant.id === user?.id)
  );
  const otherCommunities = communities.filter(community => 
    !community.participants?.some(participant => participant.id === user?.id)
  );

  // طفرات الانضمام والمغادرة
  const joinMutation = useMutation({
    mutationFn: (communityId: string) => communityApi.addParticipant(communityId, user?.id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    }
  });

  const leaveMutation = useMutation({
    mutationFn: (communityId: string) => communityApi.removeParticipant(communityId, user?.id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    }
  });

  // طفرة إنشاء منشور
  const createPostMutation = useMutation({
    mutationFn: (data: { content: string; title: string; image?: string }) =>{
      console.log(user);
      return postApi.create({...data, authorId: user?.id || '',});
    },
    onSuccess: () => {
      setShowCreatePost(false);
      setPostContent('');
      setPostTitle('');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
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

  const handleCreatePost = () => {
    if (postContent.trim()) {
      createPostMutation.mutate({ content: postContent, title: postTitle, image: imageUrl || undefined });
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

  if (communitiesError) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="error" title="خطأ في تحميل البيانات">
            حدث خطأ أثناء تحميل المجتمعات. يرجى المحاولة مرة أخرى.
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* رأس الصفحة */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">المجتمع</h1>
              <p className="text-gray-600">
                انضم للمجتمعات وشارك في المناقشات
              </p>
            </div>
            
            {activeTab === 'posts' && (
              <Button
                onClick={() => setShowCreatePost(true)}
                variant="primary"
                icon={<Plus className="w-4 h-4" />}
              >
                منشور جديد
              </Button>
            )}
          </div>
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
                {/* المنشورات */}
                <InfiniteLoader
                  onLoadMore={() => {}}
                  hasMore={false}
                  isLoading={false}
                >
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
                        كن أول من ينشر في المجتمع
                      </p>
                    </Card>
                  )}
                </InfiniteLoader>
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

        {/* قسم المجتمعات */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">المجتمعات</h2>
          
          {/* مجتمعاتي */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">مجتمعاتي</h3>
            {communitiesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : myCommunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCommunities.map((community) => (
                  <CommunityCard
                    key={community.id}
                    community={community}
                    isMember={true}
                    onJoin={handleJoinCommunity}
                    onLeave={handleLeaveCommunity}
                    onClick={(id) => window.location.href = `/communities/${id}`}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  لم تنضم لأي مجتمع بعد
                </h3>
                <p className="text-gray-500">
                  انضم للمجتمعات المتاحة لبدء التفاعل
                </p>
              </Card>
            )}
          </div>

          {/* مجتمعات أخرى */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">مجتمعات أخرى</h3>
            {communitiesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : otherCommunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherCommunities.map((community) => (
                  <CommunityCard
                    key={community.id}
                    community={community}
                    isMember={false}
                    onJoin={handleJoinCommunity}
                    onLeave={handleLeaveCommunity}
                    onClick={(id) => window.location.href = `/communities/${id}`}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  لا توجد مجتمعات أخرى متاحة
                </h3>
                <p className="text-gray-500">
                  انضمت لجميع المجتمعات المتاحة
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Modal إنشاء منشور */}
        <Modal
          className='w-full max-w-md'
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          title="منشور جديد"
        >
          <div className="space-y-4">
            {/* i need create image component w=2h if imageUrl is not null  */}
            {imageUrl && (
              <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                <img src={imageUrl} alt="Post Image" className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان
              </label>
              <Input
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="أضف عنواناً للمنشور..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المحتوى
              </label>
              <Textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="اكتب منشورك هنا..."
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                variant="ghost"
                icon={<ImageIcon className="w-4 h-4" />}
                onClick={handleUploadClick}
              >
                إضافة صورة
              </Button>
              
              <div className="flex gap-2 gap-reverse">
                <Button
                  variant="outline"
                  onClick={() => setShowCreatePost(false)}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleCreatePost}
                  disabled={!postContent.trim() || createPostMutation.isPending}
                  loading={createPostMutation.isPending}
                >
                  نشر
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
} 