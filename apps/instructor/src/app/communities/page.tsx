'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input, Button, Tabs, LoadingAnimation, Alert } from '@3de/ui';
import { Plus, Search, Filter, Users, MessageSquare, Video, Settings } from 'lucide-react';
import { useCommunities, usePosts, useCreatePost, useLikePost } from '../../hooks/useInstructorQueries';
import PostCard from '../../components/PostCard';
import PostDetails from '../../components/PostDetails';

// Types from interfaces
import { Community, Post, Discussion, LiveRoom, Group, User, Comment } from '@3de/interfaces';

const CommunitiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');

  // Mock current user - في التطبيق الحقيقي سيتم الحصول عليه من السياق
  const currentUser: User = {
    id: 'instructor-1',
    email: 'instructor@3de.school',
    password: '',
    firstName: 'أحمد',
    lastName: 'محمد',
    role: 'INSTRUCTOR',
    avatar: '/instructor-avatar.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    isOnline: true,
    isVerified: true,
    enrollments: [],
    achievements: [],
    notifications: [],
    messages: [],
    posts: [],
    groups: [],
    channels: [],
    bookmarks: [],
    Submission: [],
    Attendance: [],
    payments: [],
    installments: [],
    Instructor: [],
    Owner: [],
    Admin: [],
    Lesson: [],
    Report: [],
    Badge: [],
    Certificate: [],
    Community: [],
    LiveRoom: [],
    NotificationSettings: [],
    Path: [],
    LoginHistory: [],
    TwoFactor: [],
    UserAcademyCEO: [],
    SalaryPayment: [],
    MeetingParticipant: [],
    LegalCase: [],
    traineeManagement: [],
    trainingSchedules: [],
    employeeAttendanceLogs: [],
    Comment: [],
    LessonBlockList: [],
  };

  // React Query hooks
  const { data: communities, isLoading: communitiesLoading, error: communitiesError } = useCommunities();
  const { data: posts, isLoading: postsLoading, error: postsError } = usePosts();
  const createPostMutation = useCreatePost();
  const likePostMutation = useLikePost();

  // Tab configuration
  const tabs = [
    { id: 'posts', label: 'المنشورات', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'discussions', label: 'النقاشات', icon: <Users className="w-4 h-4" /> },
    { id: 'live-rooms', label: 'الغرف المباشرة', icon: <Video className="w-4 h-4" /> },
    { id: 'groups', label: 'المجموعات', icon: <Settings className="w-4 h-4" /> },
  ];

  // Event handlers
  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    try {
      await createPostMutation.mutateAsync({
        title: newPostTitle,
        content: newPostContent,
        authorId: currentUser.id,
      });
      setNewPostTitle('');
      setNewPostContent('');
      setShowCreatePost(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await likePostMutation.mutateAsync(postId);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentPost = async (postId: string, content: string) => {
    // Implement comment creation logic
    console.log('Comment on post:', postId, content);
  };

  const handleSharePost = (postId: string) => {
    // Implement share logic
    console.log('Share post:', postId);
  };

  const handleEditPost = (postId: string) => {
    // Implement edit logic
    console.log('Edit post:', postId);
  };

  const handleDeletePost = (postId: string) => {
    // Implement delete logic
    console.log('Delete post:', postId);
  };

  // Filter posts based on search term
  const filteredPosts = posts?.data?.filter((post: Post) =>
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const renderPostsTab = () => (
    <div className="space-y-6">
      {/* Create Post Section */}
      <div className="bg-white rounded-lg shadow-custom border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">إنشاء منشور جديد</h3>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreatePost(!showCreatePost)}
            icon={<Plus className="w-4 h-4" />}
          >
            {showCreatePost ? 'إلغاء' : 'منشور جديد'}
          </Button>
        </div>

        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <Input
              label="عنوان المنشور"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="اكتب عنواناً لمنشورك..."
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                محتوى المنشور
              </label>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="شارك أفكارك وخبراتك مع المجتمع..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => setShowCreatePost(false)}
              >
                إلغاء
              </Button>
              <Button
                variant="primary"
                onClick={handleCreatePost}
                loading={createPostMutation.isPending}
                disabled={!newPostTitle.trim() || !newPostContent.trim()}
              >
                نشر
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Posts List */}
      {postsLoading ? (
        <div className="flex justify-center py-12">
          <LoadingAnimation size="lg" text="جاري تحميل المنشورات..." />
        </div>
      ) : postsError ? (
        <Alert variant="error" title="خطأ في تحميل المنشورات">
          حدث خطأ أثناء تحميل المنشورات. يرجى المحاولة مرة أخرى.
        </Alert>
      ) : filteredPosts.length > 0 ? (
        <div className="space-y-6">
          {filteredPosts.map((post: any) => {
            // Ensure post has required structure for PostCard
            const postWithAuthor = {
              ...post,
              author: post.author || currentUser,
              comments: post.comments || []
            };
            
            return (
              <PostCard
                key={post.id}
                post={postWithAuthor}
                currentUser={currentUser}
                onLike={handleLikePost}
                onComment={handleCommentPost}
                onShare={handleSharePost}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                isLiked={false} // You can implement this logic based on user data
                className="hover:shadow-lg transition-shadow duration-200"
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منشورات</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'لم يتم العثور على منشورات تطابق البحث' : 'كن أول من ينشر في المجتمع'}
          </p>
          {!searchTerm && (
            <Button
              variant="primary"
              onClick={() => setShowCreatePost(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              إنشاء منشور جديد
            </Button>
          )}
        </div>
      )}
    </div>
  );

  const renderDiscussionsTab = () => (
    <div className="text-center py-12">
      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">النقاشات</h3>
      <p className="text-gray-500">قريباً - ستتمكن من المشاركة في النقاشات المختلفة</p>
    </div>
  );

  const renderLiveRoomsTab = () => (
    <div className="text-center py-12">
      <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">الغرف المباشرة</h3>
      <p className="text-gray-500">قريباً - ستتمكن من حضور الجلسات المباشرة</p>
    </div>
  );

  const renderGroupsTab = () => (
    <div className="text-center py-12">
      <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">المجموعات</h3>
      <p className="text-gray-500">قريباً - ستتمكن من الانضمام إلى المجموعات المختلفة</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">المجتمع</h1>
              <p className="text-gray-600">تواصل مع المحاضرين والطلاب وشارك خبراتك</p>
            </div>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="ابحث في المنشورات والنقاشات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Button
            variant="outline"
            icon={<Filter className="w-4 h-4" />}
          >
            تصفية
          </Button>
        </div>

        {/* Communities Error */}
        {communitiesError && (
          <Alert variant="warning" className="mb-6">
            تعذر تحميل بيانات المجتمعات. بعض الميزات قد لا تعمل بشكل صحيح.
          </Alert>
        )}

        {/* Tabs */}
        <Tabs
          items={tabs.map(tab => ({
            id: tab.id,
            label: tab.label,
            icon: tab.icon,
            content: (() => {
              switch (tab.id) {
                case 'posts':
                  return renderPostsTab();
                case 'discussions':
                  return renderDiscussionsTab();
                case 'live-rooms':
                  return renderLiveRoomsTab();
                case 'groups':
                  return renderGroupsTab();
                default:
                  return <div>المحتوى غير متوفر</div>;
              }
            })(),
          }))}
          defaultActiveTab="posts"
          variant="underline"
          fullWidth
          onTabChange={setActiveTab}
        />

        {/* Post Details Modal */}
        {selectedPost && (
          <PostDetails
            post={{
              ...selectedPost,
              author: selectedPost.author || currentUser,
              comments: selectedPost.comments || []
            }}
            isOpen={!!selectedPost}
            onClose={() => setSelectedPost(null)}
            currentUser={currentUser}
            onLike={handleLikePost}
            onComment={handleCommentPost}
            onShare={handleSharePost}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
            isLiked={false}
          />
        )}
      </div>
    </div>
  );
};

export default CommunitiesPage; 